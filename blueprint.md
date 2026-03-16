# AI News Summary - Blueprint

## Overview
A web application designed to curate and summarize daily Artificial Intelligence news. It features a sidebar for date-based navigation, allowing users to browse historical news easily. The UI is clean, responsive, and fully localized in Korean.

## Technical Stack
- **Frontend:** Vanilla HTML, CSS (Variables, Flexbox/Grid, Sticky positioning), and JavaScript (ES Modules, Web Components, DOM Manipulation).
- **Architecture:** Client-side rendering. Data is mocked and separated into `data.js`.

## Design System & UI/UX
- **Aesthetic:** Modern, clean, and minimalist with a focus on readability and content discovery.
- **Color Palette:**
  - Primary Background: Soft slate gray (`#f8fafc`)
  - Card Background: Pure white (`#ffffff`) with subtle drop shadows.
  - Text Colors: Dark slate (`#0f172a`) for primary, medium slate (`#475569`) for secondary.
  - Accent Color: Modern blue (`#3b82f6`) for active states and links.
- **Typography:** 'Pretendard' for optimal Korean text rendering and a premium feel.
- **Components:**
  - **Sidebar:** Sticky left navigation showing available dates. Highlights the currently selected date.
  - **Main Content:** Displays the news feed dynamically filtered by the selected date.
  - **News Card (Web Component):** Encapsulates title, summary, source, date, and link with hover animations.

## Features
- **Current Version:**
  - Sidebar with date filtering (March 1, 2026 - March 16, 2026).
  - Responsive two-column layout (sidebar stacks on top on mobile screens).
  - Custom `<news-card>` Web Component.
  - Korean language UI and extensive mock data covering daily AI events.