# CancerInsight SG

A static cancer information website focused on the Singapore healthcare context. Covers cancer statistics, survival rates, treatment protocols, costs with Singapore subsidy calculations, health assessment, and support resources.

**Live site:** [joelfirenze.github.io/claude-cancer](https://joelfirenze.github.io/claude-cancer)

## Features

- **Cancer Statistics** — Filterable cancer cards with Singapore-specific incidence and mortality data
- **Survival Rates** — Interactive Chart.js survival curves by cancer type and stage
- **Treatment Protocols** — NCCN-based treatment information with cancer type and stage selection
- **Cost Calculator** — Estimates treatment costs with MediShield Life, MediFund, and MAF subsidy calculations
- **Health Profile** — Assessment form with sessionStorage persistence (cleared on browser close for privacy)
- **Support Resources** — Singapore cancer support organisations and helplines

## Getting Started

No build tools or dependencies to install. Open any `.html` file in a browser, or serve locally:

```sh
python3 -m http.server
```

Then visit `http://localhost:8000`.

## Tech Stack

- HTML / CSS / vanilla JavaScript (no frameworks)
- [Chart.js](https://www.chartjs.org/) via CDN for survival charts
- Google Fonts (Inter, Playfair Display)
- Deployed on GitHub Pages

## Data Sources

See [DATA_SOURCES.md](DATA_SOURCES.md) for full citations, including Singapore Cancer Registry, SEER/NCI, GLOBOCAN 2022, NCCN Guidelines 2024, and MOH Singapore fee schedules.

## Disclaimer

This website is for informational purposes only and does not constitute medical advice. Always consult a qualified healthcare professional for medical decisions.
