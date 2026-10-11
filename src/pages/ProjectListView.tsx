import { useState } from "react";
import type { Project } from "../types";
import { projectProgress } from "../utils/progress";
import { StarIcon } from "../components/icons";

interface ProjectListViewProps {
  projects: Project[];
  /** Whether the inline "new project" input is showing (owned by App). */
  creating: boolean;
  onOpen: (id: string) => void;
  onCreate: (name: string) => void;
  onCancelCreate: () => void;
  onStartCreate: () => void;
  onTogglePin: (id: string) => void;
}

export function ProjectListView({
  projects,
  creating,
  onOpen,
  onCreate,
  onCancelCreate,
  onStartCreate,
  onTogglePin,
}: ProjectListViewProps) {
  const [name, setName] = useState("");

  function submit() {
    const trimmed = name.trim();
    if (!trimmed) {
      onCancelCreate();
      return;
    }
    onCreate(trimmed);
    setName("");
  }

  function cancel() {
    setName("");
    onCancelCreate();
  }

  const empty = projects.length === 0 && !creating;

  return (
    <div className="fade-in">
      {!empty && (
        <div className="section__head">
          <span className="section__title">Projects</span>
          <span className="section__count">
            {projects.length > 0 ? projects.length : ""}
          </span>
        </div>
      )}

      {creating && (
        <div className="add-form">
          <input
            className="input"
            autoFocus
            placeholder="Project name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") submit();
              if (e.key === "Escape") cancel();
            }}
            onBlur={submit}
          />
          <button
            className="btn btn--primary"
            onMouseDown={(e) => e.preventDefault()}
            onClick={submit}
          >
            Add
          </button>
        </div>
      )}

      {empty ? (
        <div className="empty">
          <div className="empty__title">No projects yet</div>
          <div className="empty__hint">
            Create your first project to keep your work in context.
          </div>
          <button className="btn btn--primary" onClick={onStartCreate}>
            New project
          </button>
        </div>
      ) : (
        <div className="project-list">
          {projects.map((project) => (
            <ProjectRow
              key={project.id}
              project={project}
              onOpen={() => onOpen(project.id)}
              onTogglePin={() => onTogglePin(project.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function ProjectRow({
  project,
  onOpen,
  onTogglePin,
}: {
  project: Project;
  onOpen: () => void;
  onTogglePin: () => void;
}) {
  const { completed, total, percent } = projectProgress(project);

  return (
    <div
      className="project-row"
      onClick={onOpen}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen();
        }
      }}
    >
      <div className="project-row__main">
        <div className="project-row__name">
          {project.pinned && (
            <span className="pin-dot" aria-hidden>
              <StarIcon filled size={12} />
            </span>
          )}
          <span>{project.name}</span>
        </div>
        <div
          className={`project-row__meta${total === 0 ? " project-row__meta--muted" : ""}`}
        >
          {summaryLine(project, completed, total)}
        </div>
      </div>

      <div className="project-row__right">
        {total > 0 && (
          <span
            className={`project-row__pct${percent === 100 ? " project-row__pct--complete" : ""}`}
          >
            {percent}%
          </span>
        )}
        <button
          className={`icon-btn project-row__pin${project.pinned ? " icon-btn--active" : ""}`}
          aria-label={project.pinned ? "Unpin project" : "Pin project"}
          onClick={(e) => {
            e.stopPropagation();
            onTogglePin();
          }}
        >
          <StarIcon filled={project.pinned} />
        </button>
      </div>
    </div>
  );
}

/** Human summary line, e.g. "3 of 4 tasks completed" or resource counts. */
function summaryLine(project: Project, completed: number, total: number): string {
  if (total > 0) {
    return `${completed} of ${total} task${total === 1 ? "" : "s"} completed`;
  }
  const parts: string[] = [];
  if (project.links.length > 0) {
    parts.push(`${project.links.length} link${project.links.length === 1 ? "" : "s"}`);
  }
  if (project.tabs.length > 0) {
    parts.push(`${project.tabs.length} tab${project.tabs.length === 1 ? "" : "s"}`);
  }
  return parts.length > 0 ? parts.join(" · ") : "No tasks yet";
}
