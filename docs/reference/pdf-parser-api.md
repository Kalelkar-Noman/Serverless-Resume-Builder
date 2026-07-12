# ATS Parser API Reference

This document serves as a technical reference for the internal APIs used by the PDF parsing engine (located in `src/app/lib/parse-resume-from-pdf/`).

---

## 1. Top-Level API

### `parseResumeFromPdf(fileUrl: string): Promise<Resume>`

The main entry point for the parser.

- **`fileUrl`**: A URL pointing to the PDF file (typically generated via `URL.createObjectURL(file)` when a user uploads a file).
- **Returns**: A Promise that resolves to a complete, populated `Resume` object conforming to the Redux state schema.

This function orchestrates three sub-processes:

1. `readPdf(fileUrl)`: Extracts raw text items.
2. `groupTextItemsIntoLines(textItems)`: Converts items to lines based on Y-coordinates.
3. `groupLinesIntoSections(lines)`: Classifies lines into resume sections.
4. `extractResumeFromSections(sections)`: Maps raw strings to structured Redux state objects.

---

## 2. Core Internal Types (`types.ts`)

### `TextItem`

Represents a single parsed chunk of text from the PDF.

- **`text: string`**: The raw text string.
- **`x: number`**: X-coordinate on the page.
- **`y: number`**: Y-coordinate on the page.
- **`fontName: string`**: The internal font ID (useful for detecting bold/italic headings).
- **`hasSpace: boolean`**: Whether a space character follows this chunk.

### `TextItem[]` -> `Line`

A `Line` is an array of `TextItem` objects that fall on the same horizontal plane (Y-coordinate).

### `ResumeSectionToLines`

A map linking the categorized section type to the lines that belong to it.

```typescript
export type ResumeSectionToLines = {
  profile: TextItem[][];
  workExperiences: TextItem[][];
  educations: TextItem[][];
  projects: TextItem[][];
  skills: TextItem[][];
  custom: TextItem[][];
};
```

---

## 3. Sub-section Utilities (`extract-resume-from-sections/lib/`)

These utilities are heavily utilized inside individual extractors (e.g., `extract-work-experience.ts`) to make sense of the unstructured strings.

### `getSectionLinesByKeywords(sections, keywords)`

Retrieves all lines from a specific section categorized by the given keywords.

### `getSubsections(lines, featureSet)`

A critical utility that further divides a large section (like Work Experience) into individual distinct items (like Job 1, Job 2). It relies on identifying header patterns (e.g., bold text, dates).

### `getBulletPointsFromLines(lines)`

Parses an array of text lines into string bullet points, stripping out standard bullet characters (`•`, `*`, `-`).
