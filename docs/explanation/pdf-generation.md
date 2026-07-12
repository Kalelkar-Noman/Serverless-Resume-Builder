# Why We Use `@react-pdf/renderer` for PDF Generation

Generating PDFs in a web application is a notoriously difficult problem. When building the Serverless Resume Builder, several approaches were considered:

1. **HTML to PDF via `window.print()`:** Relying on the browser's native print engine.
2. **Server-side Headless Browsers:** Using Puppeteer or Playwright to render HTML and export to PDF on a Node.js server.
3. **Canvas-based rendering:** Drawing the resume to an HTML5 `<canvas>` and converting it to a data URL.
4. **React-PDF (`@react-pdf/renderer`):** A custom React reconciler that renders specific primitive components directly into a PDF document.

## The Choice: `@react-pdf/renderer`

We chose `@react-pdf/renderer` because it perfectly aligns with the core constraint of this project: **Serverless and Privacy-First**.

### Benefits

- **100% Client-Side:** The entire PDF generation process happens in the user's browser via Web Workers. No data is ever sent to a server. This guarantees absolute privacy for users entering sensitive PII (Personally Identifiable Information).
- **Exact Pixel Perfection:** Browser print engines (`window.print()`) are notoriously inconsistent. Safari, Chrome, and Firefox all render margins, page breaks, and fonts slightly differently. `@react-pdf/renderer` produces the exact same PDF binary across all environments.
- **Component Reusability:** Because it uses React, we can structure our PDF layouts using standard React component architecture, passing props and iterating over state just like we do in the DOM.

### Trade-offs

- **No CSS:** `@react-pdf/renderer` does not use HTML or standard CSS. It uses its own primitive components (`<View>`, `<Text>`) and a limited subset of CSS properties written in React's `style={}` object syntax. You cannot use Tailwind CSS classes or external stylesheets inside the PDF document.
- **Bundle Size:** It includes a substantial PDF generation engine (pdfkit) which increases the JavaScript bundle size. We mitigate this using Next.js dynamic imports (`next/dynamic`) to load the PDF preview pane asynchronously only when the builder is accessed.

## How the Live Preview Works

Because `@react-pdf/renderer` outputs a Blob, we cannot render it directly into the DOM like a normal component.

Instead, our `ResumePDFPreview` component:

1. Passes the Redux state to the React-PDF `<Document>`.
2. Triggers the internal PDF generator.
3. Receives a Blob output.
4. Generates a temporary object URL (`URL.createObjectURL(blob)`).
5. Passes that URL into an `<iframe>` src attribute.

This process is highly optimized using memoization (`React.memo`) and debouncing (`useDebounce` on the Redux state) to ensure that the heavy PDF generation only triggers 500ms after the user stops typing, providing a smooth "live" preview experience without freezing the main thread.
