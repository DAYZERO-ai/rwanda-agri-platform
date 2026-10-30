# Ubuminzi Rwanda

Digital platform for Rwandan farmers: bookkeeping, market prices, weather,
learning guides and subscription billing. React + Vite + Tailwind, with an
optional Supabase sync layer and a fully offline fallback.

---

## Option 1 - Double-click, zero server, zero CORS (recommended for reviewers)

Open this file directly in any browser:

```
public/rwanda_agriculture.html
```

(or `rwanda_agriculture.html` inside `dist/` after a build)

It is a plain, self-contained HTML file with no ES modules, so `file://`
security never blocks it: no CORS errors, no missing asset paths, no server
required. Data is stored in `localStorage`, so everything you add survives a
refresh.

You can also reach it from the running app: the **Offline copy** button in the
header and the **Standalone offline HTML** link in the footer.

## Option 2 - Serve the production build locally

```bash
bun install
bun run build          # writes dist/
bun run preview        # http://localhost:3000
```

`vite.config.ts` sets `base: "./"`, so every asset in `dist/index.html` is
referenced relatively (`./assets/...`). That means `dist/` works from any
folder, sub-path, or plain static server:

```bash
cd dist
python3 -m http.server 3000     # then open http://localhost:3000
```

Note: opening `dist/index.html` by double-clicking (`file://`) is blocked by
browsers for ES-module scripts. Use Option 1 for a double-click workflow, or
any of the static servers above.

## Option 3 - Development server

```bash
bun install
bun run dev            # http://localhost:3000
```

The dev server is configured with `cors: true`, `host: true` and
`allowedHosts: true`, so it also works from other devices on your LAN.

---

## Troubleshooting

| Symptom | Cause | Fix |
| --- | --- | --- |
| Blank page in `dist/` after double-click | Browsers block ES modules on `file://` | Use Option 1 or a local static server |
| `404` on `/assets/...` | Served from a sub-folder with absolute base | Already fixed: `base: "./"` |
| Network/CORS warnings in the console | Supabase sync unreachable (offline) | Expected. The app falls back to the local cache |
| Blank data on first load | Empty database | Demo data seeds automatically |

## Data and sync

- Local state is the source of truth and lives in `localStorage`
  (`rwanda-agri-state-v1`).
- Supabase writes are fire-and-forget. When the network is unavailable, or the
  page is opened from `file://`, all remote calls are skipped and logged, never
  surfaced to the user.
- Farmer default password is derived from the phone number: last digit +
  `rwanda2026`.