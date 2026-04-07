// Peitho Agent Panel — Agent Manager
// Each agent is a persistent Claude conversation with a persona system prompt.
// Supports chat, broadcast, ad reactions, focus groups, and state persistence.

import Anthropic from "@anthropic-ai/sdk";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const STATE_DIR = path.join(__dirname, "state");
const MODEL = "claude-sonnet-4-20250514";

const client = new Anthropic();

class Agent {
  constructor(config) {
    this.id = config.id;
    this.campaignName = config.campaignName;
    this.role = config.role;
    this.segment = config.segment;
    this.systemPrompt = config.systemPrompt;
    this.messages = [];
    this.newsLog = [];
  }

  async chat(userMessage) {
    this.messages.push({ role: "user", content: userMessage });

    const response = await client.messages.create({
      model: MODEL,
      max_tokens: 512,
      system: this.systemPrompt,
      messages: this.messages,
    });

    const text = response.content[0].text;
    this.messages.push({ role: "assistant", content: text });
    return text;
  }

  async react(adCopy) {
    const prompt = `You're scrolling through your LinkedIn feed and you see this ad:

---
${adCopy}
---

React naturally. What's your gut reaction? Would you stop scrolling? Would you click? What works, what doesn't? Be honest and specific to your actual professional situation.`;

    return this.chat(prompt);
  }

  async receiveNews(newsItem) {
    this.newsLog.push({ text: newsItem, timestamp: new Date().toISOString() });

    const prompt = `[Context update — this is new information relevant to your professional world]

${newsItem}

How does this affect your thinking? Brief reaction — 2-3 sentences max.`;

    return this.chat(prompt);
  }

  getState() {
    return {
      id: this.id,
      campaignName: this.campaignName,
      role: this.role,
      segment: this.segment,
      messageCount: this.messages.length,
      newsCount: this.newsLog.length,
      lastInteraction: this.messages.length > 0
        ? this.messages[this.messages.length - 1].content.slice(0, 100) + "..."
        : "(none)",
    };
  }

  toJSON() {
    return {
      id: this.id,
      campaignName: this.campaignName,
      role: this.role,
      segment: this.segment,
      systemPrompt: this.systemPrompt,
      messages: this.messages,
      newsLog: this.newsLog,
    };
  }

  static fromJSON(data) {
    const agent = new Agent({
      id: data.id,
      campaignName: data.campaignName,
      role: data.role,
      segment: data.segment,
      systemPrompt: data.systemPrompt,
    });
    agent.messages = data.messages || [];
    agent.newsLog = data.newsLog || [];
    return agent;
  }
}

export class AgentPanel {
  constructor() {
    this.agents = new Map();
  }

  addAgent(config) {
    const agent = new Agent(config);
    this.agents.set(agent.id, agent);
    return agent;
  }

  get(id) {
    return this.agents.get(id);
  }

  list() {
    return Array.from(this.agents.values()).map((a) => ({
      id: a.id,
      campaign: a.campaignName,
      role: a.role,
      messages: a.messages.length,
    }));
  }

  async chat(agentId, message) {
    const agent = this.agents.get(agentId);
    if (!agent) throw new Error(`Agent not found: ${agentId}`);
    return agent.chat(message);
  }

  async react(agentId, adCopy) {
    const agent = this.agents.get(agentId);
    if (!agent) throw new Error(`Agent not found: ${agentId}`);
    return agent.react(adCopy);
  }

  async broadcast(message) {
    const results = [];
    const entries = Array.from(this.agents.entries());

    // Run all agents concurrently
    const promises = entries.map(async ([id, agent]) => {
      const response = await agent.receiveNews(message);
      return { id, role: agent.role, response };
    });

    return Promise.all(promises);
  }

  async focusGroup(question) {
    const entries = Array.from(this.agents.entries());

    const promises = entries.map(async ([id, agent]) => {
      const response = await agent.chat(question);
      return { id, role: agent.role, campaign: agent.campaignName, response };
    });

    return Promise.all(promises);
  }

  async reactAll(adCopy) {
    const entries = Array.from(this.agents.entries());

    const promises = entries.map(async ([id, agent]) => {
      const response = await agent.react(adCopy);
      return { id, role: agent.role, campaign: agent.campaignName, response };
    });

    return Promise.all(promises);
  }

  async interview(agentId) {
    const agent = this.agents.get(agentId);
    if (!agent) throw new Error(`Agent not found: ${agentId}`);

    const questions = [
      "What's the single biggest problem you face in your role right now that a product or service could solve?",
      "When you see ads on LinkedIn, what makes you actually stop and pay attention versus scroll past?",
      "Think about the last B2B product you evaluated seriously. What convinced you to take the next step?",
    ];

    const responses = [];
    for (const q of questions) {
      const response = await agent.chat(q);
      responses.push({ question: q, response });
    }

    return {
      id: agent.id,
      role: agent.role,
      campaign: agent.campaignName,
      insights: responses,
    };
  }

  getAgentState(agentId) {
    const agent = this.agents.get(agentId);
    if (!agent) throw new Error(`Agent not found: ${agentId}`);
    return agent.getState();
  }

  async save(sessionName = "default") {
    await fs.mkdir(STATE_DIR, { recursive: true });
    const data = {};
    for (const [id, agent] of this.agents) {
      data[id] = agent.toJSON();
    }
    const filePath = path.join(STATE_DIR, `${sessionName}.json`);
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
    return filePath;
  }

  async load(sessionName = "default") {
    const filePath = path.join(STATE_DIR, `${sessionName}.json`);
    const raw = await fs.readFile(filePath, "utf-8");
    const data = JSON.parse(raw);

    this.agents.clear();
    for (const [id, agentData] of Object.entries(data)) {
      this.agents.set(id, Agent.fromJSON(agentData));
    }
    return this.agents.size;
  }
}
