# $BART — Moodboard & UI/UX Layout (v1)

> Ziel: Visuelle Leitplanken (**Moodboard**) + konkrete **UI/UX-Blueprints** für die in der Roadmap definierten Flows. Fokus: „Bad Art / Real Artist“ – roh, frech, memetauglich, aber produktionsreif.

---

## 1) Brand-Essenz (Leitidee)

* **Claim:** *Bad Art. Real Artist.*
* **Tonality:** degen, verspielt, sarkastisch, aber klar in der Bedienung.
* **Formensprache:** Scribbles, Marker-Kanten, „schiefe“ Rahmen, Skizzenränder, Post-It-Look.
* **Haptik:** „Papier & Filzstift trifft Neon-UI“ – Analoge Texturen in digitalem Grid.

---

## 2) Moodboard (Wort-Bild-Wolke)

* **Stichworte:** Neon‑Pink, Acid‑Green, Tape/Scribble, Glitch‑Noise, Pixel‑Smudge, Countdown‑LED, Sticker‑Collage, Post‑It‑Notes, Handgeschriebene Labels, Voting‑Badges, Confetti.
* **Bildwelten:** Kritzel-PFPs, Marker‑Outlines, rough Crops, überklebte Avatare, „Work‑in‑Progress“ Screenshots.
* **UI‑Pattern‑Anker:** Karten mit „angefransten“ Rändern, Buttons mit Marker‑Hover, Badges als Sticker, Toasts wie „Tape“.

---

## 3) Farbwelt (v1 Vorschlag)

> Kontraststark, AA-konform in UI‑Kontrasten; „Lärm“ (Scribbles) über Layer/Opacity steuern.

* **BART Pink** `#FF2E88` – Primär‑Akzent (CTAs, aktive States)
* **Acid Green** `#00F779` – Voting/Success/Live
* **Ink Black** `#0B0B0F` – Hintergrund/Dark‑Mode Basis
* **Paper White** `#F8F8FA` – Flächen, Modale
* **Graphite** `#1E2227` – Karten/Container
* **Chalk Gray** `#E5E7EB` – Linien/Dividers
* **Warning Yellow** `#FFD400` – Milestones/Timer‑Warnung
* **Electric Cyan** `#00E6FF` – Secondary accents (Links/hover)

> **Gradients:** Pink→Cyan (45°) für Hero/Timer‑Glow; Green→Yellow für „Live“‑Badges.

---

## 4) Typografie & Schriftbild

* **Display:** *Sora* / *Space Grotesk* (fett, breit für Headings & Zahlen/Timer)
* **Text:** *Inter* / *Rubik* (UI‑Copy, Labels)
* **Handschrift‑Akzent:** Ein eingesetzter „Marker“‑Font (sparsam! z. B. für Sticker‑Tags)
* **Zahlenästhetik:** Monospaced Alternative für Timer/Vote‑Counts (*IBM Plex Mono*).

---

## 5) Texturen & Iconik

* **Scribble‑SVGs:** frei skalierbare Linien (Header‑Underline, Kartenrahmen)
* **Paper‑Noise:** feines Körnchen (2–4% Opacity) auf hero/großen Flächen
* **Sticker‑Set:** „VOTE“, „SUBMIT“, „HoF“, „LIVE“ – als runde/abgerissene Sticker‑Badges
* **Icons:** Kontur‑Icons, 1.5–2px, leicht „wackelige“ Caps (micro‑randomized SVG)

---

## 6) Design‑System (Token & Scale)

* **Grid:** 4‑pt‑Raster; Container 1240px; Spalten 12; Gutters 24px
* **Radius:** `r-2` (4), `r-3` (8), **Default:** 12, **Chips:** 999 (pill)
* **Shadow:** weiche Drop‑Shadows + optionaler *Marker‑Glow* (Pink/Cyan in 12–24px)
* **Spacing:** `4/8/12/16/24/32/48/64`
* **Motion:** 120–200ms ease‑out; „Scribble‑Wiggle“ (2–3px jitter, 300ms loop) auf Hover für Badges

*Tailwind‑Token (Kurzskizze):*

```js
// tailwind.config.js (Auszug)
theme: {
  extend: {
    colors: {
      bart: { pink: '#FF2E88', green: '#00F779', ink: '#0B0B0F', paper: '#F8F8FA', graphite: '#1E2227', chalk: '#E5E7EB', warn: '#FFD400', cyan: '#00E6FF' }
    },
    boxShadow: {
      marker: '0 0 24px rgba(255,46,136,0.35)',
    },
    borderRadius: { xl: '12px' },
  }
}
```

---

## 7) Seiten‑Archetypen & Layouts

### 7.1 Home (Pitch + Live‑Round)

* **Hero:** Claim + CTA [Submit] [View Round]; Timer‑Marquee (LED‑Look) + Milestone‑Badges (25/50/75/Final)
* **Current Round (Top‑3):** 3 Karten nebeneinander (mobile: swipeable), Live‑Votes + „Mirror: X‑Poll Sync“‑Badge
* **How it works:** 3‑Steps Skizze (Submit → Curate → Vote) mit Scribble‑Pfeilen
* **Gallery Teaser:** 3–6 Grid Items (Popular)
* **Footer:** Socials, Terms, „Made by degen artists“

### 7.2 Submit (Form)

* **Upload‑Card:** Dropzone (PNG/JPG), Vorschau, @handle, optional Theme/Context, Checkbox Regeln
* **Validation:** exakte Fehlermeldungen, File‑meta‑Labels
* **Toasts:** success/fail als Sticker‑Toasts

### 7.3 Voting (Round)

* **Countdown‑Header:** großer Timer, Milestone‑Progress (25/50/75/Final)
* **Kandidat‑Karten (3):** Bild, Handle, Tagline, Vote‑Button, Live‑Count, Share‑to‑X
* **Mirror‑Status:** Sync‑Pill (Synced / Pending / Retry) + letzte Sync‑Zeit

### 7.4 Gallery

* **Controls:** Tabs Popular/New + Filter (Theme Tags)
* **Grid:** Mauerwerk 3–5 Spalten; Hover: Sticker‑Actions (Like/Share)
* **Detail‑Modal:** Großbild, Meta, Share, „Magic Background“-CTA

### 7.5 Magic‑Background‑Creator (Overlay)

* **Dual‑Pane:** Links Style‑Presets + Prompt‑Feld; Rechts Preview
* **Switch:** Prompt ↔ Post; Button [Apply & Share]
* **States:** Generating (progress), Retry, Variationen

### 7.6 Hall of Fame

* **Chronik‑Grid:** Gewinner‑Karten mit Season/Theme Chip
* **Detail:** Story, evtl. On‑Chain Badge (später NFT‑Mint)

### 7.7 Admin

* **Moderation‑Queue:** Tabelle + Bild‑Preview; Actions Approve/Reject; „Shortlist Top‑3“
* **Automation:** X‑Post‑Templates, Milestone‑Scheduler, Mirror‑Monitor
* **Metrics:** Funnel, Web vs X Votes, Round‑Pacing

### 7.8 Sketchpad (Add‑on)

* **Canvas‑Toolbar:** Brush, Größe, Farbe, Undo/Redo, Eraser
* **Room‑Presence:** Avatare, Live‑Cursor, Invite‑Link
* **Export:** PNG/SVG, Autosave → Gallery

---

## 8) Komponenten‑Inventar (mit States)

* **Button / CTA:** default, hover (marker‑glow), loading (dots), disabled
* **Card.Artwork:** normal, hover (sticker‑reveal), selected, winner (confetti anim)
* **Badge/Sticker:** vote, live, synced, out‑of‑sync, hof
* **Toast:** success (green), fail (pink), info (cyan)
* **Timer:** normal, warn (<10% → yellow pulse), danger (<60s → pink shake)
* **Upload Dropzone:** idle, drag‑over, validating, error
* **Share Popup:** prefilled text, copy, open X
* **Progress/Milestones:** 0→25→50→75→100% mit Step‑chips
* **Tabs/Filters/Chips:** selectable, multi‑select, clear‑all
* **Table (Admin):** compact rows, image‑thumb, sticky actions

---

## 9) Event → UI‑Feedback Mapping (Roadmap‑Bezug)

* ***submit*** → Dropzone „validating…“ → Success‑Toast „Submitted! Pending curation.“
* ***toast success/fail*** → Sticker‑Toast mit Icon + kurzer Klartext
* ***vote cast*** → Button → mini confetti + number tick; Fail → retry tooltip
* ***mirror update*** → Sync‑Pill blinkt → „Synced vor 12s“
* ***round start*** → Banner „New Round live“ + Timer reset anim
* ***25/50/75/final trigger*** → Milestone‑badge pop + Auto‑X‑Post (Admin UI zeigt Preview)
* ***round end*** → Modal „Winner“ + CTA Hall of Fame

---

## 10) Copy & Mikrotext (Beispiele)

* **Submit‑CTA:** „Drop your doodle. Be a Real Artist.“
* **Voting:** „Tap to vote. Bad art, good taste.“
* **Error Upload:** „Too thicc – max 4MB. Squish it.“
* **Milestone:** „Halfway there. Shill harder.“

---

## 11) Accessibility & Responsiveness

* **Kontrast:** Buttons/Badges AA; Pink auf Paper White, Green auf Graphite
* **Focus‑States:** klarer 2–3px Outline (Cyan)
* **Breakpoints:** `sm 360`, `md 768`, `lg 1024`, `xl 1280+`
* **Motion‑Reduce:** ersetzt Jitter durch Opacity‑Wechsel

---

## 12) Artefakte & Deliverables (für Figma/Code)

* **Style‑Tile:** Palette, Typo, Sticker, Buttons, Karten‑Beispiele
* **Component Set:** Buttons, Chips, Cards, Toasts, Timer, Tabs, Table Admin
* **Layouts:** Home, Submit, Voting, Gallery, Detail‑Modal, HoF, Admin, Sketchpad
* **Icon‑Pack (SVG):** 16/20/24 px Strichicons
* **Scribble‑Library (SVG):** 12–16 Formen (Underline, Ecke, Rand, Kreuz)

---

## 13) Implementierungs‑Hinweise (Next.js + Tailwind)

* Präfer **dark‑first** (Ink Black) + „Paper“‑Sektionen für Kontrastblöcke
* Komponenten als **Headless + Skins** (Logik trennbar von „Bad Art“‑Skin)
* Stickers als **SVG‑Components** mit `aria-hidden` und `prefers-reduced-motion`
* **Toast/Confetti** lazy‑laden; **X‑Share** via Web Share API, Fallback „Copy“

---
/////////////////////  mögliche erweiterung  ///////////////////////
### 14) Offene Kontextpunkte (optional für v2)

* Exakte **Brand‑Fonts** (finale Auswahl + Lizenz)
* Grenzen **Bildgrößen/Seitenverhältnis** fürs Submit (Crop‑UX?)
* **Voting‑Regeln** (Rate‑Limit, Anti‑Spam, Captcha?)
* **Magic‑Background**: Preset‑Stile (Namen + Vorschau‑Tiles)
* **Auto‑X‑Post**: Tonalität & Template‑Varianten

---

### 15) Nächste Schritte (konkret)

1. Style‑Tile in Figma bauen (Palette/Typo/Sticker/Buttons)
2. Home + Submit + Voting als responsive Frames (mobile→desktop)
3. Component Set in Code (Tailwind Tokens + 3–5 Schlüsselelemente)
4. Admin‑Wireframing (Queue, Automation, Metrics)
5. v2 Iteration (Kontextpunkte klären, HoF/NFT‑Badges)
