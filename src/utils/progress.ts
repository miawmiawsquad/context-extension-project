import type { Project } from "../types";

export interface Progress {
  completed: number;
  total: number;
  /** Percentage 0–100, rounded. 0 when there are no tasks. */
  percent: number;
}

/** Compute task completion progress for a project. */
export function projectProgress(project: Project): Progress {
  const total = project.tasks.length;
  const completed = project.tasks.filter((t) => t.completed).length;
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);
  return { completed, total, percent };
}
