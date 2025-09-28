# AGENTS Codex v3 (Promptorientiert)
> Fokus: Prompt-Layering, Steuerungslogik, Versionierung & Metastrategien für $BART — Memes, Social-Bots, Community-Automatisierung

---

## 0) Zweck & Philosophie
- **Ziel:** Prompts als First-Class Citizens – dokumentiert, versioniert, getestet.
- **Prinzip:** *„Prompts = Code“* → modulare Layer, klare Typen, reproduzierbare Ausgaben.
- **Meta:** Transparenz, Auditierbarkeit, Wiederverwendung (Prompt-Pools, Templates).

---

## 1) Prompt-Layering (Ebenenmodell)
**Layer 1 – System**
- Unveränderliche Leitplanken (Architektur, Policies, Brand-Vorgaben).
- Enthält: Core-Mission, ethische Guardrails, verbotene Themen.

**Layer 2 – Projekt/Organisation**
- Kontext: $BART (Bad Art, Good Vibes), Token/Narrativ, User-Flows.
- Definiert: Rollen, Zielgruppen (Crypto-Degens, Artists), Sprache/Stil.

**Layer 3 – User/Task**
- Konkrete Aufgabe: „Formuliere Post bei 50% Voting-Milestone“, „Erstelle Copy für Upload-Bestätigung“.
- Variabilität erlaubt; system-/projektweite Leitplanken bleiben.

---

## 2) Prompt-Strukturen (Templates)
**Grundschema**
```yaml
role: <Agentenrolle>
context: <Layer 2 Infos>
input: <Variablen/Event>
output: <Schema/Format>
constraints: <Limits/Policies>
steps:
  - <explizite Denkanweisung>
```

**Beispiele**
- **Voting-Milestone Post**
```yaml
role: Copy-Agent
context: "$BART – Bad Art, Good Vibes"
input: { milestone: 50%, artwork: art_123, handle: "@degen123" }
output: { variantA, variantB, variantC }
constraints: [280 chars max, no slurs, 1 CTA]
steps:
  - Generate 3 variants
  - Apply persona rules
  - Return JSON with keys {variantA,B,C}
```

- **Upload-Feedback**
```yaml
role: UX-Agent
context: "UploadForm in BART Gallery"
input: { fileSizeMB: 6, mime: "jpg" }
output: { status, message, suggestion }
constraints: [maxSizeMB=5]
steps:
  - Validate size
  - If >5, reject with compressed suggestion
```

---

## 3) Prompt-Kategorien
- **Copy/Persona Prompts** → Posts, Threads, CTAs.
- **UX/Feedback Prompts** → Fehlermeldungen, Inline-Hints.
- **Dev/Debug Prompts** → Erklärungen, Refactor-Hinweise, Test-Cases.
- **Research/Scout Prompts** → Trendberichte, Sentiment, Benchmarks.
- **Moderation/Policy Prompts** → Content-Gates, Eskalationspfade.

---

## 4) Steuerungslogik (Flow)
**Prompt-Orchestrator**
- Zerlegt Events in Aufgaben.
- Wählt passende Prompt-Kategorie & Template.
- Führt Validierung (Schema, Tokens, Constraints) durch.
- Rückgabe in konsistentem Format.

**Flow-Beispiel: Voting 75%**
1. Event `VoteProgress{artId, pct:75}` → Orchestrator.
2. Orchestrator wählt Template `Voting-Milestone Post`.
3. Persona-Agent prüft Tonalität.
4. Output `{variantA,B,C}` an Scheduler.
5. Scheduler postet gewählte Variante auf X.

---

## 5) Versionierung & Reuse
- **Prompt-Pool:** `/prompts/<category>/<name>.yaml` → tracked im Repo.
- **Versionierung:** Git, Conventional Commits (`prompt(copy): add milestone-75% template`).
- **Testing:** Unit-Tests mit Mock-Inputs (Vitest), Expected-Output Snapshots.
- **Reuse:** Prompt-Blocks modular (z. B. `constraints.yaml`, `persona.yaml`).

---

## 6) Evaluations-Framework
- **Metriken**
  - Engagement/Post (Copy Prompts)
  - Error/Abort-Rate (UX Prompts)
  - Build-Stabilität (Dev Prompts)
  - Trend-Coverage (Research Prompts)
  - False-Flag/False-Negative-Rate (Moderation Prompts)
- **Feedback Loops:** Logging der Prompt-Instanzen, Review durch Community/Owner.

---

## 7) Beispiel Prompt-Kits
**Persona-Layer**
```yaml
persona: Bad Art, Good Vibes
voice: degen, playful, meme-heavy
rules:
  - Use slang (CT style)
  - Max 1 emoji per sentence
  - Avoid corporate tone
  - Promote voting/participation
```

**Policy-Layer**
```yaml
constraints:
  - no NSFW
  - no hate speech
  - no PII leakage
  - keep under 280 chars
```

**Research-Layer**
```yaml
role: Trend-Scout
input: { timeframe: 7d, topic: "CT Memecoins" }
output: { hashtags: [..], insights: [..] }
steps:
  - Fetch trending hashtags
  - Summarize top 5 with context
```

---

## 8) Definition of Done
- Jeder Prompt hat: **Rolle, Kontext, Input, Output, Constraints, Steps**.
- Prompts liegen versioniert & getestet im Repo.
- Outputs sind deterministisch (Schema-validiert).
- Evaluations-Metriken ≥ Mindestwerte (Engagement, Error-Rates).

---

## 9) Risiken & Mitigation
- **Drift:** Prompts verlieren Wirkung → regelmäßige Review/Tuning.
- **Overfitting:** Zu enge Regeln → weniger Kreativität; Lösung: Varianten erzwingen.
- **Policy Violations:** Moderation-Prompts + Eskalationspfad.
- **Halluzination:** Schema-Validation, Retry, Human-in-the-loop.

---

## 10) Roadmap
- **Phase A:** Prompt-Pool initialisieren (Copy, UX, Dev).
- **Phase B:** Versionierung + Testing-Framework; Community-Review.
- **Phase C:** Erweiterung Persona/Policy-Layer; Auto-Tuning mit Feedback.
