# Moodboard QA Check – $BART

## Extracted Identity

### Color Palette
- Core: Black `#000000`, White `#FFFFFF`
- Accents: Neon Green `#00FF00`, Pink `#FF2CA3`, Red `#FF0000`
- Secondary: Purple `#8A2BE2`, Blue `#1E90FF`, Gray `#808080`

### Typography Stack
- Hero / Headlines: **Permanent Marker** – loud, raw, scribbled impact for main slogans.
- Subheadlines / Labels: **Comic Neue** – ironic-clean readability for navigation, button labels, form headers.
- Body / Meta: **Gloria Hallelujah** – handwritten commentary for descriptions, helper text, tooltips.
- Hall of Fame / Stats: **VT323** – retro terminal feel for rankings, timers, counters.
- Specials / Badges: **Misfits Trash** & **Glitch Goblin** – punk/VHS noise for limited badges and milestone stickers.

### UI Motifs & Interaction Tone
- Gallery feels like a kid’s room gone wrong: crooked crayon frames, marker doodles, hover jitters.
- Voting behaves like sticker bombing: neon +1 stickers, chaotic overlays, visible sticker sheet.
- Upload area mimics a messy craft table with crumpled paper, scattered markers, floating stickers.
- Hall of Fame uses neon spotlights and doodle carpets with subtle zoom/pan motion.

### Image & Humor Cues
- Stick figures with Y-heads, hollow eyes, glitchy scribbles, charts of fleeing figures.
- Embrace chaotic, ugly-beautiful compositions and analog smears.
- Messaging mantra: “Truth lies in imperfection – Bad Art wins.”

### Micro-Copy Guidelines
- Tone: playful, self-aware, ironically confident.
- Use short punchlines, scribbled-aside style helper text.
- Celebrate failure and imperfection (“submit your glorious mess”, “stick a vote, chaos ensues”).
- Acknowledge jokes about bad art but remain welcoming and inclusive.

## UI Leitplanken

### Buttons
- Comic Neue uppercase, chunky padding, neon outlines that jitter on hover.
- Primary: Neon Green fill with Pink shadow; destructive: Red fill with scribbled underline.
- Include micro-copy tags like “DO IT” / “PANIC” inline where appropriate.

### Cards & Galleries
- White or light-gray backgrounds with hand-drawn border SVGs.
- Add corner stickers/badges using Misfits Trash/Glitch Goblin fonts.
- Hover: slight rotation + shake animation, reveal doodle annotations.

### Empty States
- Display doodled characters holding “???” signs.
- Copy like “No chaos yet. Throw in your weird.”
- Offer CTA button with neon outline and playful subtext.

### Toasts & Notifications
- Use comic-style speech bubble container with offset drop shadow.
- Success: Neon Green burst icon; Failure: Red scribble with “uh-oh”.
- Always include a micro-aside (e.g., “approved-ish”, “try again but weirder”).

### Loaders & Progress
- Hand-drawn spinner or scribbled progress bar with bouncing stickers.
- Countdown timers in VT323 with glitch flicker at milestones.

## Moodboard QA Notes

### Open Points
- Confirm licensing/availability for specialty fonts (Misfits Trash, Glitch Goblin) for web embedding.
- Clarify whether Hidden Bonus Wallet Connect is in scope for current milestone or future phase.

### Risks
- Maintaining readability/accessibility with handwriting fonts; may require fallback stack and contrast checks.
- Hover animations and sticker overlays could impact performance on low-powered devices.

### Decisions & Assumptions
- Adopt Tailwind theme tokens aligned to defined palette for consistent neon accents.
- Reserve VT323 for scoreboard/timer components to keep hierarchy clear.
- Treat Wallet Connect bonus as optional enhancement unless explicitly prioritized later.

