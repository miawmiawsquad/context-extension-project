# Context

> Keep every project in context.

A lightweight project workspace Chrome extension (Manifest V3) for people who
work across many tabs, design tools, dev tools, and project links. Each project
holds tasks, links, and saved tabs — all stored locally, no backend, no sign-in.

## Features

- **Projects** — create, rename, delete, open, and pin/favorite.
- **Tasks** — add, complete/uncomplete, delete, with automatic progress (e.g. `3/5 · 60%`).
- **Links** — save useful URLs (Figma, GitHub, Vercel, docs…); click to open in a new tab.
- **Save current tab** — capture the active tab's title + URL into a project.
- **Global search** — instant, across project names, tasks, links, and saved tabs.

## Tech

Manifest V3 · React · TypeScript · Vite · `chrome.storage.local` · `chrome.tabs`
No backend, no auth, no external APIs.

## Develop

```bash
npm install
npm run dev        # preview the popup UI in a normal browser tab (uses localStorage fallback)
npm run build      # produce the production extension in dist/
npm run typecheck  # type-check only
```

`npm run dev` runs the popup as a normal web page for fast UI iteration. The
Chrome-only APIs degrade gracefully there (localStorage stands in for
`chrome.storage`, and "Add current tab" reads the dev page itself).

## Load into Chrome

1. Run `npm install` and `npm run build` to produce the `dist/` folder.
2. Open `chrome://extensions`.
3. Enable **Developer mode** (top-right toggle).
4. Click **Load unpacked**.
5. Select the **`dist/`** folder in this project.
6. Pin **Context** from the extensions menu and click it to open the popup.

After code changes, re-run `npm run build` and click the **reload** icon on the
Context card in `chrome://extensions`.

## Architecture

```
src/
  types/           Domain interfaces (Project, Task, Link, SavedTab)
  storage/         Storage abstraction (ProjectStore) + chrome.storage adapter
  utils/           Chrome API wrappers, URL/id/progress/search helpers
  hooks/           useProjects — the central store hook with all mutators
  components/      Reusable UI (icons, ProgressBar, Favicon, BrandLogo)
  pages/           Views (ProjectListView, ProjectDetailView, SearchResults)
  App.tsx          View routing + top-level wiring
```

The storage layer is deliberately isolated behind the `ProjectStore` interface
(`src/storage/types.ts`). To move off local storage later (e.g. to Supabase),
implement a new `ProjectStore` and swap the instance in `src/storage/index.ts` —
no UI changes required.

## Permissions

Minimal by design:

- `storage` — persist projects locally via `chrome.storage.local`.
- `activeTab` — read the active tab's title/URL only when you open the popup and
  click "Add current tab". The extension never modifies the page you're viewing.
