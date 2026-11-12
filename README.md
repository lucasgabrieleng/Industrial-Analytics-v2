# Industrial Analytics — Interactive OEE & Plant Telemetry UI

A modern, interactive web interface for **Industrial KPI Analytics**, evolving the original Python & Streamlit [`IndustrialAnalytics`](https://github.com/lucasgabrieleng/IndustrialAnalytics) project into a responsive, multi-theme engineering dashboard built with **React**, **TypeScript**, **Tailwind CSS**, and custom interactive SVG data visualizations.

---

## Key Features & Dynamic Views

### 1. Overview & Live OEE Speedometer Simulator
- **Executive KPI Strip:** Real-time annual summary of **OEE**, **Availability**, **Performance**, and **Quality** compared against target thresholds (`pp` variance).
- **Interactive Speedometer Gauge:** Adjust **Availability (%)**, **Performance (%)**, **Quality (%)**, and **Target OEE (%)** sliders to simulate Overall Equipment Effectiveness (`OEE = (A × P × Q) / 10,000`) and evaluate World-Class (`≥ 85%`) attainment on the fly.

### 2. OEE & Pillars Deep Dive
- **Monthly Target Attainment:** Interactive bar chart highlighting months meeting or missing target OEE against a dashed target reference line.
- **Multi-Mode Pillar Breakdown:** Toggle seamlessly between **Grouped Bars**, **Stacked Breakdown**, and **Area Trend** views with interactive legend filtering.
- **Polar Radar Profile:** Compare **Meta vs. Real** performance for any selected month across all four KPIs.
- **Availability vs. Performance Quadrant:** Bubble scatter plot sized by OEE and color-coded by Quality.
- **Annual Heatmap Matrix & Inline Editor:** Inspect monthly intensity across components and edit monthly values directly in the browser to test scenarios.

### 3. Utility & Input Consumption Trends
- Monitor specific input consumption (`Insumo 1`, `Insumo 2`, `Insumo 3`) across **Planta A**, **Planta B**, and **Planta C**.
- **Compare All Plants** mode for multi-series benchmarking, selectable date-range windows, and automated period statistics (Average, Peak, Minimum, Period Delta).

### 4. KPI Correlation & Linear Regression
- Dynamic **X vs. Y Scatter Plot** with an Ordinary Least Squares (OLS) trendline, **Pearson $r$**, **$R^2$**, and linear equation computed live over the selected date window.
- Configurable **2×2 to 4×4 Pearson Correlation Matrix** heatmap.

### 5. Equipment Performance Heatmap
- Cross-asset matrix comparing **Equipamento A–E** across selectable KPI columns with a sortable benchmark ledger highlighting production cells that need attention.

### 6. Downtime Distribution & Pareto Analysis
- Synchronized **Donut Chart** and **Pareto Impact Breakdown** showing stoppage frequency, percentage share, cumulative Pareto %, and estimated lost hours.
- Add new stoppage causes or adjust counts directly in the UI to recalculate priorities instantly.

### 7. Custom Theme Studio & Bilingual Support (`EN` / `PT`)
- **Light / Dark Mode** and four curated industrial presets (**Precision Cobalt**, **Obsidian Control Room**, **Crimson Legacy**, **Emerald Sustainability**), plus a live custom accent color picker.
- **Streamlit Theme Exporter:** Generates and copies a synchronized `.streamlit/config.toml` snippet so your Python Streamlit dashboards match your custom web theme.
- **Instant Language Toggle:** Switch the full interface between **English (`EN`)** and **Portuguese (`PT`)**.

---

## Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend Framework** | React 19 + TypeScript |
| **Build Tool** | Vite 8 |
| **Styling & Theming** | Tailwind CSS v4 (CSS Variables + `.dark` custom variant) |
| **Data Visualization** | Custom interactive SVG charts (Gauge, Radar, Bubble, Heatmap, Scatter/OLS, Donut/Pareto) |
| **Icons** | Lucide React |

---

## Project Structure

```text
├── index.html
├── package.json
└── src/
    ├── App.tsx                             # Sidebar shell, top breadcrumb bar & view router
    ├── index.css                           # Tailwind v4 setup, fonts & theme CSS variables
    ├── context/
    │   └── ThemeContext.tsx                # Light/Dark polarity, presets, accent & TOML generator
    ├── data/
    │   ├── industrialData.ts               # Industrial datasets, OEE math, Pearson r & OLS regression
    │   └── translations.ts                 # Bilingual EN / PT dictionary
    ├── types/
    │   └── analytics.ts                    # TypeScript interfaces
    └── components/
        ├── ThemeStudioModal.tsx            # Live theme customizer & .streamlit/config.toml export
        ├── charts/
        │   ├── OeeCharts.tsx               # Speedometer, Target Bars, Pillars, Radar & Bubble charts
        │   └── AnalyticsCharts.tsx         # Heatmap Matrix, Consumption Line, Scatter & Donut charts
        └── views/
            ├── OverviewView.tsx
            ├── OeeDeepDiveView.tsx
            ├── ConsumosView.tsx
            ├── CorrelacaoView.tsx
            ├── HeatmapView.tsx
            └── ParadasView.tsx
```

---

## Getting Started Locally

### Prerequisites
- **Node.js** `18+` and **npm**

### Installation & Development
```bash
# 1. Clone your repository
git clone https://github.com/lucasgabrieleng/IndustrialAnalytics-UI.git
cd IndustrialAnalytics-UI

# 2. Install dependencies
npm install

# 3. Start the development server (http://localhost:3000)
npm run dev
```

### Build & Type-Check
```bash
# TypeScript check
npm run lint

# Production bundle (outputs to dist/)
npm run build
```

---

## Author

**Lucas Gabriel** — Industrial Engineering & Data Analytics  
- Original Python / Streamlit Repository: [lucasgabrieleng/IndustrialAnalytics](https://github.com/lucasgabrieleng/IndustrialAnalytics)
