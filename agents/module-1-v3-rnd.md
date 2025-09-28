
# AGENTS.md – Version 3 (Modularer Baukasten)

> Agentenhandbuch für **$BART – Bad Art, Good Vibes**  
> Fokus: modulare Disziplin-Blocks, flexible Kombinierbarkeit & R&D-Experimente

---

## 0) Prinzip
- **Modularität:** Alle Regeln & Workflows sind als eigenständige „Blocks“ definiert.
- **Ziel:** Disziplinen können einzeln oder kombiniert aktiviert werden.
- **Kontext:** R&D für neue Features (Sketchpad, On-Chain, Social Automation).

---

## 1) Disziplin-Blocks
- **Frontend/PWA Block:** Next.js 15 + Tailwind v4 + Excalidraw + PWA.
- **Social Block:** X-Polls, Telegram-Polls, Bots, Status-Automation.
- **On-Chain Block:** Metaplex NFT-Mint, pNFT, Listing (ME/Tensor).
- **Content Block:** Prompt-Engineering für Copy, Threads, Memes.
- **Media Block:** PNG-Export, Web Share API, Optimierung ≤5 MB.

---

## 2) Aufbau eines Blocks
- **Header:** Name + Ziel.
- **Inputs:** benötigte Daten.
- **Outputs:** erwartetes Ergebnis.
- **APIs:** genutzte Schnittstellen.
- **Checks:** Erfolgskriterien (z. B. Test grün, Limit eingehalten).

---

## 3) Beispiel-Blocks
- **Frontend/PWA Block**
  - *Input:* User zeichnet im Sketchpad.
  - *Output:* PNG-Export, offline gespeichert.
  - *API:* /api/artworks (Upload).
  - *Checks:* Export ≤5 MB, Share-Button funktioniert.

- **Social Block**
  - *Input:* 3 nominierte Artworks.
  - *Output:* X-Poll-ID, TG-Poll-ID.
  - *API:* X-API, TG-Bot.
  - *Checks:* Fortschrittsposts bei 25/50/75/100 %.

---

## 4) Kombinationslogik
- Blocks lassen sich verketten: **Frontend → Social → On-Chain → Content**.
- Jede Kombination erzeugt eine „Feature-Pipeline“.
- Beispiel: *Draw → Upload → Vote → Mint → Post-Thread*.

---

## 5) Qualität & Policies
- Jeder Block hat eigene Tests & Checks.
- PRs verändern nur einzelne Blocks (keine Cross-Scope-Änderungen).
- Secrets: nie im Client, nur serverseitig.
- Security: Rate-Limits, Captcha optional im Social Block.

---

## 6) Roadmap (Block-basiert)
- **Phase 1:** Frontend/PWA + Social Block aktiv.
- **Phase 2:** On-Chain Block hinzufügen (NFT-Mint).
- **Phase 3:** Content Block + Media Block für Community-Push.

---

## 7) Kommunikation & Workflow
- Tickets benennen Block (`block:frontend`, `block:social`).
- Commits: `block(chain): mint winner as nft`.
- PR-Template: Block, Ziel, Input, Output, Checks.
- Reviews prüfen Block-Isolation & Kombinierbarkeit.

---

## 8) Glossar
- **Block:** eigenständiges Modul mit Input/Output.
- **Pipeline:** Kombination mehrerer Blocks.
- **R&D:** Forschungs- & Experimentierbereich.
- **Active Block:** aktuell produktiv genutztes Modul.

---

> **Fokus von v3:** Ein flexibles, modulares Baukastensystem für Disziplinen, ideal für R&D, schnelle Iterationen & neue Features.
