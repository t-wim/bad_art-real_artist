Hier ist die **final konsolidierte `AGENTS.md`** – inkl. der ergänzten **Docs-Abschnitte** (_Deploy, ENV, Troubleshooting_) und allem, was wir iterativ erarbeitet haben. Du kannst die Datei 1:1 ins **Repo-Root** legen.

````md
# AGENTS.md

> Agenten-Anleitung für **$BART – Bad Art, Good Vibes**  
> Stack: Next.js 15 • React 19 • Tailwind v4 • TypeScript (strict) • pnpm • Vercel

---

## 0) Ziel & Kontext

- Dieses Projekt ist ein **Frontend** (Next.js App Router) mit Gallery/Voting/Upload-Flow.
- Arbeitsprinzip: **inkrementelle, überprüfbare PRs** mit klaren Checks (Typecheck/Lint/Format/Tests).

---

## 1) Mission & Scope

### 1a) Mission

Main hub für eine Community, die sich durch ein interessantes Konzept auszeichnet.

### 1b) Zielnutzer

Crypto-Degens, die „bad art“ mit „good vibes“ verstehen.

### 1c) In-Scope (Phase jetzt)

- Intro-Video
- Meme-Gallery
- Bilder-Voting
- Bilder für Voting einreichen
- Einreichungen via API mit X/Twitter-Handle verknüpfen
- Abstimmung & Gewinner-Gallery
- API-Anbindung zu Twitter (inkl. Twitter-Verifizierung fürs Voting)
- Links zu Socials (X/Twitter)

### 1d) Out-of-Scope (Phase jetzt)

- **TBD** (wird gemeinsam festgelegt)

### 1e) Core-Flow

Startseite → Video → (optional) Abstimmung → Gallery → (optional) Voting → (optional) Bild einreichen

---

## 2) Erfolgskriterien (Definition of Done)

### 2a) Build/Code-Qualität

- `pnpm typecheck`, `pnpm lint`, `pnpm fmt`, `pnpm test` laufen fehlerfrei; keine roten Errors.

### 2b) Production-Smoke

- Gallery lädt auf Production.
- `GET /api/proxy/health` → `200 { ok: true }`.
- Icons/Manifest liefern `200` (z. B. `/favicon.ico`, `/icon-192.png`, `/apple-touch-icon.png`).

### 2c) Keine Console-Errors

- Beim Navigieren über Startseite/Gallery/Detail erscheinen **0** `console.error`-Einträge.

### 2d) Performance & A11y Mindestwerte

- Lighthouse (Mobile) Performance ≥ 70, Accessibility ≥ 80.
- Bilder sind lazy-loaded.

---

## 3) System-Landkarte

### 3a) Verzeichnisstruktur (Wo liegt was?)

- Wurzel enthält `app/`, `components/`, `content/`, `hooks/`, `lib/`, `types/`, `public/`, `textures/`, `src/`, plus Build/Config.
- **Primär genutzte App:** `src/app/**`. (Legacy-`app/` vorhanden; Migration zu `src/app` vorgesehen.)
- UI: `components/**`; Inhalte: `content/**`; Hooks: `hooks/**`; Hilfslogik: `lib/**`; Typen: `types/**`; statische Assets: `public/**`; Texturen/Design: `textures/**`.

### 3b) Entry Points & Routen

- Start: `src/app/page.tsx` → `/`
- Wichtige Routen: `/gallery`, `/gallery/hall of fame`, `/gallery/playground`, `/gallery/submit`, `/about`, `/bonus`
- API: `src/app/api/artworks/route.ts` → `/api/artworks`

### 3c) Aliase & Imports

- **Alias `@/*` → `src/*`**
- Beispiel: `import { GalleryGrid } from '@/components/gallery/GalleryGrid'`

### 3d) Daten & API-Orte

- Client/Lib-Calls: `lib/apis.ts`; Konstanten/Filter/Bilder: `lib/constants.ts`, `lib/filters.ts`, `lib/images.ts`
- Server/Next API: `/api/artworks` (weitere Proxy-Routen optional)

### 3e) “Wie finde ich X?” (Namensregeln & Suche)

- Komponenten heißen wie die Datei (`GalleryCard.tsx` → `<GalleryCard/>`)
- Feature-Ordner sind sprechend (`gallery`, `vote`, `submit`); Assets unter `public/**`, Texturen unter `textures/**`

---

## 4) Schnittstellen & Verträge

### 4a) ENV-Variablen (Namen & Bedeutung)

- `NEXT_PUBLIC_API_BASE_URL` = Basis-URL des Backends (HTTPS).
- `NEXT_PUBLIC_DATASOURCE=api` wählt die Datenquelle.

### 4b) API-Endpunkte (Was gibt’s?)

- `GET /api/artworks` – Liste laden
- `POST /api/artworks` – Artwork einreichen (Base64)
- `POST /api/artworks/:id/vote` – Stimme abgeben
- _(optional)_ `GET /api/proxy/health` – `200 { ok: true }`

### 4c) Requests/Responses (Schema)

- Das Frontend (Next.js + Tailwind) spricht mit einem Backend, das **Bilder als Base64-Strings** annimmt/zurückgibt; schlanke JSON-Objekte mit klaren Pflichtfeldern.
- **Artwork (Beispiel):**
  ```json
  {
    "id": "art_123",
    "title": "My Bad Art",
    "authorHandle": "@degen123",
    "imageBase64": "data:image/png;base64,iVBORw0KGgoAAA...",
    "votes": 42,
    "createdAt": "2025-09-22T12:00:00.000Z"
  }
  ```
````

### 4d) Statuscodes & Fehlerform

- Codes: `200`, `201`, `400`, `401`, `404`, `422`, `429`, `500`
- Fehler-Shape (einheitlich):

  ```json
  { "error": { "code": "VALIDATION_FAILED", "message": "title is required" } }
  ```

### 4e) Auth/CORS & Limits

- CORS: Erlaube nur unsere Preview- und Prod-Domains (z. B. `https://*.vercel.app` und die Produktionsdomain).
- Rate-Limit: Submit/Vote **max. 60 Requests/Minute pro IP**.
- Sicherheit: Keine Secrets im Client; nur `NEXT_PUBLIC_*`-Variablen verwenden.

---

## 5) Qualitätstore & Tooling

### 5a) Qualitäts-Kommandos (Single Source of Truth)

- Lokale Checks und CI nutzen dieselben Kommandos:
  `pnpm typecheck && pnpm lint && pnpm fmt && pnpm test`

### 5b) Test-Framework & Ebenen

- **Vitest** für Unit/Integration mit `@testing-library/react`; E2E optional später (Playwright).

### 5c) Coverage-Minima (CI-blockierend)

- Ziele: Branches **80%**, Functions **85%**, Lines **85%**; bei Unterschreitung schlägt CI fehl.

### 5d) Format/Lint als Gate

- `pnpm fmt` (Prettier) und `pnpm lint` (ESLint) sind mandatory; keine PRs mit offenen Lint-Errors.

---

## 6) Policies (Guardrails)

### 6a) PR-Größe & Scope

- Max. \~300 geänderte Zeilen, **1 Feature/Fix pro PR**; Refactor nicht mit Feature mischen.

### 6b) Erlaubte Bereiche vs. Freigabe nötig

- **Erlaubt:** kleine Bugfixes in `src/components/**`/`src/lib/**`, Typ-/Import-Aufräumen, UI-Polish.
- **Freigabe nötig:** Brand-Assets, rechtliche Texte, Build/CI-Pipeline, Alias-/Strukturänderungen.

### 6c) Sicherheit (Secrets/PII/Logging)

- `.env*` niemals committen; nur `NEXT_PUBLIC_*` im Client; Logs ohne Tokens/PII; externe URLs nur über ENV.

### 6d) Migrations- & Architektur-Regeln

- Nur **`src/app`** als App-Router; **kein** zweites `app/` im Root; Alias `@/*` beibehalten; keine Breaking-Reorg ohne Migrationshinweis & DoD-Check.

---

## 7) Deploy & Runtime

### 7a) Deploy-Flow (wie kommt Code online?)

- Git-Push auf Branch → Vercel baut automatisch **Preview**; Merge in `main` triggert **Production**. Alternativ via CLI `vercel --prod`.

### 7b) ENV-Scopes & Setzen (ohne Hardcoding)

- Auf Vercel die ENVs je Umgebung setzen: `NEXT_PUBLIC_API_BASE_URL` & `NEXT_PUBLIC_DATASOURCE` für **Production** und **Preview**; lokal optional mit `vercel env pull .env.local`.

### 7c) Runtime-Entscheidungen (SSR/SSG/Edge/Node)

- Gallery-Seiten **SSR** für frische Daten; `/api/proxy/*` auf **Node runtime** (Timeout/Fetch kontrolliert); statische Icons/Assets über das Vercel CDN.

### 7d) Post-Deploy Smoke-Test (schnell & klar)

- Prod aufrufen: Start lädt, **Gallery rendert**, `GET /api/proxy/health → 200 { ok: true }`, Icons (`/favicon.ico`, `/icon-192.png`, `/apple-touch-icon.png`) liefern 200, **keine** Console-Errors.

---

## 8) Styleguide & UX-Heuristiken

### 8a) Design-Tokens & Tailwind-Nutzung

- Nutze Tokens/Utilities statt harter Werte: `text-primary`, `bg-card`, Abstände mit `p-4`, `gap-6`; mobile-first aufbauen.

### 8b) Accessibility & Semantik

- Bilder haben `alt`, Buttons sind echte `<button>`, sichtbarer Fokus, ausreichender Kontrast.

### 8c) Komponenten-Typ & State

- Standard: Server Components; `"use client"` nur bei interaktiven Teilen wie `UploadForm`/`MemeEditor`.

### 8d) Bilder & Performance

- `next/image` mit `sizes`, Lazy-Load, Platzhalter/Blur; keine unnötig großen Assets.

### 8e) Interaktionen & Motion

- Animationen dezent (≈200–300 ms), respektiere `prefers-reduced-motion`; visuelles Feedback bei Hover/Klick.

---

## 9) Entscheidungen & Eskalation

### 9a) Wann Rückfragen stellen?

- Bei unklaren Anforderungen, riskanten Änderungen oder Schema-Änderungen zuerst kurz nachfragen (nicht raten).

### 9b) Prioritäten bei Konflikten

- Reihenfolge: **Safety > Spec > Tests > Lint > Performance > DX**.

### 9c) Plan vor Implementierung (größere Tasks)

- Für größere Änderungen erst Mini-Plan (Bulletpoints), dann Umsetzung in kleinen PRs.

### 9d) Abbruch & Eskalation

- Bei Blockern (z. B. fehlende API, rote Builds) Arbeit pausieren, Status posten und Owner um Freigabe/Fix bitten.

### 9e) Review & Freigaben

- Brand-Assets, rechtliche Texte und Build/CI nur nach Owner-OK mergen.

---

## 10) Roadmap & Meilensteine (ETA)

### 10a) Roadmap-Format

- M1–M3 mit je einem Ergebnis (Outcome) + ETA-Datum; optional Abhängigkeiten.

### 10b) Milestones & Outcomes

- **M1 (ETA: 2025-09-23):** Vercel-Deployment final, ENV gesetzt, Prod-Smoke ok, `/api/proxy/health` erreichbar, README-Deploy-Abschnitt.
- **M2 (ETA: 2025-09-28):** **UploadForm** + **Voting** lauffähig; Vitest-Basis; Coverage ≥ Branches 80 % / Func 85 % / Lines 85 %.
- **M3 (ETA: 2025-10-05):** **HallOfFame**, UI-Polish, erweiterte Docs/Troubleshooting.

### 10c) Abhängigkeiten & Risiken

- Öffentliches HTTPS-Backend verfügbar; Twitter/X-API-Keys (serverseitig); stabile Bildgrößen; Rate-Limit aktiv.

### 10d) Umgang mit Scope-Änderungen

- Bei Änderungen Ticket mit Label `scope-change`, Impact/ETA anpassen, Owner-Freigabe vor Umsetzung.

### 10e) Tracking & Updates

- Roadmap-Block im README wöchentlich aktualisieren; Status: `on track` / `at risk` / `blocked`.

---

## 11) Beispiele & Templates

### 11a) PR-Template: Bugfix

- **Title:** `fix(gallery): avoid null access in GalleryGrid`
- **Body:** Problem (Repro + expected vs. actual), Lösung (1–2 Sätze), Checks (`pnpm typecheck && pnpm lint && pnpm fmt && pnpm test` grün), Screenshots/Logs (falls sinnvoll), Breaking changes (nein).

### 11b) PR-Template: Feature

- **Title:** `feat(vote): add basic voting flow`
- **Body:** Ziel (Nutzer können abstimmen), Scope (UI + `POST /api/artworks/:id/vote`), Akzeptanz (Vote erhöht Zähler, UI-Feedback, kein Doppelklick-Spam), Tests (Unit + Integration), Checks (s. Qualitätstore).

### 11c) Commit-Style (Conventional Commits)

- Beispiele:
  `feat(submit): accept base64 uploads`
  `fix(hero): prevent autoplay on mobile`
  `refactor(lib): extract api client`
  `docs(readme): add deploy steps`

### 11d) Goldpfad (Ticket → PR → Checks)

- 1. Ticket anlegen → 2) Branch `feat/...` → 3) Implement + lokale Checks grün → 4) PR mit Template → 5) Review, kleine Fixes, Merge bei grünem CI.

### 11e) Diff-Präsentation

- Nur relevante Dateien, kein Format-Noise (Prettier vorher), kurze Code-Kommentare an kniffligen Stellen.

---

## 12) Glossar

### 12a) Artwork (Inhaltseintrag)

- Ein „Artwork“ ist ein einzelner Beitrag (Bild + Meta), über den abgestimmt werden kann.
- Beispiel: Ein PNG mit Titel „My Bad Art“, Handle `@degen123`, aktuell 42 Votes.

### 12b) AuthorHandle (X/Twitter)

- `authorHandle` verknüpft ein Artwork mit einem X/Twitter-Account.
- Beispiel: Beim Einreichen `@degen123` angeben, damit der Gewinner sauber zugeordnet ist.

### 12c) Base64-Image (Transportformat)

- Bilder werden als Base64-String in JSON geschickt/empfangen, damit Upload/Proxy simpel bleibt.
- Beispiel: `imageBase64: 'data:image/png;base64,iVBORw0K...'` an `/api/artworks`.

### 12d) Proxy (Serverseitige Weiterleitung)

- `/api/proxy/*` leitet Anfragen sicher ans Backend weiter (CORS/Keys serverseitig).
- Beispiel: `/api/proxy/health` → Backend-Ping → `200 { ok: true }`.

### 12e) Datasource „api”

- `NEXT_PUBLIC_DATASOURCE=api` sagt dem Frontend, dass echte Daten vom Backend kommen.
- Beispiel: In Preview/Prod `DATASOURCE=api`, lokal testweise `mock` möglich.

---

## 13) Docs / README – Quick Reference

### 13a) Deploy auf Vercel

1. **Git-Flow (empfohlen):** Push → Auto-Preview auf Vercel; Merge nach `main` → **Production**.
2. **CLI (optional):**

   ```sh
   vercel link
   vercel --prod
   ```

3. **Build-Logs prüfen** (Vercel Dashboard) & **Domains** verifizieren (Preview/Prod).
4. **Post-Deploy Smoke-Test:** s. Abschnitt 7d.

### 13b) ENV Variablen (Vercel)

- **Benötigt (client-sichtbar):**
  - `NEXT_PUBLIC_API_BASE_URL` (z. B. `https://api.example.com`)
  - `NEXT_PUBLIC_DATASOURCE=api`

- **Scopes setzen:** jeweils **Preview** & **Production**.
- **Lokal synchronisieren (optional):**

  ```sh
  vercel env pull .env.local
  ```

- **Hinweis:** `NEXT_PUBLIC_*` ist im Browser sichtbar → nur unkritische Werte.

### 13c) Troubleshooting (häufige Fälle)

- **TS2307 `@/...` nicht gefunden:**
  - `tsconfig.json` → `baseUrl: "."`, `paths: { "@/*": ["src/*"] }`
  - Datei/Endung prüfen (`.ts/.tsx`), liegt unter `src/`?

- **Doppelte App-Struktur:**
  - Nur **`src/app`** behalten; Legacy-`app/` migrieren oder entfernen.

- **ESLint veraltet / Regeln schlagen fehl:**

  ```sh
  pnpm up eslint eslint-config-next -L
  pnpm lint
  ```

- **Registry-Fehler (`ECONNRESET`/`ENOTFOUND`):**
  - Retry, ggf. Proxy/Spiegel; `pnpm store prune` und erneut `pnpm install`.

- **Hydration/SSR-Warnungen (Framer Motion etc.):**
  - Betroffene Komponente als `"use client"` markieren, Effekte in `useEffect`.

- **CORS/API schlägt fehl:**
  - CORS-Whitelist für Preview/Prod-Domains im Backend prüfen; Proxy `/api/proxy/*` verwenden.

---

## 14) Content / STATE.yaml (Snippet)

```yaml
meta:
  description_md: |
    **$BART – Bad Art, Good Vibes.** Eine spielerische, community-getriebene
    Gallery & Voting App für absichtlich unperfekte Kunst. Lade Werke hoch,
    vote für deine Favoriten und feiere rohe Skizzen-Energie statt AI-Glätte.
    Mobile-first, schnell und offen für Experimente.
```

---

## 15) Anhang – Projektstruktur (Snapshot)

```
BAD_ART-REAL_ARTIST
│
├── app
│   ├── gallery
│   │   ├── hall of fame
│   │   ├── page.tsx
│   │   ├── playground
│   │   ├── submit
│   ├── animations.css
│   ├── favicon.ico
│   ├── fonts.css
│   ├── globals.css
│   ├── layout.tsx
│   ├── page.tsx
│
├── components
│   ├── dev
│   │   ├── Controls.tsx
│   │   ├── Sketch.tsx
│   │   ├── ToolSelect.tsx
│   │   ├── brushSelector.tsx
│   ├── gallery
│   │   ├── ArtworkCard.tsx
│   │   ├── GalleryGrid.tsx
│   │   ├── AboutShort.tsx
│   │   ├── AnimatedHeader.tsx
│   │   ├── ArtCard.tsx
│   │   ├── BackgroundCanvas.tsx
│   │   ├── BigSoloGalleryCnv.tsx
│   │   ├── CollageLayer.tsx
│   │   ├── Gallery.tsx
│   │   ├── GalleryCard.tsx
│   │   ├── GalleryCards.tsx
│   │   ├── Header.tsx
│   │   ├── Intro.tsx
│   │   ├── IntroButton.tsx
│   │   ├── Section.tsx
│   │   ├── SectionBox.tsx
│   │   ├── StickerSheet.tsx
│   │   ├── TeaserBadge.tsx
│   │   ├── TeaserBanner.tsx
│   │   ├── TeaserBannerBox.tsx
│   │   ├── TeaserCard.tsx
│   ├── Footer.tsx
│   ├── MemeEditor.tsx
│   ├── TeaserSection.tsx
│   ├── TeaserCard.tsx
│   ├── UploadForm.tsx
│
├── content
│   ├── copy.json
│   ├── teasers.json
│
├── hooks
│   ├── useImageStatus.ts
│   ├── useWebTicker.tsx
│
├── lib
│   ├── apis.ts
│   ├── constants.ts
│   ├── filters.ts
│   ├── images.ts
│
├── types
│   ├── copy.d.ts
│
├── .gitignore
├── .npmrc
├── .tailwind.postcss.cmd
├── LICENSE
├── README.md
├── next.config.js
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── tsconfig.json
│
├── public
│   ├── artworks
│   │   ├── empty_state.jpg
│   │   ├── error_state.jpg
│   │   ├── placeholder1.png
│   │   ├── placeholder2.png
│   │   ├── placeholder3.png
│   │   ├── placeholder4.png
│   │   ├── placeholder5.png
│   │   ├── placeholder6.png
│   ├── icons
│   │   ├── ci_icon_12px.png
│   │   ├── ci_icon_32px.png
│   │   ├── ci_icon_56px.png
│   │   ├── ci_icon_12px.svg
│   │   ├── ci_icon_32px.svg
│   │   ├── ci_icon_56px.svg
│   │   ├── dex_icon.png
│   │   ├── dex_icon.svg
│   │   ├── hidden_lock.svg
│   │   ├── image_placeholder.jpg
│   │   ├── spotlight.png
│   │   ├── upload.png
│   ├── design
│   │   ├── galaxy_gmish.png
│   │   ├── galaxygn8.png
│   │   ├── galaxygn22.png
│
├── textures
│   ├── bottom-left.png
│   ├── bottom-right.png
│   ├── crayon_border_green.png
│   ├── crayon_border_lightgreen.png
│   ├── crayon_border_pink.png
│   ├── crayon_border_purp.png
│   ├── masking_tape_no_bg.png
│   ├── neon-swipes.png
│   ├── neon-swipes-side.png
│   ├── paper_grain.png
│   ├── scribble.png
│   ├── scribble-top-down.png
│   ├── tape-2.png
│   ├── top-left.png
│   ├── top-right.png
│   ├── intro-poster.jpg
│   ├── Introduce.mp4
│
├── src
│   ├── app
│   │   ├── about
│   │   ├── api/artworks
│   │   │   ├── route.ts
│   │   ├── bonus
│   │   ├── page.tsx
│   ├── fonts
│   │   ├── GlitchGoblin.woff2
│   │   ├── MisfitsTrash.woff2
```

---
