import { ChromeProjectStore } from "./chromeStore";
import type { ProjectStore } from "./types";

export type { ProjectStore } from "./types";

/**
 * The single store instance used by the app. Swap this line to change the
 * persistence backend everywhere at once.
 */
export const store: ProjectStore = new ChromeProjectStore();
