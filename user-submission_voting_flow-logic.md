
### Submission ✍️
- Require **X-@handle + png/jpg**.  
- If **context/theme feature** is enabled → accept text and carry it into bart’s design notes.  
- Show note: *“bart will creatively redesign your PFP.”*  

---

### Moderation / Curation 🎛️
- Only **Admin (bart)** selects **3 entries**.  
- On publish:  
  - start countdown,  
  - initialize vote log,  
  - mark candidates as **active**.  

---

### Voting (mirrored) 🗳️
- Show the same candidates on **Website** and **bart’s X profile**.  
- Display **combined totals** (logic implementation-specific; surface as one “status” value).  
- Show countdown.  
- Display **“Automated X-posts at milestones”** badge when thresholds fire.  

---

### Automated X-Posts (milestones) 📢
- **Config keys:**  
  - `milestones`: [0.25, 0.5, 0.75, 1.0] *(1.0 = final wrap-up)*  
  - `postTemplateKey`: “default”  
  - `hashtags`: [“bart”, “pfp”]  
- **Content:**  
  - Use “These 3 are up for vote…” + status.  
  - Optionally add a **random phrase** as lead-in.  

---

### Round Close ⏱️
When countdown hits zero:  
- finalize vote log,  
- compute winner(s),  
- reset active vote state for next round.  

---

### Mint → Hall of Fame (future) 🏆
- Winners can be **minted on-chain**.  
- Once minted:  
  - move item to **Hall of Fame**,  
  - remove from all future votes,  
  - label: *“Minted on-chain.”*  

---

### Gallery → X-Share Popup 🖼️
**Initial popup contents:**  
- selected gallery image,  
- text field prefilled with **random phrase** or **unique context prompt** (user editable),  
- two CTAs: “Direct Share” (post immediately), “Generate Background” (expand popup),  
- collapsible info about “Generate Background.”  

**Expanded popup (after “Generate Background”):**  
- live preview with generated background (**no navigation away**),  
- **style dropdown** (curated list),  
- **text input** for prompt,  
- two toggles: *Prompt view* ↔ *X-Post text view*,  
- final **“Share to X” button** using current X-Post text.  

