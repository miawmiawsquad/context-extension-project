import { useEffect, useMemo, useRef, useState } from "react";
import { useProjects } from "./hooks/useProjects";
import { searchProjects } from "./utils/search";
import { getActiveTab } from "./utils/chrome";
import { BrandLogo } from "./components/BrandLogo";
import { PlusIcon, SearchIcon } from "./components/icons";
import { ProjectListView } from "./pages/ProjectListView";
import { ProjectDetailView } from "./pages/ProjectDetailView";
import { SearchResults } from "./pages/SearchResults";

const IS_MAC =
  typeof navigator !== "undefined" && /Mac|iP(hone|ad|od)/.test(navigator.platform);

export default function App() {
  const projects = useProjects();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [creating, setCreating] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  const selected = useMemo(
    () => projects.projects.find((p) => p.id === selectedId) ?? null,
    [projects.projects, selectedId],
  );

  const searching = query.trim().length > 0;
  const results = useMemo(
    () => (searching ? searchProjects(projects.projects, query) : []),
    [searching, projects.projects, query],
  );

  const showSearch = !selected; // Search is a top-level (list) concern.

  // Cmd/Ctrl+K focuses search from anywhere in the list view.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (selected) setSelectedId(null);
        // Focus after the search field is guaranteed to be mounted.
        requestAnimationFrame(() => searchRef.current?.focus());
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selected]);

  async function handleAddCurrentTab(projectId: string) {
    const tab = await getActiveTab();
    if (!tab) return;
    projects.addTab(projectId, tab);
  }

  function openProject(id: string) {
    setSelectedId(id);
    setQuery("");
    setCreating(false);
  }

  return (
    <div className="app">
      <header className="app__header">
        <div className="brand">
          <div className="brand__mark">
            <BrandLogo />
            <span className="brand__name">Context</span>
          </div>
          {showSearch && (
            <button
              className="btn btn--primary btn--add"
              aria-label="New project"
              title="New project"
              onClick={() => {
                setQuery("");
                setCreating(true);
              }}
            >
              <PlusIcon size={12} />
              <span>Add</span>
            </button>
          )}
        </div>

        {showSearch && (
          <div className="search">
            <span className="search__icon">
              <SearchIcon />
            </span>
            <input
              ref={searchRef}
              className="input"
              placeholder="Search projects, tasks, links, tabs"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Escape" && query) {
                  setQuery("");
                  e.currentTarget.blur();
                }
              }}
              aria-label="Search"
            />
            {searching ? (
              <button
                className="icon-btn search__clear"
                aria-label="Clear search"
                onClick={() => {
                  setQuery("");
                  searchRef.current?.focus();
                }}
              >
                <PlusIcon size={16} style={{ transform: "rotate(45deg)" }} />
              </button>
            ) : (
              <span className="search__kbd" aria-hidden>
                {IS_MAC ? "⌘K" : "Ctrl K"}
              </span>
            )}
          </div>
        )}
      </header>

      <main className="app__body">
        {projects.loading ? (
          <div className="empty">
            <div className="empty__hint">Loading…</div>
          </div>
        ) : selected ? (
          <ProjectDetailView
            project={selected}
            onBack={() => setSelectedId(null)}
            onRename={(name) => projects.renameProject(selected.id, name)}
            onDelete={() => {
              projects.deleteProject(selected.id);
              setSelectedId(null);
            }}
            onTogglePin={() => projects.togglePinned(selected.id)}
            onAddTask={(title) => projects.addTask(selected.id, title)}
            onToggleTask={(taskId) => projects.toggleTask(selected.id, taskId)}
            onDeleteTask={(taskId) => projects.deleteTask(selected.id, taskId)}
            onAddLink={(title, url) => projects.addLink(selected.id, title, url)}
            onDeleteLink={(linkId) => projects.deleteLink(selected.id, linkId)}
            onAddCurrentTab={() => handleAddCurrentTab(selected.id)}
            onDeleteTab={(tabId) => projects.deleteTab(selected.id, tabId)}
          />
        ) : searching ? (
          <SearchResults
            query={query}
            results={results}
            onOpenProject={openProject}
          />
        ) : (
          <ProjectListView
            projects={projects.projects}
            creating={creating}
            onOpen={openProject}
            onStartCreate={() => setCreating(true)}
            onCancelCreate={() => setCreating(false)}
            onCreate={(name) => {
              const project = projects.createProject(name);
              setCreating(false);
              setSelectedId(project.id);
            }}
            onTogglePin={(id) => projects.togglePinned(id)}
          />
        )}
      </main>
    </div>
  );
}
