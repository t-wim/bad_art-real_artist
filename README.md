This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Minimal Grid Gallery (Redesign)

### Scope & Guardrails
- Purely a client-side UI refresh for the minimal grid; backend endpoints, schemas, and providers remain untouched.
- Gallery pulls from the existing read-only feed and keeps the “Load more” pagination pattern without infinite scroll.
- No voting, uploads, color branding, or additional content blocks were introduced.

### Data Contract
- `GET /api/gallery?cursor=<string>&limit=<number>` → `{ items: ImageItem[], nextCursor?: string | null }`
- `GET /api/image/:id` → `ImageItem`
- `ImageItem` fields: `id`, `src`, `alt?`, `title?`, `handle?`, `createdAt?`, `width?`, `height?`, `blurDataURL?`, `meta?`
- The UI sanitises each payload (stringifies ids/urls, preserves meta) while honouring the existing field names.

### Interactions
- Hover or keyboard focus reveals a white overlay with the title (top-left), handle (bottom-left), and “Open ↗” hint (bottom-right).
- Clicking, tapping, pressing Enter, or pressing Space opens a fullscreen-style modal showing the image plus title/handle metadata.
- Esc or the “Close” control dismisses the modal and restores focus to the originating grid tile.

### States
- **Loading:** eight neutral skeleton tiles animate with a soft pulse while the initial fetch is in-flight.
- **Empty:** renders a centered “No images yet.” message when the backend returns zero items.
- **Error:** a banner above the grid exposes the fetch error with a Retry action for the initial load.
- **Pagination Error:** a lightweight inline notice appears near the Load more button; re-pressing retries the same cursor.
- **Per-Image Error:** individual tiles swap to a neutral placeholder, keep metadata overlays, and surface an “Open in new tab” fallback when a source URL exists.

### Telemetry
- `image_hover { id }`
- `image_click { id, context: "grid" }`
- `grid_paginate { count, cursor }`
- Events fire exactly once per hover target, on every tile activation, and after successful pagination requests respectively.

### Accessibility
- Tiles are real buttons with descriptive `aria-label`s (`"Open <title> by <handle>"`; defaults to “unknown artist”).
- Visible focus styling (`ring-black/40`) mirrors the hover affordance.
- Modal is rendered via portal with `role="dialog"`, `aria-modal="true"`, Escape handling, focus trap, and focus return on close.
- Alt text always exists: uses the item’s `alt`, falls back to the title, then “User uploaded image”.

### Performance
- Uses `next/image` with responsive `sizes` tuned to the 2/3/4/6/8 column breakpoints.
- First-row images are prioritised for faster initial paint; lower rows remain lazy.
- Supports blur placeholders whenever `blurDataURL` is provided by the feed.
- Section applies `content-visibility: auto` so off-screen content waits to render until scrolled into view.

### Testing/Acceptance Checklist
- Initial load succeeds, telemetry logs `image_hover`, `image_click`, and `grid_paginate` with correct payload shapes.
- Hover/focus overlay, modal open/close (via mouse, keyboard, and Esc), and focus return behave as described.
- Load more paginates, appends items without duplication, and retries gracefully on failure.
- Empty state, per-image error placeholder, and global error banner render with neutral styling.
- Keyboard navigation (Tab/Shift+Tab, Enter/Space) reaches every tile and the modal controls.

### Troubleshooting
- **Fetch error:** banner appears above the grid; use Retry to refetch the first page.
- **Image decode error:** the tile swaps to the neutral placeholder; use “Open in new tab” to attempt a direct load.
- **Invalid cursor:** pagination error notice surfaces; the same Load more action replays the request with the existing cursor.

### Linting Strategy
- Added `.eslintignore` to exclude `legacy/**`, `archive/**`, `deprecated/**`, and generated files from global lint runs.
- Introduced a gallery-focused override in `eslint.config.mjs` to enforce React hook exhaustiveness and unused-variable checks only where the redesign lives.
- New `pnpm lint:gallery` script runs `eslint src/components/gallery/GalleryGrid.tsx --quiet`, giving a quick signal on the refreshed UI while the `.eslintignore` mirror keeps other tooling aligned (flat-config ESLint emits a benign warning when it sees the file).
