# ADR 0003: Client-Side Only Architecture

**Date**: 2026-07-12
**Status**: Accepted

## Context

Resume builders inherently deal with highly sensitive Personally Identifiable Information (PII), including phone numbers, physical addresses, and employment histories.

Most commercial resume builders require users to create an account, storing their resume data on a backend database. This creates a friction point for user adoption and introduces significant security and privacy liabilities.

## Decision

We decided to adopt a **Strictly Client-Side Only** architecture.

- **No Databases**: The application has no backend database (e.g., PostgreSQL, MongoDB).
- **No API Routes for Data Processing**: Next.js API routes are only used for static/build-time data (if at all), never for receiving or processing user PII.
- **Local Storage Persistence**: User data is saved exclusively to the browser's `localStorage` via Redux middleware.

## Consequences

**Positive:**

- **Absolute Privacy**: We can mathematically guarantee to users that their data never leaves their machine.
- **Zero Hosting Costs**: The application can be hosted entirely on a CDN (Vercel Edge, Netlify) as static assets.
- **High Performance**: No network latency when updating the resume preview or adding new sections.

**Negative:**

- **Cross-device syncing is impossible**: A user cannot start a resume on their phone and finish it on their laptop without manually exporting and importing the JSON file.
- **Storage Limits**: `localStorage` has a strict ~5MB limit, though this is vastly more than enough for a text-based resume.
