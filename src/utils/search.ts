import type { Project } from "../types";

export type SearchMatchKind = "project" | "task" | "link" | "tab";

export interface SearchMatch {
  kind: SearchMatchKind;
  /** Text that matched, shown as the result's primary label. */
  label: string;
  /** The project this match belongs to (used to navigate on click). */
  project: Project;
  /** For links/tabs, the URL to open on click. */
  url?: string;
}

/**
 * Global search across project names, task titles, link titles and saved tab
 * titles. Case-insensitive substring match — fast enough to run on every
 * keystroke for a local dataset.
 */
export function searchProjects(projects: Project[], query: string): SearchMatch[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const matches: SearchMatch[] = [];

  for (const project of projects) {
    if (project.name.toLowerCase().includes(q)) {
      matches.push({ kind: "project", label: project.name, project });
    }
    for (const task of project.tasks) {
      if (task.title.toLowerCase().includes(q)) {
        matches.push({ kind: "task", label: task.title, project });
      }
    }
    for (const link of project.links) {
      if (link.title.toLowerCase().includes(q)) {
        matches.push({ kind: "link", label: link.title, project, url: link.url });
      }
    }
    for (const tab of project.tabs) {
      if (tab.title.toLowerCase().includes(q)) {
        matches.push({ kind: "tab", label: tab.title, project, url: tab.url });
      }
    }
  }

  return matches;
}
