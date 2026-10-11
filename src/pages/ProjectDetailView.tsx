import { useState } from "react";
import type { Project } from "../types";
import { projectProgress } from "../utils/progress";
import { ProgressBar } from "../components/ProgressBar";
import { Favicon } from "../components/Favicon";
import {
  CheckIcon,
  ChevronLeftIcon,
  ExternalIcon,
  PlusIcon,
  StarIcon,
  TabIcon,
  TrashIcon,
} from "../components/icons";
import { hostnameForUrl } from "../utils/url";
import { openUrl } from "../utils/chrome";

interface ProjectDetailViewProps {
  project: Project;
  onBack: () => void;
  onRename: (name: string) => void;
  onDelete: () => void;
  onTogglePin: () => void;
  onAddTask: (title: string) => void;
  onToggleTask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  onAddLink: (title: string, url: string) => void;
  onDeleteLink: (linkId: string) => void;
  onAddCurrentTab: () => Promise<void>;
  onDeleteTab: (tabId: string) => void;
}

export function ProjectDetailView(props: ProjectDetailViewProps) {
  const { project } = props;
  const progress = projectProgress(project);

  return (
    <div className="fade-in">
      {/* Header */}
      <div className="detail__top">
        <button className="icon-btn" aria-label="Back" onClick={props.onBack}>
          <ChevronLeftIcon />
        </button>
        <div className="detail__title-wrap">
          <EditableTitle name={project.name} onRename={props.onRename} />
        </div>
        <button
          className={`icon-btn${project.pinned ? " icon-btn--active" : ""}`}
          aria-label={project.pinned ? "Unpin" : "Pin"}
          onClick={props.onTogglePin}
        >
          <StarIcon filled={project.pinned} />
        </button>
        <DeleteProjectButton name={project.name} onDelete={props.onDelete} />
      </div>

      <div className="detail__progress">
        <ProgressBar progress={progress} />
      </div>

      {/* Tasks */}
      <TasksSection
        project={project}
        onAdd={props.onAddTask}
        onToggle={props.onToggleTask}
        onDelete={props.onDeleteTask}
      />

      {/* Links */}
      <LinksSection
        project={project}
        onAdd={props.onAddLink}
        onDelete={props.onDeleteLink}
      />

      {/* Saved tabs */}
      <TabsSection
        project={project}
        onAddCurrentTab={props.onAddCurrentTab}
        onDelete={props.onDeleteTab}
      />
    </div>
  );
}

/* -------------------------------------------------------------------------- */

function EditableTitle({
  name,
  onRename,
}: {
  name: string;
  onRename: (name: string) => void;
}) {
  const [value, setValue] = useState(name);

  return (
    <input
      className="detail__title"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onBlur={() => {
        const trimmed = value.trim();
        if (trimmed && trimmed !== name) onRename(trimmed);
        else setValue(name);
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter") (e.target as HTMLInputElement).blur();
        if (e.key === "Escape") {
          setValue(name);
          (e.target as HTMLInputElement).blur();
        }
      }}
      aria-label="Project name"
      spellCheck={false}
    />
  );
}

function DeleteProjectButton({
  name,
  onDelete,
}: {
  name: string;
  onDelete: () => void;
}) {
  const [confirm, setConfirm] = useState(false);

  if (confirm) {
    return (
      <button
        className="btn"
        style={{ borderColor: "var(--danger)", color: "var(--danger)" }}
        onClick={onDelete}
        onBlur={() => setConfirm(false)}
        autoFocus
        title={`Delete "${name}"`}
      >
        Delete?
      </button>
    );
  }
  return (
    <button
      className="icon-btn icon-btn--danger"
      aria-label="Delete project"
      onClick={() => setConfirm(true)}
    >
      <TrashIcon />
    </button>
  );
}

/* -------------------------------------------------------------------------- */

function TasksSection({
  project,
  onAdd,
  onToggle,
  onDelete,
}: {
  project: Project;
  onAdd: (title: string) => void;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const [title, setTitle] = useState("");

  function submit() {
    if (!title.trim()) return;
    onAdd(title);
    setTitle("");
  }

  return (
    <section className="section">
      <div className="section__head">
        <span className="section__title">Tasks</span>
      </div>

      <div className="stack-gap">
        {project.tasks.length === 0 && (
          <div className="list-empty">Nothing to do yet.</div>
        )}
        {project.tasks.map((task) => (
          <div className="row" key={task.id}>
            <button
              className={`check${task.completed ? " check--done" : ""}`}
              aria-label={task.completed ? "Mark incomplete" : "Mark complete"}
              onClick={() => onToggle(task.id)}
            >
              <CheckIcon />
            </button>
            <div className="row__main">
              <div className={`row__title${task.completed ? " row__title--done" : ""}`}>
                {task.title}
              </div>
            </div>
            <div className="row__actions">
              <button
                className="icon-btn icon-btn--danger"
                aria-label="Delete task"
                onClick={() => onDelete(task.id)}
              >
                <TrashIcon />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="add-form">
        <input
          className="input"
          placeholder="Add a task"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
        />
        <button className="btn" onClick={submit} aria-label="Add task">
          <PlusIcon />
        </button>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */

function LinksSection({
  project,
  onAdd,
  onDelete,
}: {
  project: Project;
  onAdd: (title: string, url: string) => void;
  onDelete: (id: string) => void;
}) {
  const [adding, setAdding] = useState(false);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");

  function submit() {
    if (!url.trim()) {
      setAdding(false);
      return;
    }
    onAdd(title, url);
    setTitle("");
    setUrl("");
    setAdding(false);
  }

  return (
    <section className="section">
      <div className="section__head">
        <span className="section__title">Links</span>
        {!adding && (
          <button className="btn btn--ghost" onClick={() => setAdding(true)}>
            <PlusIcon /> Add
          </button>
        )}
      </div>

      <div className="stack-gap">
        {project.links.length === 0 && !adding && (
          <div className="list-empty">No links yet. Add one to jump back in.</div>
        )}
        {project.links.map((link) => (
          <div
            className="row row--link"
            key={link.id}
            onClick={() => openUrl(link.url)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                openUrl(link.url);
              }
            }}
          >
            <Favicon src={link.favicon} alt={link.title} />
            <div className="row__main">
              <div className="row__title">{link.title}</div>
              <div className="row__sub">{hostnameForUrl(link.url)}</div>
            </div>
            <div className="row__actions">
              <span className="icon-btn" aria-hidden>
                <ExternalIcon />
              </span>
              <button
                className="icon-btn icon-btn--danger"
                aria-label="Delete link"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(link.id);
                }}
              >
                <TrashIcon />
              </button>
            </div>
          </div>
        ))}
      </div>

      {adding && (
        <div className="add-form add-form--stack">
          <input
            className="input"
            autoFocus
            placeholder="URL (e.g. figma.com/…)"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") submit();
              if (e.key === "Escape") setAdding(false);
            }}
          />
          <div className="add-form">
            <input
              className="input"
              placeholder="Title (optional)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") submit();
                if (e.key === "Escape") setAdding(false);
              }}
            />
            <button className="btn btn--primary" onClick={submit}>
              Save
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

/* -------------------------------------------------------------------------- */

function TabsSection({
  project,
  onAddCurrentTab,
  onDelete,
}: {
  project: Project;
  onAddCurrentTab: () => Promise<void>;
  onDelete: (id: string) => void;
}) {
  const [busy, setBusy] = useState(false);

  async function handleAdd() {
    setBusy(true);
    try {
      await onAddCurrentTab();
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="section">
      <div className="section__head">
        <span className="section__title">Saved tabs</span>
      </div>

      <div style={{ padding: "0 6px 8px" }}>
        <button
          className="btn btn--subtle btn--block"
          onClick={handleAdd}
          disabled={busy}
        >
          <TabIcon /> {busy ? "Adding…" : "Add current tab"}
        </button>
      </div>

      <div className="stack-gap">
        {project.tabs.length === 0 && (
          <div className="list-empty">Save the tab you're working on.</div>
        )}
        {project.tabs.map((tab) => (
          <div
            className="row row--link"
            key={tab.id}
            onClick={() => openUrl(tab.url)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                openUrl(tab.url);
              }
            }}
          >
            <Favicon src={tab.favicon} alt={tab.title} />
            <div className="row__main">
              <div className="row__title">{tab.title}</div>
              <div className="row__sub">{hostnameForUrl(tab.url)}</div>
            </div>
            <div className="row__actions">
              <button
                className="icon-btn icon-btn--danger"
                aria-label="Delete saved tab"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(tab.id);
                }}
              >
                <TrashIcon />
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
