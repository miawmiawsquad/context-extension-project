import { useState } from "react";

interface FaviconProps {
  src?: string;
  /** Fallback initial (usually the first letter of the title/host). */
  alt: string;
}

/**
 * Renders a favicon image, falling back to a small monogram tile when the
 * image is missing or fails to load. Keeps link/tab rows visually stable.
 */
export function Favicon({ src, alt }: FaviconProps) {
  const [failed, setFailed] = useState(false);
  const initial = alt.trim().charAt(0).toUpperCase() || "•";

  if (!src || failed) {
    return <span className="favicon favicon--fallback">{initial}</span>;
  }

  return (
    <img
      className="favicon"
      src={src}
      alt=""
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
}
