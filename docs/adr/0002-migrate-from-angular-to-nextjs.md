# ADR 0002: Migrate from Angular to Next.js

**Date**: 2026-07-12
**Status**: Accepted

## Context

The project was originally built using Angular. While Angular provided a robust structure, the ecosystem around modern, fast, serverless web applications has shifted heavily towards React and Next.js.

Key drivers for the migration:

1. **Ecosystem & Libraries**: The `@react-pdf/renderer` library is the most mature client-side PDF generation tool available. Integrating it deeply into an Angular application required complex wrappers and defeated the purpose of its declarative React API.
2. **SEO & Routing**: The application aims to attract users organically. Next.js App Router provides superior SEO capabilities and metadata management compared to standard SPAs.
3. **Developer Experience (DX)**: The wider ecosystem of styling tools (Tailwind) and state management (Redux Toolkit) integrates more seamlessly with Next.js in the modern frontend landscape.

## Decision

We decided to completely rewrite the frontend from Angular to **Next.js (App Router)** using React.

## Consequences

**Positive:**

- Native integration with `@react-pdf/renderer`.
- Improved SEO via Server-Side Rendering (SSR) for the landing pages, while keeping the core builder client-side.
- Simpler deployment story on Edge networks (Vercel, Netlify).

**Negative:**

- Loss of historical commit history tied to the specific Angular component structures.
- Requires rewriting existing template layouts from Angular templates to JSX.
