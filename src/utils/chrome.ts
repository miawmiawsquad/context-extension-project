/**
 * Thin wrappers around the Chrome extension APIs used by Context.
 *
 * Every function degrades gracefully when the Chrome APIs are unavailable
 * (e.g. running the popup via `vite dev` in a normal browser tab), so the UI
 * can be developed and previewed outside of the extension sandbox.
 */

export interface ActiveTabInfo {
  title: string;
  url: string;
  favicon?: string;
}

function hasChromeTabs(): boolean {
  return typeof chrome !== "undefined" && !!chrome.tabs;
}

/**
 * Read the currently active tab in the focused window.
 * Requires the `activeTab` permission, which Chrome grants when the user
 * opens the extension popup.
 */
export async function getActiveTab(): Promise<ActiveTabInfo | null> {
  if (!hasChromeTabs()) {
    // Dev fallback: pretend the current page is the active tab.
    if (typeof window !== "undefined") {
      return {
        title: document.title || window.location.href,
        url: window.location.href,
      };
    }
    return null;
  }

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab || !tab.url) return null;

  return {
    title: tab.title?.trim() || tab.url,
    url: tab.url,
    favicon: tab.favIconUrl,
  };
}

/** Open a URL in a new browser tab. Never modifies the current page. */
export async function openUrl(url: string): Promise<void> {
  if (hasChromeTabs()) {
    await chrome.tabs.create({ url });
    return;
  }
  // Dev fallback.
  if (typeof window !== "undefined") {
    window.open(url, "_blank", "noopener,noreferrer");
  }
}
