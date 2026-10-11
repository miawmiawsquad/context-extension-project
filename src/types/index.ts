/**
 * Core domain types for Context.
 *
 * These interfaces are the single source of truth for the shape of data that
 * flows through the UI and the storage layer. Keep them free of any storage-
 * or Chrome-specific concerns so they can be reused if the backend changes.
 */

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  createdAt: number;
}

export interface Link {
  id: string;
  title: string;
  url: string;
  /** Optional favicon URL, typically derived from the link's origin. */
  favicon?: string;
}

export interface SavedTab {
  id: string;
  title: string;
  url: string;
  favicon?: string;
  savedAt: number;
}

export interface Project {
  id: string;
  name: string;
  tasks: Task[];
  links: Link[];
  tabs: SavedTab[];
  pinned: boolean;
  createdAt: number;
  updatedAt: number;
}

/** The complete persisted state for the extension. */
export interface AppState {
  projects: Project[];
}
