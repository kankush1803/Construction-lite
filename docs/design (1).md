# Construction Project Monitoring Dashboard — Design System

> Design reference: uploaded Construction Project Monitoring Dashboard screenshot.
> Goal: recreate a clean, professional, information-dense construction analytics dashboard for a desktop application.
> Design principle: prioritize clear hierarchy, fast scanning, consistent spacing, readable charts, and restrained color.

---

## 1. Visual Direction

- **Style:** professional enterprise analytics; light theme; minimal, structured, data-first.
- **Mood:** reliable, calm, precise, operational.
- **Canvas:** warm/light neutral background with white cards.
- **Density:** medium-high. Many KPIs and charts are visible at once, but each panel has clear boundaries.
- **Shape language:** softly rounded outer frame and cards; subtle borders and shadows.
- **Avoid:** gradients, glassmorphism, neon colors, oversized headings, excessive icons, heavy shadows, and decorative illustrations.

## 2. Color Palette

Use these as a close starting palette based on the reference. Exact sampled pixel values are not guaranteed; tune them against the screenshot.

| Token | Hex | Usage |
|---|---|---|
| `color.canvas` | `#F3F5F6` | Main app background |
| `color.surface` | `#FFFFFF` | Dashboard cards, header, filters |
| `color.surface-subtle` | `#F8FAFB` | Secondary panels and hover backgrounds |
| `color.border` | `#E2E7EA` | Card borders, dividers, input outlines |
| `color.text` | `#252A2D` | Main headings and KPI values |
| `color.text-secondary` | `#667176` | Labels, timestamps, helper text |
| `color.text-muted` | `#879197` | Axis labels and low-emphasis metadata |
| `color.primary` | `#4BA8CC` | Primary chart series, selected controls |
| `color.primary-dark` | `#286F8D` | Secondary chart series and line charts |
| `color.teal` | `#5CB5A4` | Resource bars and positive metrics |
| `color.blue-light` | `#8BC8DE` | Supporting chart series |
| `color.lavender` | `#A8A4E8` | Planned-budget series and donut segments |
| `color.purple` | `#7774D6` | Highlighted cost categories / chart segments |
| `color.purple-light` | `#D8D5F5` | Light chart fills |
| `color.success` | `#2F8A68` | Good/healthy state |
| `color.warning` | `#C58B2B` | Warning status |
| `color.danger` | `#C65353` | Critical alerts |
| `color.grid` | `#E8ECEF` | Chart gridlines |

### Color rules
- Keep the interface mostly white and neutral; reserve saturated colors for data and state.
- Use no more than 3–5 series colors in a single chart.
- Do not communicate status by color alone; pair colors with text or icons.
- Use red only for critical incidents, not ordinary variance.
- Keep chart labels and axes lower contrast than the data series but still readable.

## 3. Typography

Use **Inter** as the preferred UI font. If unavailable, use `Arial`, then system sans-serif.

```css
font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif;
```

| Element | Size | Weight | Line height | Notes |
|---|---:|---:|---:|---|
| App title | 24 px | 650–700 | 1.25 | Header, left aligned |
| Page/section title | 16–18 px | 600–650 | 1.35 | Clear but not oversized |
| Card title | 14–15 px | 600 | 1.35 | KPI labels and chart titles |
| KPI value | 23–28 px | 650–700 | 1.15 | Most prominent item in KPI cards |
| Body text | 13–14 px | 400 | 1.5 | Tables, descriptions |
| Chart labels | 11–12 px | 400–500 | 1.3 | Axis and legend labels |
| Metadata | 11–12 px | 400 | 1.4 | Timestamps and helper labels |
| Small status badge | 11–12 px | 600 | 1 | Short labels, never long sentences |

### Typography rules
- Use sentence case for headings and labels.
- Use tabular numerals for KPI values and financial amounts where possible.
- Avoid using bold weight on every label; use weight and contrast to establish hierarchy.
- Keep labels short and consistent: e.g. “Schedule variance”, “Cost variance”, “Budget used”.

## 4. Layout and Grid

### App frame
- Full-window desktop dashboard.
- Outer page padding: **16 px**.
- Header height: **76–84 px**.
- Header has a subtle bottom border/shadow and white background.
- Main content begins directly under the header.
- Main page scrolls vertically if the viewport is too short; avoid shrinking cards until text becomes cramped.

### Main dashboard grid
Use a **12-column responsive grid** with a 16 px gutter.

Suggested desktop arrangement, inspired by the reference:
- **Left region: 4 columns** — project filters, compact KPI cards, budget variance chart.
- **Center region: 4 columns** — schedule/cost KPIs, budget utilization card, cost breakdown donut + category table.
- **Right region: 4 columns** — workload stacked bars and planned-vs-actual resources chart.

At wide desktop widths, the grid can be visually arranged as three zones:
1. **Left zone (about 37%)**
2. **Center zone (about 29%)**
3. **Right zone (about 34%)**

Do not hard-code this exact ratio if it causes poor responsiveness. Prefer CSS Grid with `minmax()` and sensible minimum widths.

### Example CSS grid

```css
.dashboard-grid {
  display: grid;
  grid-template-columns: minmax(300px, 1.1fr) minmax(300px, 0.95fr) minmax(360px, 1.15fr);
  gap: 16px;
  align-items: stretch;
}

.dashboard-column {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

@media (max-width: 1200px) {
  .dashboard-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 760px) {
  .dashboard-grid {
    grid-template-columns: minmax(0, 1fr);
  }
}
```

## 5. Header

- White surface with a subtle bottom border.
- Left: product/page title, e.g. **Construction Project Monitoring Dashboard**.
- Right: “Data refreshed at …” timestamp, refresh button, and overflow menu.
- Header title: 24 px, semibold/bold.
- Timestamp: 13–14 px, muted grey.
- Action buttons: 40 × 40 px target, transparent/white background, border or divider, rounded 8 px.
- Use accessible tooltips and clear `aria-label` values for icon-only buttons.
- On narrower widths, allow the timestamp to wrap or move below the title instead of overlapping actions.

## 6. KPI and Filter Cards

### Card shell
- White background.
- Border: `1px solid #E2E7EA`.
- Radius: **8–12 px**.
- Shadow: very subtle, such as `0 2px 8px rgba(31, 45, 51, 0.06)`.
- Inner padding: **16 px** (compact KPI cards may use 12–16 px).
- Keep card heights consistent within the same row.

### KPI card structure
1. Short label above.
2. Large value below.
3. Optional trend or context line.
4. Optional status icon only if it adds meaning.

Suggested dashboard metrics:
- Project completion rate
- Schedule variance
- Schedule performance index
- Cost variance
- Cost performance index
- Budget utilized
- Amount spent / total budget
- Utilized duration
- Estimate at completion
- Manpower utilization

**Metric integrity:** ensure metric names, units, and formulas are consistent. For example, schedule variance and cost variance need explicit currency/time context, and a utilization value over 100% should be flagged or explained rather than silently presented as normal.

### Filter cards
- Labels above select controls.
- Control height: 40–44 px.
- White background with a 1 px border.
- Radius: 6–8 px.
- Focus ring: visible, using primary blue with adequate contrast.
- Filters should visibly indicate active selections and provide a clear “All projects” option.

## 7. Chart Cards

Every chart belongs in a white card with:
- Chart title aligned top-left.
- 16 px padding.
- Consistent title-to-plot spacing.
- Minimal horizontal gridlines.
- Axis text in secondary grey.
- Legend positioned consistently, typically bottom or top depending on chart type.
- Enough height to keep values and labels from colliding.
- Tooltips with units, project name, and the full value.
- Empty, loading, and error states.

### A. Workload — Top 5 Projects
- Horizontal stacked bar chart.
- Each project occupies one row.
- Use blue shades for “Completed”, “Remaining”, and “Overdue”.
- Keep the legend visible and labels short.
- Use consistent project ordering and a clear definition of workload units.

### B. Budget Variance — Top 5 Projects
- Line chart comparing “Actual budget” and “Planned budget”.
- Use a light blue line for one series and lavender for the other.
- Use point markers to make individual values easy to inspect.
- Display abbreviated currency values, such as `$638K`, with full amounts in tooltips.
- Avoid smooth curves if they distort the underlying values; prefer straight lines unless smoothing is intentional.

### C. Cost Breakdown
- Donut chart with a hole of approximately 55–65%.
- Use 4–5 related but distinguishable purple/lavender tones.
- Place percentage labels outside the donut with leader lines when legible.
- Include a category/value table beneath or beside the donut.
- Ensure displayed percentages sum to approximately 100% and totals match the data.

### D. Actual vs. Planned Resources — Top 5 Projects
- Combo chart: teal columns for planned resources and a dark blue line for actual resources.
- Include a legend and readable values.
- Use a shared axis only if both series use the same unit.
- If the line represents a different unit, use a secondary axis and label it explicitly.

## 8. Spacing and Sizing Tokens

Use an 8 px base spacing system.

| Token | Value |
|---|---:|
| `space.1` | 4 px |
| `space.2` | 8 px |
| `space.3` | 12 px |
| `space.4` | 16 px |
| `space.5` | 20 px |
| `space.6` | 24 px |
| `space.8` | 32 px |
| `space.10` | 40 px |

Recommended:
- Grid/card gap: 12–16 px.
- Card padding: 16 px.
- Header horizontal padding: 24–32 px.
- Between card title and chart: 16–20 px.
- Between KPI label and value: 8 px.
- Avoid inconsistent one-off spacing values without a reason.

## 9. Borders, Radius, and Elevation

- Card border: `1px solid #E2E7EA`.
- Standard card radius: 10 px.
- Input radius: 7 px.
- Button radius: 8 px.
- Outer application frame radius: optional 18–24 px if the window/frame styling supports it.
- Standard shadow: `0 2px 8px rgba(31, 45, 51, 0.06)`.
- Hover shadow: `0 4px 12px rgba(31, 45, 51, 0.09)`.
- Do not use strong shadows on every element; rely primarily on spacing and borders.

## 10. Interaction and Accessibility

- Minimum interactive target: approximately 40 × 40 px for desktop controls.
- Visible keyboard focus states.
- Every icon-only button needs an accessible name/tooltip.
- Charts should have a text summary or accessible data alternative where feasible.
- Status badges must include text (e.g. “Critical”, “Warning”, “Healthy”), not color alone.
- Inputs and select menus require visible labels.
- Respect reduced-motion preferences.
- Refresh should show loading feedback and a refreshed timestamp.
- If data is simulated, label it “Simulated data” so users do not mistake it for real IoT telemetry.

## 11. Responsive Behavior

- **Wide desktop (≥ 1440 px):** three dashboard zones, dense overview.
- **Medium desktop (1000–1439 px):** two-column grid; charts can span both columns when needed.
- **Narrow window (< 760 px):** single column; filters and cards stack vertically.
- Prevent horizontal page overflow.
- Chart containers should use `width: 100%` and resize with their cards.
- Keep KPI cards readable rather than compressing text.

## 12. Suggested CSS Tokens

```css
:root {
  --color-canvas: #F3F5F6;
  --color-surface: #FFFFFF;
  --color-surface-subtle: #F8FAFB;
  --color-border: #E2E7EA;
  --color-text: #252A2D;
  --color-text-secondary: #667176;
  --color-text-muted: #879197;
  --color-primary: #4BA8CC;
  --color-primary-dark: #286F8D;
  --color-teal: #5CB5A4;
  --color-blue-light: #8BC8DE;
  --color-lavender: #A8A4E8;
  --color-purple: #7774D6;
  --color-purple-light: #D8D5F5;
  --color-success: #2F8A68;
  --color-warning: #C58B2B;
  --color-danger: #C65353;
  --color-grid: #E8ECEF;

  --font-ui: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif;

  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-8: 32px;

  --radius-card: 10px;
  --radius-input: 7px;
  --radius-button: 8px;

  --shadow-card: 0 2px 8px rgba(31, 45, 51, 0.06);
}
```

## 13. Implementation Notes for Electron + React

- Implement the dashboard UI in React; Electron provides the desktop window and operating-system integration.
- Keep data access and business logic in the backend services; do not query PostgreSQL directly from the renderer.
- Use the existing safe preload API (`contextBridge`) for approved Electron IPC operations.
- Validate incoming API payloads with Zod on the backend; frontend validation improves usability but is not a security boundary.
- Use a charting library such as Recharts or Chart.js; keep chart colors and typography aligned with these tokens.
- Build reusable components: `AppHeader`, `FilterCard`, `KpiCard`, `ChartCard`, `StatusBadge`, and `EmptyState`.
- Separate data formatting utilities for currency, percentages, dates, and abbreviated values.
- Provide loading, empty, and error states for each chart or metric.
- Do not hard-code dashboard metrics into the UI for production; use clearly marked seed/simulated data during development.

## 14. Definition of Done

- [ ] The layout resembles the reference's light, three-zone analytics composition.
- [ ] All cards share consistent radius, padding, borders, and typography.
- [ ] KPI values are visually prominent and correctly formatted.
- [ ] Charts include labels, units, legends, and readable tooltips.
- [ ] The layout adapts to window resizing without overlap.
- [ ] Keyboard focus and accessible labels are implemented.
- [ ] Loading, error, and empty states are covered.
- [ ] Simulated values are clearly distinguished from real telemetry.
- [ ] Color and spacing are tokenized rather than scattered throughout CSS.
