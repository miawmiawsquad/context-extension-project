import type { SearchMatch } from "../utils/search";
import { openUrl } from "../utils/chrome";

const BADGE_LABEL: Record<SearchMatch["kind"], string> = {
  project: "Project",
  task: "Task",
  link: "Link",
  tab: "Tab",
};

interface SearchResultsProps {
  query: string;
  results: SearchMatch[];
  onOpenProject: (id: string) => void;
}

export function SearchResults({ query, results, onOpenProject }: SearchResultsProps) {
  if (results.length === 0) {
    return (
      <div className="empty fade-in">
        <div className="empty__title">No results</div>
        <div className="empty__hint">Nothing matches "{query}".</div>
      </div>
    );
  }

  return (
    <div className="fade-in">
      <div className="section__head">
        <span className="section__title">
          {results.length} result{results.length === 1 ? "" : "s"}
        </span>
      </div>
      <div className="stack-gap">
        {results.map((match, i) => (
          <button
            key={`${match.kind}-${i}`}
            className="result"
            onClick={() => {
              // Links and tabs open their URL; projects/tasks open the project.
              if (match.url) openUrl(match.url);
              else onOpenProject(match.project.id);
            }}
          >
            <span className="result__badge">{BADGE_LABEL[match.kind]}</span>
            <div className="result__main">
              <div className="result__label">{match.label}</div>
              <div className="result__project">in {match.project.name}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
