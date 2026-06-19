# Frai · Cohort 01 waitlist site

A single-page, zero-build waitlist + application site for **Frai**, a 4-week cohort
where Nigerian SME owners ship a real AI tool on their own business data.

Built as plain HTML/CSS/JS with no framework, no build step, and no dependencies.
Open `index.html` or drop the folder on any static host (`frai.site`).

## Design

Intentional, not generic. The system is **"The Build Ledger"**:

- **Type** (the differentiator): `Bricolage Grotesque` display, `Hanken Grotesk` body,
  and `JetBrains Mono` for technical labels, numbers, and "receipt" annotations.
- **Palette**: warm cream paper, espresso ink, a vermilion "ship it" accent, amber
  marker highlight, one quiet ink-blue. One deep-dark section (the demo + apply form)
  for technical credibility.
- **Depth without glass**: hard poster offset shadows (`4px 4px 0 ink`) plus soft
  ambient shadows, 1px ink rules, and a faint paper grain. Sharp radii (2-5px). No
  frosted blur, no oversized pill blobs.
- **Founder proof is real**: Lawal Giyath's actual record (1st place FTC Nigeria
  Robotics 2022 as lead programmer, Head of Software Team Contechs 2024, UNILAG BSc
  Electrical Engineering, hands-on robotics/drone teaching at Airlab) anchors the
  "I build and I teach builders" promise.

Conversion mechanics follow 2026 waitlist research: short page, single-outcome
headline, a **real** countdown to a real date, visible seat counter as social proof,
"Apply" (not "Submit"), and an application form that doubles as curriculum input.

## Configuration

All knobs live at the top of `script.js` in the `CONFIG` object:

```js
const CONFIG = {
  applicationsCloseISO: "2026-07-01T23:59:59", // real close date, kept honest
  totalSeats: 30,
  seatsLeft: 9,        // social proof, kept static on purpose (not auto-updated)
  endpoint: "https://formspree.io/f/xbdpoplj", // Formspree form
};
```

- **Deadline**: applications close end of day **July 1, 2026** (local time). The
  countdown auto-switches to a "closed" message at zero.
- **Seats**: the counter is intentionally static. Cohort is capped at 30.
- **Auto-close**: once the deadline passes, both the hero email capture and the
  application form stop accepting submissions (inputs disabled, closed notice shown,
  and the submit handlers re-check the deadline as a safety guard). This fires
  immediately if the page is opened after July 1.

## Form backend (Formspree)

Both the hero email capture and the application form `POST` JSON to the Formspree
endpoint. Each payload is tagged with a `type` field so you can tell them apart:

```jsonc
// hero capture
{ "type": "waitlist", "email": "..." }

// application
{ "type": "application", "name": "...", "business": "...",
  "business_type": "...", "automate": "...", "contact": "...", "email": "..." }
```

To collect submissions elsewhere, swap `endpoint` for any URL that returns 2xx on a
JSON POST (e.g. a Google Apps Script web app or your own API). Set it to `null` to
run in demo mode (submissions logged to console + saved to `localStorage`).

## Local preview

```bash
python -m http.server 8753
# open http://localhost:8753
```

## Files

- `index.html` · markup + content
- `style.css` · full design-token system + all components
- `script.js` · countdown, scroll reveal, interactive RAG demo, form handling
