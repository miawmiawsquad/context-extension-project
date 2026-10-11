import type { Progress } from "../utils/progress";

interface ProgressBarProps {
  progress: Progress;
  /** Compact variant used inside project cards. */
  mini?: boolean;
  /** Show the "n/m · x%" label. */
  showLabel?: boolean;
}

export function ProgressBar({ progress, mini, showLabel = true }: ProgressBarProps) {
  const { completed, total, percent } = progress;
  return (
    <div className={`progress${mini ? " progress--mini" : ""}`}>
      <div className="progress__track">
        <div className="progress__fill" style={{ width: `${percent}%` }} />
      </div>
      {showLabel && (
        <span className="progress__label">
          {total === 0 ? "No tasks" : `${completed}/${total} · ${percent}%`}
        </span>
      )}
    </div>
  );
}
