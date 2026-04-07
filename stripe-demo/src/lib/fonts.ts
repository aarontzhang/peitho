import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadSora } from "@remotion/google-fonts/Sora";

export const inter = loadInter("normal", {
  weights: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

export const sora = loadSora("normal", {
  weights: ["400", "600", "700", "800"],
  subsets: ["latin"],
});
