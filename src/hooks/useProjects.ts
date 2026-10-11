import { useCallback, useEffect, useMemo, useState } from "react";
import type { Link, Project, SavedTab, Task } from "../types";
import { store } from "../storage";
import { createId } from "../utils/id";
import { faviconForUrl, normalizeUrl } from "../utils/url";
import type { ActiveTabInfo } from "../utils/chrome";

/**
 * Central store hook. Owns the projects array, persists every change through
 * the storage abstraction, and exposes strongly typed mutators.
 *
 * All mutators update React state and write to storage in one step, so the UI
 * stays in sync with what's persisted.
 */
export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    store
      .getProjects()
      .then((loaded) => {
        if (active) setProjects(sortProjects(loaded));
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  /**
   * Apply a pure update to the projects array, persist it, and update state.
   * Every mutator funnels through here so persistence is never forgotten.
   */
  const commit = useCallback((updater: (prev: Project[]) => Project[]) => {
    setProjects((prev) => {
      const next = sortProjects(updater(prev));
      // Fire-and-forget persistence; storage errors are non-fatal for the UI.
      void store.saveProjects(next);
      return next;
    });
  }, []);

  /** Update a single project by id, bumping its updatedAt timestamp. */
  const updateProject = useCallback(
    (id: string, patch: (project: Project) => Project) => {
      commit((prev) =>
        prev.map((p) =>
          p.id === id ? { ...patch(p), updatedAt: Date.now() } : p,
        ),
      );
    },
    [commit],
  );

  // --- Projects -----------------------------------------------------------

  const createProject = useCallback(
    (name: string): Project => {
      const now = Date.now();
      const project: Project = {
        id: createId(),
        name: name.trim() || "Untitled project",
        tasks: [],
        links: [],
        tabs: [],
        pinned: false,
        createdAt: now,
        updatedAt: now,
      };
      commit((prev) => [project, ...prev]);
      return project;
    },
    [commit],
  );

  const renameProject = useCallback(
    (id: string, name: string) => {
      const trimmed = name.trim();
      if (!trimmed) return;
      updateProject(id, (p) => ({ ...p, name: trimmed }));
    },
    [updateProject],
  );

  const deleteProject = useCallback(
    (id: string) => {
      commit((prev) => prev.filter((p) => p.id !== id));
    },
    [commit],
  );

  const togglePinned = useCallback(
    (id: string) => {
      updateProject(id, (p) => ({ ...p, pinned: !p.pinned }));
    },
    [updateProject],
  );

  // --- Tasks --------------------------------------------------------------

  const addTask = useCallback(
    (projectId: string, title: string) => {
      const trimmed = title.trim();
      if (!trimmed) return;
      const task: Task = {
        id: createId(),
        title: trimmed,
        completed: false,
        createdAt: Date.now(),
      };
      updateProject(projectId, (p) => ({ ...p, tasks: [...p.tasks, task] }));
    },
    [updateProject],
  );

  const toggleTask = useCallback(
    (projectId: string, taskId: string) => {
      updateProject(projectId, (p) => ({
        ...p,
        tasks: p.tasks.map((t) =>
          t.id === taskId ? { ...t, completed: !t.completed } : t,
        ),
      }));
    },
    [updateProject],
  );

  const deleteTask = useCallback(
    (projectId: string, taskId: string) => {
      updateProject(projectId, (p) => ({
        ...p,
        tasks: p.tasks.filter((t) => t.id !== taskId),
      }));
    },
    [updateProject],
  );

  // --- Links --------------------------------------------------------------

  const addLink = useCallback(
    (projectId: string, title: string, url: string) => {
      const normalizedUrl = normalizeUrl(url);
      if (!normalizedUrl) return;
      const link: Link = {
        id: createId(),
        title: title.trim() || normalizedUrl,
        url: normalizedUrl,
        favicon: faviconForUrl(normalizedUrl),
      };
      updateProject(projectId, (p) => ({ ...p, links: [...p.links, link] }));
    },
    [updateProject],
  );

  const deleteLink = useCallback(
    (projectId: string, linkId: string) => {
      updateProject(projectId, (p) => ({
        ...p,
        links: p.links.filter((l) => l.id !== linkId),
      }));
    },
    [updateProject],
  );

  // --- Saved tabs ---------------------------------------------------------

  const addTab = useCallback(
    (projectId: string, tab: ActiveTabInfo) => {
      const savedTab: SavedTab = {
        id: createId(),
        title: tab.title || tab.url,
        url: tab.url,
        favicon: tab.favicon ?? faviconForUrl(tab.url),
        savedAt: Date.now(),
      };
      updateProject(projectId, (p) => ({ ...p, tabs: [savedTab, ...p.tabs] }));
    },
    [updateProject],
  );

  const deleteTab = useCallback(
    (projectId: string, tabId: string) => {
      updateProject(projectId, (p) => ({
        ...p,
        tabs: p.tabs.filter((t) => t.id !== tabId),
      }));
    },
    [updateProject],
  );

  const api = useMemo(
    () => ({
      createProject,
      renameProject,
      deleteProject,
      togglePinned,
      addTask,
      toggleTask,
      deleteTask,
      addLink,
      deleteLink,
      addTab,
      deleteTab,
    }),
    [
      createProject,
      renameProject,
      deleteProject,
      togglePinned,
      addTask,
      toggleTask,
      deleteTask,
      addLink,
      deleteLink,
      addTab,
      deleteTab,
    ],
  );

  return { projects, loading, ...api };
}

/** Pinned projects first, then most recently updated. */
function sortProjects(projects: Project[]): Project[] {
  return [...projects].sort((a, b) => {
    if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
    return b.updatedAt - a.updatedAt;
  });
}
