import type { Project } from "../types";

/**
 * Storage abstraction for Context.
 *
 * The rest of the app depends only on this interface — never on
 * chrome.storage directly. Swapping the MVP's local persistence for a backend
 * (e.g. Supabase) later means writing a new adapter that satisfies this
 * contract, with no changes to the UI or the store hook.
 */
export interface ProjectStore {
  /** Load all projects. Returns an empty array when nothing is stored yet. */
  getProjects(): Promise<Project[]>;
  /** Persist the full list of projects (whole-collection write for the MVP). */
  saveProjects(projects: Project[]): Promise<void>;
}
