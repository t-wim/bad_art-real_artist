# AGENTS Codex v1 (Architekturzentriert)
> Grundlage für $BART — Webapp, Gallery, Voting, Upload / Architektur, Module, Verträge

---

## 0) Zweck & Prinzipien
- **Ziel:** Robust, erweiterbar, testbar. Eine Architektur, die Subsysteme klar trennt (Orchestrierung ↔ Domänen-Agenten ↔ Infrastruktur).
- **Leitlinien:** Single Responsibility • Explizite Verträge • Observability-first • Security-by-default • „Prompts wie Code“ (versioniert, getestet).

---

## 1) Systemübersicht
**Schichtenmodell**
1. **Interface/Experience** (Next.js 15 App Router, Tailwind v4)
2. **Agenten-Layer** (Orchestrator + Domänen-Agenten als Services/Server Actions)
3. **Tooling/Connectors** (X/Twitter API, Storage, Proxy, Rate-Limiter)
4. **Daten/State** (Artworks, Votes, Audit-Log, Caches, Memory)

**Service-Typen**
- **Orchestrator** (Flow-Steuerung, Policy-Enforcer)
- **Domänen-Agenten:** *Ingestion*, *Gallery*, *Voting*, *Notification*, *Compliance/Audit*
- **Infra-Services:** Proxy `/api/proxy/*`, Health, Rate-Limiter, Telemetrie

---

## 2) Agentenrollen (Domain Services)
### 2.1 Orchestrator
- Zerlegt Missionen (Submit → Validate → Store → Notify) und ruft Domänen-Agenten über klare Interfaces.
- Erzwingt Policies (Rate Limits, Auth, Idempotenz, Retries, Timeouts).

### 2.2 Ingestion-Agent
- Annahme von **Base64-Uploads** + Metadaten (`title`, `authorHandle`).
- Validierung (Größe, MIME, verpflichtende Felder), Normalisierung, Übergabe an Storage.

### 2.3 Gallery-Agent
- Listen-/Detailabruf; Sortierung/Filter; Paginierung.
- Bild-Derivate (Thumbnails) über Worker oder On-Demand.

### 2.4 Voting-Agent
- Stimmabgabe (Debounce, Double‑Vote‑Prävention, Replay‑Schutz).
- Zählung + konsistente Aktualisierung (optimistic UI ↔ serverseitige Quelle der Wahrheit).

### 2.5 Notification-Agent (Social/X)
- Ausgehende Events (25/50/75/100 % Milestones) → geplante Posts/Webhooks.
- Abstrakte Schnittstelle: X heute, andere Kanäle morgen.

### 2.6 Compliance/Audit-Agent
- Audit-Log (wer hat wann was getan), Content-Policies (DMCA/Ethik), Moderationshooks.

---

## 3) Verträge & Schemas
**Artwork**
```json
{
  "id": "art_123",
  "title": "My Bad Art",
  "authorHandle": "@degen123",
  "imageBase64": "data:image/png;base64,....",
  "votes": 42,
  "createdAt": "2025-09-22T12:00:00.000Z"
}
```
**Vote**
```json
{ "artworkId": "art_123", "voter": "ip:hash|x:userid", "ts": "2025-09-27T16:20:00Z" }
```
**Error-Shape**
```json
{ "error": { "code": "VALIDATION_FAILED", "message": "title is required" } }
```

---

## 4) Schnittstellen (HTTP/Server Actions)
- `GET /api/artworks` → Liste (SSR-fähig)
- `POST /api/artworks` → Ingestion-Agent (Base64)
- `POST /api/artworks/:id/vote` → Voting-Agent
- `GET /api/proxy/health` → Smoke (Upstream optional)
- *(Optional)* `GET /api/proxy/[...path]` → generischer Proxy (CORS/Secrets serverseitig)

**Kontrakte hart machen:** Typen in `/types/**`, zentrales Client-SDK in `/lib/apis.ts`.

---

## 5) Datenhaltung & State
- **Primärdaten:** Artworks, Votes (DB/Upstream). 
- **Caches:** Edge/Memory-Cache mit „stale‑while‑revalidate“ für Gallery.
- **Memory:** Kurzzeit-Kontext für Workflows (z. B. mehrstufige Submit-Flows) + Audit-Log.

---

## 6) Cross-Cutting Concerns
### 6.1 Sicherheit
- Keine Secrets im Client (`NEXT_PUBLIC_*` nur unkritisch). 
- Input Sanitization, Content-Length‑Limits, MIME‑Whitelists.
- Rate‑Limits (z. B. 60 rpm/IP für Submit/Vote), CSRF-Schutz bei mutierenden Calls.

### 6.2 Observability
- **Metriken:** RPS, Fehlerquoten, Latenzen, Vote‑Throughput, Post‑Erfolg. 
- **Logs:** strukturierte JSON‑Logs (Korrelations‑ID), kein PII/Secrets.
- **Tracing:** Orchestrator span → Domänen‑Agenten.

### 6.3 Resilienz
- Timeouts, Retries mit Backoff, Circuit‑Breaker (Upstream), Idempotenz‑Keys (Submit/Vote).

---

## 7) Qualitäts- und Delivery-Guardrails
- **DoD:** `pnpm typecheck && pnpm lint && pnpm fmt && pnpm test` grün; Lighthouse (Mobile) ≥ 70/80.
- **PRs:** ≤ ~300 LOC, 1 Scope pro PR; Refactor ≠ Feature.
- **Tests:** Vitest + Testing Library (Unit/Integration); Playwright E2E (später); Coverage Ziele 80/85/85.

---

## 8) Runtime & Deployment
- **Runtime:** SSR für Gallery/Detail; API auf Node Runtime; Assets via CDN; Lazy Images.
- **Deploy:** Git→Vercel Preview; Merge→Prod; `vercel.json` für Caching/Headers.
- **Smoke:** Home lädt, Gallery rendert, `/api/proxy/health` → `{ ok: true }`, Icons liefern 200, 0 Console‑Errors.

---

## 9) Modulgrenzen & Team-Schnittstellen
- **UI (components/**)** kennt nur **`/lib/apis.ts`** und Typen; keine direkten Fetches quer durchs System.
- **Agenten** kommunizieren ausschließlich über definierte Handler/Server Actions.
- **Infra** (Proxy, Rate-Limiter, Telemetrie) als eigene Pakete/Module.

---

## 10) Evolutionspfad
- **Phase A:** Core‑Flows stabil (Submit/Vote/Gallery) + Telemetrie.
- **Phase B:** Social-Milestones automatisieren (Notification-Agent), Hall of Fame.
- **Phase C:** Wallet/NFT‑Flows, weitere Kanäle, Moderations-Workbench.

---

## 11) Anhänge
- **Health-Route & vercel.json**: siehe bestehende Snippets.
- **Namensregeln:** Komponenten=Dateiname; Features unter `src/components/<feature>/...`; Aliase `@/*`.
- **Troubleshooting:** TS2307 Aliase, doppelte `app/` vermeiden, ESLint/Prettier konsistent.
