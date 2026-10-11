import type { Project } from "../types";
import type { ProjectStore } from "./types";

const STORAGE_KEY = "context.projects";

function hasChromeStorage(): boolean {
  return (
    typeof chrome !== "undefined" &&
    !!chrome.storage &&
    !!chrome.storage.local
  );
}

/**
 * ProjectStore backed by chrome.storage.local, with a graceful fallback to
 * window.localStorage so the popup also works during `vite dev`.
 *
 * Only this file knows how projects are physically persisted. To move to a
 * backend later, implement a new ProjectStore and swap it in main.tsx.
 */
export class ChromeProjectStore implements ProjectStore {
  async getProjects(): Promise<Project[]> {
    if (hasChromeStorage()) {
      const result = await chrome.storage.local.get(STORAGE_KEY);
      return (result[STORAGE_KEY] as Project[] | undefined) ?? [];
    }
    return this.readLocalStorage();
  }

  async saveProjects(projects: Project[]): Promise<void> {
    if (hasChromeStorage()) {
      await chrome.storage.local.set({ [STORAGE_KEY]: projects });
      return;
    }
    this.writeLocalStorage(projects);
  }

  private readLocalStorage(): Project[] {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as Project[]) : [];
    } catch {
      return [];
    }
  }

  private writeLocalStorage(projects: Project[]): void {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
    } catch {
      // Ignore quota/serialization errors in the dev fallback.
    }
  }
}
