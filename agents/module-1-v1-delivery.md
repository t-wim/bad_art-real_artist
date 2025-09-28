# AGENTS.md – Version 1 (Prozess- & Delivery-orientiert)

> Leitfaden für **$BART – Bad Art, Good Vibes**  
> Fokus: Stabilität, klare Phasen, Erfolgskriterien & Deploy-Flows

---

## 0) Ziel & Kontext
- Ziel: Ein stabiles, nutzerfreundliches Frontend (Next.js 15, Tailwind v4, pnpm, Vercel) für Gallery, Voting & Upload.
- Kontext: Community-getriebenes Memetoken-Projekt, in dem „Bad Art“ gefeiert und durch Votings & On-Chain-Minting sichtbar gemacht wird.

---

## 1) Mission & Scope
- **Mission:** Aufbau einer klaren, überprüfbaren Delivery-Pipeline für Features, die auf Stabilität und Qualität setzt.
- **In-Scope (jetzt):** UploadForm, Voting, Gallery mit Hall of Fame, API-Proxy & Health-Check.
- **Out-of-Scope:** Marketplace-Automatisierungen, komplexe Social-Integrationen (kommen später).

---

## 2) Erfolgskriterien (Definition of Done)
- **Build/Code:** `pnpm typecheck && pnpm lint && pnpm fmt && pnpm test` grün.
- **Smoke-Test:** Startseite, Gallery & `/api/proxy/health` laufen fehlerfrei.
- **Performance:** Lighthouse Mobile ≥ 70, Accessibility ≥ 80.
- **Keine Console Errors** bei Navigation.

---

## 3) Systemstruktur
- **App-Router:** `src/app/**` (einheitlich, keine Duplikate).
- **Komponenten:** `src/components/**` nach Feature-Ordnern.
- **API:** `/api/artworks`, `/api/proxy/*`.
- **Aliase:** `@/* → src/*`.

---

## 4) Schnittstellen
- **Artwork:** { id, title, authorHandle, imageBase64, votes, createdAt }.
- **Endpoints:** `GET/POST /api/artworks`, `POST /api/artworks/:id/vote`, `GET /api/proxy/health`.
- **Fehlerform:** `{ error: { code, message } }`.
- **Limits:** 60 Requests/Minute pro IP.

---

## 5) Qualitätstore
- **Lint & Format:** keine offenen Fehler in PRs.
- **Tests:** Vitest + React Testing Library, Coverage ≥ 80–85 %.
- **PR-Größe:** max. ~300 LoC, ein Feature/Fix pro PR.

---

## 6) Deploy & Runtime
- **Deploy-Flow:** Push → Preview auf Vercel, Merge → Prod.
- **ENV-Variablen:** `NEXT_PUBLIC_API_BASE_URL`, `NEXT_PUBLIC_DATASOURCE`.
- **Runtime:** Gallery SSR, Proxy Node.
- **Smoke-Test nach Deploy:** Startseite lädt, Gallery rendert, Health ok.

---

## 7) Roadmap (phasenorientiert)
- **M1:** Basis-Deployment mit Health-Check (✅).
- **M2:** UploadForm + Voting, Tests & Coverage-Ziele.
- **M3:** Hall of Fame, UI-Polish, Docs erweitern.

---

## 8) Policies
- **Keine Secrets im Client**, `.env*` nie committen.
- **Nur `src/app` verwenden**, Legacy-Ordner entfernen.
- **Brand/Legal/CI** nur mit Owner-OK.

---

## 9) Beispiele
- **Commit:** `feat(vote): add basic voting flow`.
- **PR-Template:** Problem, Lösung, Checks, Screenshots.
- **Ticket → Branch → PR → Checks → Review → Merge**.

---

## 10) Glossar
- **Artwork:** Community-Einreichung (PNG + Meta).
- **AuthorHandle:** X/Twitter-Handle des Erstellers.
- **Base64:** Transportformat für Bilder.
- **Proxy:** sichert API-Calls via `/api/proxy/*` ab.

---

## 11) Styleguide
- **Tailwind Tokens:** text-primary, bg-card etc.
- **A11y:** alt-Texte, Buttons semantisch, Kontrast hoch.
- **Motion:** dezent, max. 300 ms, `prefers-reduced-motion` respektieren.

---

> **Fokus von v1:** ein verlässlicher Prozess, klare Qualitäts- und Deploy-Schranken, geeignet für stabile Delivery & Betrieb.
