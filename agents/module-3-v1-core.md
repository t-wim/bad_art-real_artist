
# Module 3 — V1 Core (Wissensfundament & Governance)

**Projekt:** $BART / Bad Art — Real Artist  
**Stand:** 2025-09-28 21:17  
**Ziel dieses Moduls:** Ein stabiles, wiederverwendbares Wissensfundament und governance‑naher Rahmen für alle nachfolgenden Arbeiten (Recherche → Synthese → Entscheidungen).

---

## 1) Zweck & Scope
- **Zweck:** Sicherstellen, dass jede Aufgabe auf **valider, nachvollziehbarer und versionierter** Wissensbasis beruht.  
- **Scope:** Quellenarbeit, Evidenz-Sammlung, Bewertungsraster, Entscheidungsprotokolle, „Definition of Truth“ (DoT) für Projektannahmen.

## 2) Rollen & Verantwortungen
- **Core‑Lead (Owner):** hält DoT aktuell, kuratiert Quellen, erzwingt Zitierregeln.  
- **Researcher:** führt systematische Web‑Recherche, fasst zusammen, bewertet Evidenz.  
- **Editor:** verdichtet Ergebnisse, prüft Logik & Kohärenz.  
- **Stakeholder (Bart/Admin/Team):** gibt **Go/No-Go** für Annahmen und Richtlinien.

## 3) Arbeitsprinzipien (DoT)
1. **Nachvollziehbarkeit:** Jede Kernaussage hat **Quelle + Datum**.  
2. **Frische:** Aussagen mit Haltbarkeitsdatum (Preise, Tools, APIs) werden **datiert** und zyklisch verifiziert.  
3. **Neutralität:** Trenne Fakten, Hypothesen, Meinungen.  
4. **Entscheidbarkeit:** Jede Recherche mündet in **Empfehlung + Risiko + next step**.

## 4) Workflow (Schleife je Thema)
1. **Mission formulieren →** *1–2 Sätze Problemstatement + gewünschter Outcome.*  
2. **Rechercheplan:** Keywords, Quellenklassen, Kriterien (Qualität, Aktualität).  
3. **Erhebung:** Kurze Exzerpte, Zitate, Belege (Link, Datum), Artefakte (Screens/CSV).  
4. **Bewertung:** Evidenzmatrix (pro/contra, Reifegrad, Risiken).  
5. **Synthese:** 1‑Seiter „Was heißt das für $BART?“  
6. **Decision Log:** Beschluss, Owner, Gültigkeit, Review‑Termin.  
7. **Handover:** An Community (V2) oder Automation (V3).

## 5) Artefakt-Formate
- **/core/briefs/**: `YYYY‑MM‑DD-topic-brief.md` (Mission, Kontext, KPIs).  
- **/core/findings/**: `YYYY‑MM‑DD-topic-findings.md` (Quellen, Auswertung).  
- **/core/decision‑log/**: `YYYY‑MM‑DD-decision.md` (Entscheidung & Gründe).  
- **/core/glossary.md**: Projektbegriffe (ein Satz + Quelle).

## 6) Bewertungsraster (Kurz)
- **Qualität (0–3):** Primärquelle? Methode transparent?  
- **Aktualität (0–3):** <30 Tage alt? Relevanzdatum vorhanden?  
- **Übertragbarkeit (0–3):** Für $BART anwendbar?  
- **Risiko (0–3):** Fehleinschätzung/Lock-in/Legal.

## 7) Checklisten
- [ ] Mission ist **konkret** (Problem + Outcome).  
- [ ] Mind. **3 hochwertige Quellen**; Datum dokumentiert.  
- [ ] **Evidenzmatrix** erstellt; Alternativen genannt.  
- [ ] **Decision Log** aktualisiert; Owner benannt.  
- [ ] **Handover‑Paket** an V2/V3.

## 8) KPIs
- **Time‑to‑Decision**, **Quote belegter Aussagen**, **Review‑Treffer (Korrekturen)**, **Wiederverwendungsrate Artefakte**.

## 9) Beispiel „DoT‑Snippet“
```yaml
assumption: "X-Posts bei 25/50/75/100% Voting erhöhen Engagement"
evidence:
  - source: "Case Study Project Y"
    date: "2025-06-12"
    note: "CTR +18% bei Meilenstein-Posts"
risk: "Kann Spam wahrgenommen werden"
decision: "Testlauf Season 1, 2 Wochen"
owner: "Core-Lead"
review: "2025-10-15"
```
