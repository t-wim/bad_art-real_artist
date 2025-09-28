# AGENTS Codex v2 (Disziplinenorientiert)
> Spezialisierte Agenten je Anwendungsnische für $BART — Community‑Webapp, Gallery, Voting, Social

---

## 0) Zweck & Aufbau
- **Ziel:** Für jede Disziplin klar benannte Agenten, Eingaben/Outputs, Workflows, KPIs und Guardrails, um Features iterierbar und messbar zu liefern.
- **Gliederung:** (1) Business/Automation · (2) Text/Semantik/Kreativ · (3) Code/Security · (4) Research/Data · (5) UI/Interactive Tools · (6) Integrationsmatrix · (7) Prompt‑Kits · (8) DoD & KPIs · (9) Risiken · (10) Evolution.

---

## 1) Business & Prozess‑Automation
**Agenten**
- **Ops‑Orchestrator** – steuert Community‑Workflows (Einreichung → Auswahl → Voting → Milestones → Gewinner‑Post).
- **Scheduler** – plant X‑Posts/Threads bei 25/50/75/100 % Voting‑Fortschritt; unterstützt wiederkehrende Community‑Slots.
- **Webhook/Broadcast‑Agent** – verschickt Ereignisse an X/Discord/Telegram; dedupliziert; Retries/Backoff.
- **Rate‑Limiter** – schützt Submit/Vote (IP/Handle‑basiert, 60 rpm, Burst‑Kontrolle).

**Inputs/Outputs**
- In: `ArtworkCreated`, `VoteProgress{artId, pct}`, `WinnerDecided` · Out: `PostRequest`, `AuditLog`.

**Workflows**
1) `ArtworkCreated` → Orchestrator → Moderation Hook → Gallery Update.
2) `VoteProgress`→ Scheduler → `PostRequest` (X) → Webhook; dedupe pro Schwelle.

**KPIs**
- Time‑to‑Post (ms), Milestone‑Coverage (% erreicht/erkannt), Retry‑Rate, Duplicate‑Block‑Rate.

**Guardrails**
- Idempotenz‑Keys, Signaturen, Replay‑Schutz, Backoff‑Strategie.

---

## 2) Text, Semantik & Kreatives Schreiben
**Agenten**
- **Copy/Thread‑Agent** – erzeugt Posts/Threads (brand‑safe, degen‑tauglich, kurz/variiert).
- **Style/Persona‑Agent** – hält Tonalität ("Bad Art, Good Vibes"), Emojis/Hashtags‑Policies, CTA‑Katalog.
- **Moderation/Policy‑Agent** – prüft Texte/Bild‑Captions gegen Richtlinien, markiert Grenzfälle.
- **Summarizer/Translator** – fasst Community‑Ereignisse mehrsprachig zusammen (DE/EN/TR optional).

**Inputs/Outputs**
- In: `Event`, `DraftText`, `PersonaRules` · Out: `ApprovedCopy{lang,channel}`.

**Workflows**
- Milestone‑Event → Copy‑Agent (Varianten N) → Persona‑Agent (Normalize) → Moderation → Freigabe/Auto‑Post.

**KPIs**
- Engagement‑Rate/Post, Time‑to‑Copy, Edit‑Quote (%), Policy‑Flag‑Rate.

**Guardrails**
- Max‑Tokens/Length, verbotene Phrasenlisten, Link‑Sanitizing, Rate‑Bounds pro Kanal.

---

## 3) Code, Engineering & Security
**Agenten**
- **Dev‑Helper** – generiert Snippets, erklärt Fehlerlogs, schlägt Refactors vor (Next/Tailwind/TS focus).
- **Lint/Typecheck‑Coach** – hält `pnpm typecheck && pnpm lint && pnpm fmt && pnpm test` grün; kommentiert PRs.
- **Test‑Generator** – erzeugt Vitest/RTL‑Cases für UI/Lib; Mindest‑Coverage enforced.
- **Security‑Scanner** – prüft Dependencies (advisories), Content‑Sanitizing, SSR/CSR‑Grenzen.

**Inputs/Outputs**
- In: `Diff`, `ErrorLog`, `CoverageReport` · Out: `FixSuggestion`, `TestFile`, `PolicyFinding`.

**Workflows**
- PR geöffnet → Coach prüft → Findings als Review‑Kommentare; Scanner blockiert bei High Severity.

**KPIs**
- Build‑Stabilität (Fehler/PR), Time‑to‑Green, Coverage‑% (Branches/Funcs/Lines), CVE‑Backlog.

**Guardrails**
- Conventional Commits, PR‑Scope ≤ ~300 LOC, keine Secrets in Client, Edge‑Cases in Tests.

---

## 4) Research, Knowledge & Data
**Agenten**
- **Trend‑Scout** – beobachtet Meme‑/CT‑Trends, Top‑Accounts, Hashtags.
- **Sentiment‑Watch** – wertet Reaktionen auf Posts/Artworks aus (Like/Reply‑Ratio, Kommentar‑Polarität).
- **Competitor/Benchmark** – vergleicht ähnliche Projekte (Features, Taktiken, Post‑Frequenz).
- **Analytics‑Agent** – einfache Dashboards (Submissions/Tag, Votes/Tag, Conversion → Winner).

**Inputs/Outputs**
- In: Social Streams, Gallery Events, Web‑Analytics · Out: Weekly Brief, Actionables, Content‑Hints.

**Workflows**
- Wöchentlich: Scout → Briefing → Persona/Copy‑Backlog aktualisieren; Retro: Analytics → Tuning von Schwellen/CTAs.

**KPIs**
- Submission‑Rate Δ, Vote‑Conversion, CTR/Share‑Rate, Winner‑Cycle‑Time.

**Guardrails**
- Datenschutz (nur aggregiert), keine PII, transparente Messdefinitionen.

---

## 5) UI & Interactive Tools (Web‑Agenten)
**Agenten**
- **Sketchpad‑Coach** – liefert Onboarding‑Hints/Prompts im Editor‑Fenster; warnt bei zu großen Exporten.
- **Upload‑UX‑Agent** – validiert Base64‑Größe/Format, vergibt Fehlermeldungen, schlägt Kompression vor.
- **Voting‑Assistant** – erklärt Regeln, verhindert Doppel‑Klick‑Spam, visuelles Feedback/Optimistic UI.
- **A11y‑Checker** – prüft Kontrast, Fokus‑Reihenfolge, Alt‑Texte; erzeugt Aufgabenliste.

**Inputs/Outputs**
- In: UI Events (`onDrawStart`, `onExport`, `onSubmit`, `onVote`) · Out: `Toast`, `InlineHint`, `BlockReason`.

**Workflows**
- Export → Upload‑Agent → (ok) → Orchestrator Submit; Vote → Assistant → Debounce → Server‑Vote → UI Sync.

**KPIs**
- Drop‑Off im Submit‑Flow, Fehlerrate Export, Vote‑Latenz p95, A11y‑Issues/Release.

**Guardrails**
- „Prefer server truth“, Retry/Backoff, klare Fehlermeldungen, Reduced‑Motion respektieren.

---

## 6) Integrations‑Matrix (Agent ↔ Komponente/Route)
- **/src/app/**: Home, `/gallery`, `/gallery/submit`, `/gallery/playground` ↔ **UI‑Agenten**.
- **/api/**: `artworks`, `proxy/health`, `proxy/[...path]` ↔ **Ops‑/Security‑/Webhook‑Agenten**.
- **/lib/**: `apis.ts`, `filters.ts` ↔ **Dev‑Helper/Test‑Generator**.
- **/components/**: `GalleryGrid`, `ArtworkCard`, `UploadForm`, `MemeEditor` ↔ **Upload/Voting/Sketchpad‑Agenten**.

---

## 7) Prompt‑Starter‑Kits (pro Disziplin)
**Business/Ops**
- „Als Ops‑Orchestrator: Prüfe Event {type}, validiere Idempotenz, bestimme nächste Aktion (A|B|C) und liefere `{action, reason, idempotencyKey}`.“

**Text/Semantik**
- „Als Persona ‘Bad Art, Good Vibes’: Erzeuge 3 Varianten (280 Zeichen), 1 CTA, vermeide {banlist}, liefere `{post, cta}` je Variante.“

**Code/Security**
- „Als Lint/Type‑Coach: Analysiere Log, nenne **root cause**, minimalen Patch (diff‑ähnlich), und 2 Tests, die den Fehler abdecken.“

**Research/Data**
- „Als Trend‑Scout: Aggregiere Top 10 Hashtags der Woche im CT‑Segment, je mit Beispiel‑Tweet‑Thema und kurzer Relevanzbegründung.“

**UI/Tools**
- „Als Upload‑UX‑Agent: Validere Base64 (MIME, Größe), gib prägnante Fehlermeldung, und **1** konkrete Korrekturmaßnahme.“

---

## 8) Definition of Done & KPIs (Disziplin‑spezifisch)
- **Business:** 100 % Milestone‑Posts ohne Duplikate; TTP ≤ 5 s; Failed‑Post‑Rate < 1 %.
- **Text:** Edit‑Quote < 20 %; Engagement/Post ≥ Baseline+Δ.
- **Code:** CI grün; Coverage ≥ 80/85/85; 0 High‑Severity‑Findings.
- **Research:** Wöchentliches Briefing ≤ 1 Seite; mind. 3 Actionables.
- **UI:** Submit‑Abbruch < 10 %; p95 Vote‑Latenz < 400 ms; 0 kritische A11y‑Issues.

---

## 9) Risiken & Gegenmaßnahmen
- **Spam/Vote‑Fraud:** Rate‑Limits, Fingerprinting, Idempotenz, Audit.
- **Content‑Policy:** Moderation‑Gate, Eskalationspfad, Logging.
- **Upstream‑Instabilität:** Circuit‑Breaker, Cache‑Fallback, manuelle Override‑Flags.
- **Scope‑Creep:** PR‑Scope‑Regel, Ticket‑Labels `scope-change`, Owner‑Freigabe.

---

## 10) Evolution
- **Phase A:** UI‑Agenten + Ops‑Orchestrator stabil; Milestone‑Posts live.
- **Phase B:** Research‑Feedback → Persona/Copy Tuning; Hall of Fame; Automations‑Playbooks.
- **Phase C:** Wallet/NFT‑Flows; Erweiterung Telegram/Discord Bots; Moderations‑Workbench.
