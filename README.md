# Frai · Custom AI Agents & Automations for Your Business

A single-page, zero-build studio homepage and proposal intake site for **Frai**, a premium custom AI development and automation agency.

Built as plain HTML/CSS/JS with no framework, no build step, and no dependencies. Open `index.html` or host the folder on any static host (`frai.site`).

## Design

Intentional, not generic. The system is **"The Build Ledger"**:

- **Type** (the differentiator): `Bricolage Grotesque` display, `Hanken Grotesk` body, and `JetBrains Mono` for technical labels, numbers, and "manifest" annotations.
- **Palette**: warm cream paper, espresso ink, a vermilion "ship it" accent, amber marker highlight, one quiet ink-blue. One deep-dark section (the demo + proposal form) for technical credibility.
- **Depth without glass**: hard poster offset shadows (`4px 4px 0 ink`) plus soft ambient shadows, 1px ink rules, and a faint paper grain. Sharp radii (2-5px). No frosted blur, no oversized pill blobs.
- **Founder proof is real**: Lawal Giyath's actual record (1st place FTC Nigeria Robotics 2022 as lead programmer, Head of Software Team Contechs 2024, UNILAG BSc Electrical Engineering, hands-on robotics/drone teaching at Airlab) anchors the "I build and I teach builders" promise.

Conversion mechanics follow agency lead-generation best practices: short page, value-driven headlines, active performance/capacity status ledger, and a structured proposal request form that captures project brief inputs.

## Configuration

All knobs live at the top of `script.js` in the `CONFIG` object:

```js
const CONFIG = {
  totalSlots: 4,
  slotsLeft: 1,        // social proof, capacity limit representation
  endpoint: "https://formspree.io/f/xbdpoplj", // Formspree form backend
};
```

- **Slots**: The capacity slots are updated in the UI to encourage urgency without relying on artificial countdown deadlines.
- **Auto-Update**: Elements marked with `[data-slots-left]` are automatically updated on page load from `CONFIG.slotsLeft`.

## Form backend (Formspree)

Both the hero email consultation capture and the proposal application form `POST` JSON to the Formspree endpoint. Each payload is tagged with a `type` field so you can tell them apart:

```jsonc
// hero consultation request
{ "type": "consultation_request", "email": "..." }

// proposal brief request
{ "type": "proposal_request", "name": "...", "business": "...",
  "business_type": "...", "automate": "...", "contact": "...", "email": "..." }
```

To collect submissions elsewhere, swap `endpoint` for any URL that returns 2xx on a JSON POST (e.g., a Google Apps Script web app or your own API). Set it to `null` to run in demo mode (submissions logged to console + saved to `localStorage`).

## Local preview

```bash
python -m http.server 8753
# open http://localhost:8753
```

## Files

- `index.html` · markup + content (SEO, JSON-LD schemas, structure)
- `style.css` · full design-token system + all components
- `script.js` · status board, scroll reveal, interactive RAG demo, form handling
