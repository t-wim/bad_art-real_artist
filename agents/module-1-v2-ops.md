
# AGENTS.md – Version 2 (Missions- & Agenten-orientiert)

> Agentenhandbuch für **$BART – Bad Art, Good Vibes**  
> Fokus: Missionsarchitektur, Rollen, Eskalation & Social-Orchestrierung

---

## 0) Mission Control
- **Vision:** Jede Aufgabe ist eine Mission mit klarer Zieldefinition und Agentenrolle.
- **Kontext:** Community-Hub für Memes & Bad Art; Social-Voting als Kernmechanik.
- **Arbeitsweise:** Missionen werden Agenten zugewiesen, mit klaren Eingaben/Outputs & Eskalationswegen.

---

## 1) Missions-Framework
- **Mission:** klar definiertes Ziel (z. B. „Voting-Runde starten“).
- **Agenten:** Rollen wie *Frontend Agent*, *Ops Agent*, *Chain Agent*, *Content Agent*.
- **Scope:** definierter Input (z. B. 3 Artworks) → definierter Output (z. B. Poll-ID, X-Post).
- **Eskalation:** bei Blockern → Mission pausieren & Mission Control benachrichtigen.

---

## 2) Rollen & Zuständigkeiten
- **Frontend Agent:** PWA & UI (Sketchpad, UploadForm, Gallery).
- **Ops Agent:** Voting-Spiegelung X/TG, Bot-Kontrolle, Monitoring.
- **Chain Agent:** NFT-Minting mit Metaplex, Listing auf ME/Tensor.
- **Content Agent:** Copywriting, Memes, Community-Posts.

---

## 3) Missions-Beispiele
- **Mission UploadForm:** Ziel: User kann PNG hochladen + Handle; Agent: Frontend.
- **Mission Voting:** Ziel: 3 Einreichungen → X-Poll + TG-Poll; Agent: Ops.
- **Mission Mint:** Ziel: Gewinner als NFT on-chain; Agent: Chain.
- **Mission Thread:** Ziel: X-Thread mit Voting-CTA; Agent: Content.

---

## 4) Erfolgskriterien pro Mission
- **Frontend:** UI lauffähig, Smoke-Test grün.
- **Ops:** Poll-ID gespeichert, Fortschrittsposts korrekt.
- **Chain:** NFT gemintet, Adresse & Tx dokumentiert.
- **Content:** 3 Varianten pro Post, ≤280 Zeichen, Hashtags ≤2.

---

## 5) Social-Orchestrierung
- **Voting-Spiegelung:** X-Poll + Telegram-Poll synchronisiert.
- **Bots:** Shieldy (Join-Schutz), Rose (Moderation), ControllerBot (Polls).
- **Updates:** 25/50/75/100 % → Status-Posts.
- **Eskalation:** bei API-Limit oder Spam → Owner informiert.

---

## 6) Eskalationsmatrix
- **Level 1:** Minor Bug → Agent fix + Commit.
- **Level 2:** Blocker (rote Builds, API down) → Mission Control ping.
- **Level 3:** Externe Abhängigkeit (z. B. X-API Keys fehlen) → Owner-Eskalation.

---

## 7) Policies
- **Jede Mission dokumentiert:** Ziel, Input, Output, Verantwortlicher.
- **Keine Geheimnisse im Client:** Keys nur serverseitig.
- **Voting-Integrität:** Rate-Limit, Bot-Checks, Captcha optional.
- **CI/CD:** jede Mission → PR → Checks → Review.

---

## 8) Roadmap (Mission-basiert)
- **M1:** Mission Deploy (Vercel + Health-Check).
- **M2:** Mission Voting (UploadForm + Poll-Spiegelung).
- **M3:** Mission Mint (NFT-Winner + Hall of Fame).

---

## 9) Style & Kommunikation
- **Tickets:** beginnen mit `mission:`.
- **Commits:** `mission(vote): create x/tg poll sync`.
- **PR-Template:** Mission-Ziel, Input, Output, Checks, Screenshots.
- **Kommunikation:** Discord/Telegram Channel #mission-control für Status.

---

## 10) Glossar
- **Mission:** abgeschlossene Aufgabe mit Input & Output.
- **Agent:** Rolle mit klarer Verantwortung.
- **Mission Control:** Owner + Reviewer, die Freigaben erteilen.
- **Ops:** Bereich für Social, Bots & Status-Posts.

---

> **Fokus von v2:** Missionsarchitektur mit klaren Agentenrollen, Eskalationswegen & Social-Orchestrierung – geeignet für Community-Management & laufenden Betrieb.
