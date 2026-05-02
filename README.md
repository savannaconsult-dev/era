# eRA — Enterprise Readiness Analyzer
**by Savanna Consulting**

A complete ERP evaluation toolkit for consultants and organizations. Six tools, one structured process.

## Tools Included

| # | Tool | Purpose |
|---|------|---------|
| 01 | Requirements Scorecard | Weighted vendor comparison across 5 categories |
| 02 | TCO Calculator | 3-year side-by-side cost model |
| 03 | DCAA Readiness Guide | GovCon accounting system adequacy |
| 04 | RFI & Demo Script | Structured RFI + scripted demo agenda |
| 05 | Data Migration Audit | Migration risk assessment |
| 06 | Implementation Playbook | Project charter, contract checklist, go-live gauge |

## Features

- **Multi-evaluation support** — create, name, and switch between client evaluations, each stored independently
- **Auto-save** — all inputs save automatically to localStorage as you work
- **Print reports** — export any tool or the full dashboard summary as PDF
- **No backend required** — runs entirely in the browser

## Deployment (GitHub Pages)

1. Push this repo to GitHub
2. Go to **Settings → Pages**
3. Set source to `main` branch, `/ (root)`
4. Your app will be live at `https://yourusername.github.io/era`

## File Structure

```
index.html        # App shell + all panels
style.css         # All styles
eval-manager.js   # Evaluation Manager + localStorage persistence
tools.js          # Tool data, scoring logic, dashboard
app.js            # Navigation, UI init, auto-save wiring
```

## License

Single-organization use. Not for redistribution.

---

© 2026 Savanna Consulting LLC · savannaconsult.com · Baltimore, MD
