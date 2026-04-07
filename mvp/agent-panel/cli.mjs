#!/usr/bin/env node

// Peitho Agent Panel — Interactive CLI
// Talk to 10 simulated customer personas, show them ads, broadcast news,
// run focus groups, and persist session state.

import readline from "readline";
import { AgentPanel } from "./agents.mjs";
import { loadAllPersonas, loadCampaignPersonas } from "./personas.mjs";

const panel = new AgentPanel();

// ── Colors ────────────────────────────────────────────────────────────

const dim = (s) => `\x1b[2m${s}\x1b[0m`;
const bold = (s) => `\x1b[1m${s}\x1b[0m`;
const cyan = (s) => `\x1b[36m${s}\x1b[0m`;
const green = (s) => `\x1b[32m${s}\x1b[0m`;
const yellow = (s) => `\x1b[33m${s}\x1b[0m`;
const magenta = (s) => `\x1b[35m${s}\x1b[0m`;

// ── Helpers ───────────────────────────────────────────────────────────

function printHeader() {
  console.log();
  console.log(bold("━━━ Peitho Agent Panel ━━━"));
  console.log(dim("Simulated customer personas you can talk to.\n"));
}

function printHelp() {
  console.log(`
${bold("Commands:")}
  ${cyan("agents")}                     List all active agents
  ${cyan("talk")} ${dim("<id> <message>")}        Chat with a specific agent
  ${cyan("react")} ${dim("<id>")}                 Show an ad to an agent (paste ad copy after)
  ${cyan("broadcast")} ${dim("<message>")}        Send news/update to ALL agents (concurrent)
  ${cyan("focus")} ${dim("<question>")}           Ask ALL agents the same question (focus group)
  ${cyan("react-all")}                   Show an ad to ALL agents (paste ad copy after)
  ${cyan("interview")} ${dim("<id>")}            Run structured 3-question interview with an agent
  ${cyan("state")} ${dim("<id>")}                 View an agent's state and history summary
  ${cyan("save")} ${dim("[name]")}                Save session state (default: "default")
  ${cyan("load")} ${dim("[name]")}                Load a saved session
  ${cyan("help")}                       Show this help
  ${cyan("quit")}                       Save and exit
`);
}

function printAgentList() {
  const agents = panel.list();
  console.log(`\n${bold(`${agents.length} agents active:`)}\n`);

  const maxId = Math.max(...agents.map((a) => a.id.length));
  const maxCampaign = Math.max(...agents.map((a) => a.campaign.length));

  for (const a of agents) {
    const msgs = a.messages > 0 ? yellow(` (${a.messages} msgs)`) : dim(" (fresh)");
    console.log(
      `  ${cyan(a.id.padEnd(maxId))}  ${dim(a.campaign.padEnd(maxCampaign))}  ${a.role}${msgs}`
    );
  }
  console.log();
}

async function readMultiline(rl, prompt) {
  console.log(dim(`${prompt} (type END on its own line to finish):`));
  const lines = [];
  return new Promise((resolve) => {
    const handler = (line) => {
      if (line.trim() === "END") {
        rl.removeListener("line", handler);
        resolve(lines.join("\n"));
      } else {
        lines.push(line);
      }
    };
    rl.on("line", handler);
  });
}

// ── Command handlers ──────────────────────────────────────────────────

async function handleTalk(args, rl) {
  const spaceIdx = args.indexOf(" ");
  if (spaceIdx === -1) {
    console.log(dim("Usage: talk <agent-id> <message>"));
    return;
  }
  const agentId = args.slice(0, spaceIdx);
  const message = args.slice(spaceIdx + 1);

  if (!panel.get(agentId)) {
    console.log(dim(`Agent "${agentId}" not found. Type "agents" to see available IDs.`));
    return;
  }

  process.stdout.write(dim(`\n${agentId} is thinking...`));
  const response = await panel.chat(agentId, message);
  process.stdout.write("\r" + " ".repeat(40) + "\r");
  console.log(`\n${magenta(agentId)}${dim(` (${panel.get(agentId).role})`)}`);
  console.log(response);
  console.log();
}

async function handleReact(args, rl) {
  const agentId = args.trim();
  if (!agentId) {
    console.log(dim("Usage: react <agent-id>"));
    return;
  }
  if (!panel.get(agentId)) {
    console.log(dim(`Agent "${agentId}" not found. Type "agents" to see available IDs.`));
    return;
  }

  const adCopy = await readMultiline(rl, "Paste the ad copy");

  process.stdout.write(dim(`\n${agentId} is evaluating the ad...`));
  const response = await panel.react(agentId, adCopy);
  process.stdout.write("\r" + " ".repeat(50) + "\r");
  console.log(`\n${magenta(agentId)}${dim(` (${panel.get(agentId).role})`)}`);
  console.log(response);
  console.log();
}

async function handleBroadcast(args) {
  if (!args.trim()) {
    console.log(dim("Usage: broadcast <news or context update>"));
    return;
  }

  const agentCount = panel.list().length;
  process.stdout.write(dim(`\nBroadcasting to ${agentCount} agents...`));

  const results = await panel.broadcast(args);
  process.stdout.write("\r" + " ".repeat(50) + "\r");

  console.log(`\n${bold("Broadcast reactions:")}\n`);
  for (const r of results) {
    console.log(`${magenta(r.id)}${dim(` (${r.role})`)}`);
    console.log(r.response);
    console.log();
  }
}

async function handleFocus(args) {
  if (!args.trim()) {
    console.log(dim("Usage: focus <question for all agents>"));
    return;
  }

  const agentCount = panel.list().length;
  process.stdout.write(dim(`\nAsking ${agentCount} agents...`));

  const results = await panel.focusGroup(args);
  process.stdout.write("\r" + " ".repeat(50) + "\r");

  console.log(`\n${bold("Focus group responses:")}\n`);
  for (const r of results) {
    console.log(`${magenta(r.id)}${dim(` [${r.campaign}] ${r.role}`)}`);
    console.log(r.response);
    console.log();
  }
}

async function handleReactAll(rl) {
  const adCopy = await readMultiline(rl, "Paste the ad copy");

  const agentCount = panel.list().length;
  process.stdout.write(dim(`\n${agentCount} agents evaluating the ad...`));

  const results = await panel.reactAll(adCopy);
  process.stdout.write("\r" + " ".repeat(50) + "\r");

  console.log(`\n${bold("Ad reactions from all agents:")}\n`);
  for (const r of results) {
    console.log(`${magenta(r.id)}${dim(` [${r.campaign}] ${r.role}`)}`);
    console.log(r.response);
    console.log();
  }
}

async function handleInterview(args) {
  const agentId = args.trim();
  if (!agentId) {
    console.log(dim("Usage: interview <agent-id>"));
    return;
  }
  if (!panel.get(agentId)) {
    console.log(dim(`Agent "${agentId}" not found.`));
    return;
  }

  console.log(dim(`\nRunning structured interview with ${agentId}...\n`));

  const result = await panel.interview(agentId);

  console.log(`${bold(`Interview: ${result.role}`)}\n`);
  for (const item of result.insights) {
    console.log(dim(`Q: ${item.question}`));
    console.log(`${magenta(result.id)}: ${item.response}\n`);
  }
}

function handleState(args) {
  const agentId = args.trim();
  if (!agentId) {
    console.log(dim("Usage: state <agent-id>"));
    return;
  }
  if (!panel.get(agentId)) {
    console.log(dim(`Agent "${agentId}" not found.`));
    return;
  }

  const state = panel.getAgentState(agentId);
  console.log(`\n${bold(state.id)}${dim(` (${state.role})`)}`);
  console.log(`  Campaign:     ${state.campaignName}`);
  console.log(`  Segment:      ${state.segment}`);
  console.log(`  Messages:     ${state.messageCount}`);
  console.log(`  News items:   ${state.newsCount}`);
  console.log(`  Last:         ${dim(state.lastInteraction)}`);
  console.log();
}

async function handleSave(args) {
  const name = args.trim() || "default";
  const filePath = await panel.save(name);
  console.log(green(`Session saved: ${filePath}`));
}

async function handleLoad(args) {
  const name = args.trim() || "default";
  try {
    const count = await panel.load(name);
    console.log(green(`Session loaded: ${count} agents restored.`));
  } catch (err) {
    if (err.code === "ENOENT") {
      console.log(dim(`No saved session "${name}" found.`));
    } else {
      throw err;
    }
  }
}

// ── Main ──────────────────────────────────────────────────────────────

async function main() {
  printHeader();

  // Initialize all 10 agents
  const personas = loadAllPersonas();
  for (const persona of personas) {
    panel.addAgent(persona);
  }
  console.log(green(`Initialized ${personas.length} agents (${[...new Set(personas.map((p) => p.campaignName))].join(" + ")} campaigns)\n`));

  printAgentList();
  printHelp();

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: bold("> "),
  });

  rl.prompt();

  rl.on("line", async (line) => {
    const trimmed = line.trim();
    if (!trimmed) {
      rl.prompt();
      return;
    }

    const spaceIdx = trimmed.indexOf(" ");
    const command = spaceIdx === -1 ? trimmed : trimmed.slice(0, spaceIdx);
    const args = spaceIdx === -1 ? "" : trimmed.slice(spaceIdx + 1);

    try {
      switch (command) {
        case "agents":
          printAgentList();
          break;
        case "talk":
          await handleTalk(args, rl);
          break;
        case "react":
          await handleReact(args, rl);
          break;
        case "broadcast":
          await handleBroadcast(args);
          break;
        case "focus":
          await handleFocus(args);
          break;
        case "react-all":
          await handleReactAll(rl);
          break;
        case "interview":
          await handleInterview(args);
          break;
        case "state":
          handleState(args);
          break;
        case "save":
          await handleSave(args);
          break;
        case "load":
          await handleLoad(args);
          break;
        case "help":
          printHelp();
          break;
        case "quit":
        case "exit":
          await handleSave("autosave");
          console.log(dim("\nSession autosaved. Goodbye.\n"));
          process.exit(0);
          break;
        default:
          console.log(dim(`Unknown command: ${command}. Type "help" for commands.`));
      }
    } catch (err) {
      console.error(`\n${yellow("Error:")} ${err.message}\n`);
    }

    rl.prompt();
  });

  rl.on("close", async () => {
    await handleSave("autosave");
    console.log(dim("\nSession autosaved. Goodbye.\n"));
    process.exit(0);
  });
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
