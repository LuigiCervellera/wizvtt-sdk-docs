## 🎲 WizVTT System Submission Form

Thank you for contributing to the WizVTT community ecosystem! Please fill out the form below to assist the maintainers during human supervision and review.

---

### 📋 System Information
- **System Name**: (e.g. *Dungeon World 2e*, *Fate Core*, *Pathfinder 2e Homebrew*)
- **System ID**: (lowercase kebab-case, e.g. 'dungeon-world')
- **Version**: (e.g. 1.0.0)
- **Author / Team**: (GitHub @username or Organization)
- **License**: (e.g. MIT, CC-BY-4.0, OGL 1.0a, ORC)
- **Game Engine Style**:
  - [ ] Standard D20 / DC Checks
  - [ ] Dice Pool / Successes (WoD, Year Zero, Mutant)
  - [ ] Percentile (D100 / Call of Cthulhu)
  - [ ] Narrative / Custom Mechanics

---

### 🎨 Visual Theme & Palette
- **Default Theme Preset**: (Grimdark, High Fantasy, Cyberpunk, Eldritch, Sci-Fi, Steampunk, Minimalist, or Custom)
- **Primary Color**: (e.g. #3b82f6)

---

### 🧪 Checklist for Authors
Before requesting human review, please ensure you have completed the following:
- [ ] Developed and tested in the local sandbox (
pm run dev).
- [ ] 
pm run validate passes with **0 errors**.
- [ ] 
pm run build compiles cleanly (	sc -b && vite build) with **0 TypeScript errors**.
- [ ] No hardcoded network requests (etch, external CDNs) or dangerous execution (val).
- [ ] All roll buttons use the standard onRoll callback contract.
- [ ] Included sample default stats/attributes so the sheet can be immediately previewed.

---

### 📸 Screenshots & Video Preview
*(Drag & drop screenshots or GIFs of your character sheet in action below)*

`
[Add screenshots here]
`

---

### 🛡️ Human Reviewer Checklist (For WizVTT Maintainers)
- [ ] CI checks (TypeScript Check & Security Audit) passed.
- [ ] Tested live in the Sandbox preview.
- [ ] Verified theme styling, contrast, and mobile/desktop responsiveness.
- [ ] Verified OGL / Creative Commons licensing compliance.
- [ ] Approved for registry inclusion.
