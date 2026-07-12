# ADR 0001: Use `@react-pdf/renderer` for Document Generation

**Date**: 2026-07-12
**Status**: Accepted

## Context

The core value proposition of the Serverless Resume Builder is generating high-quality, ATS-friendly PDF resumes directly in the browser.
We needed a reliable way to convert user input into a PDF without relying on a backend server (like Puppeteer/Node.js).

Options considered:

1. **`window.print()`**: Rendering standard HTML and asking the user to "Print to PDF".
   - _Pros_: Easy to build.
   - _Cons_: Highly inconsistent across browsers. Margins, colors, and fonts break easily. Unprofessional user experience.
2. **HTML-to-Canvas (`html2canvas` + `jsPDF`)**: Drawing HTML to a canvas, taking a snapshot, and placing it in a PDF.
   - _Pros_: Visually consistent.
   - _Cons_: Text is not selectable (ATS systems cannot parse images). Blurry on high-DPI screens.
3. **`@react-pdf/renderer`**: A custom React reconciler that renders specific primitive components into a PDF document.

## Decision

We chose to use **`@react-pdf/renderer`**.

## Consequences

**Positive:**

- 100% client-side generation, fulfilling our privacy requirements.
- Pixel-perfect, consistent rendering across all browsers.
- Real text in the PDF (crucial for ATS parsers).
- Reusable React component architecture for creating new templates.

**Negative:**

- We cannot use standard HTML/CSS or Tailwind classes inside the PDF document. We must use a separate styling system.
- The library relies on `pdfkit`, which adds significant weight to the JavaScript bundle. We must dynamically load the PDF preview to prevent blocking the initial page load.
