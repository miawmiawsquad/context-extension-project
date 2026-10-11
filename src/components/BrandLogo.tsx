/**
 * The Context brand mark. Uses the packaged extension icon (icons/icon128.png)
 * so the popup logo always matches the toolbar/store icon. The path is relative
 * to the popup document, which loads from the extension package root.
 */
export function BrandLogo({ size = 20 }: { size?: number }) {
  return (
    <img
      className="brand__logo"
      src="icons/icon128.png"
      width={size}
      height={size}
      alt="Context"
    />
  );
}
