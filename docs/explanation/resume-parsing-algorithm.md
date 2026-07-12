# Understanding the Resume Parsing Algorithm

Building a highly accurate resume parser that runs entirely in the browser is challenging because resumes lack a standardized semantic structure. A PDF is fundamentally just a visual canvas; to a computer, it is a collection of strings scattered across X/Y coordinates, with no concept of "this is a header" or "these lines belong together."

This document explains the heuristic algorithm we developed to solve this problem in `src/app/lib/parse-resume-from-pdf`.

## Phase 1: Spatial Grouping (Text Items to Lines)

`pdfjs-dist` returns text items with `(x, y)` coordinates.

The first challenge is that a single visual line of text (e.g., "Software Engineer") might be returned as two separate items ("Software " and "Engineer") if they have slightly different kerning or formatting.

The `groupTextItemsIntoLines` function sorts all items by their Y-coordinate. If two items have a Y-coordinate difference of less than `1.25` (a small threshold to account for rounding errors), they are grouped into the same `Line`. They are then sorted by their X-coordinate (left to right) and joined together.

## Phase 2: Feature Extraction and Scoring

Once we have a sequence of ordered `Lines`, we need to determine which lines belong to which section (Experience, Education, Skills, etc.).

We use a scoring system based on common resume conventions.

1. **Section Headers:** Resumes typically use distinct headings (e.g., "WORK EXPERIENCE", "EDUCATION"). The `feature-scoring-system.ts` defines keyword dictionaries for these common headers.
2. **Identifying Blocks:** When a line contains a section keyword (e.g., "EXPERIENCE"), the parser flags it. All subsequent lines are assigned to the "Experience" bucket until a new section header is detected.

## Phase 3: Sub-section Division

Knowing a group of lines belongs to "Experience" is not enough; we need to split it into discrete job entries. This is handled by `getSubsections`.

Resumes differentiate job entries using visual cues, typically:

- **Bold Text:** Job titles or company names are often bold.
- **Dates:** Each entry usually has a date range (e.g., "Jan 2020 - Present").

The parser scans the "Experience" bucket line by line. If it detects a line that contains bold text AND a date pattern (using regular expressions), it assumes this is the start of a new sub-section. It splits the array of lines at this index.

## Phase 4: Field Extraction

Finally, the individual extractors (like `extractWorkExperience`) process the sub-sections.

- The first bold line is usually the **Company**.
- The second bold line (or the text next to the company) is usually the **Title**.
- Date regexes extract the **Date**.
- Any lines starting with common bullet characters (`•`, `-`) or simply following the header block are aggregated into the **Descriptions** array.

### Limitations

Because this is a heuristic, pattern-matching algorithm, highly unconventional resume layouts (e.g., heavy graphics, multi-column layouts without clear dividers, missing dates) may parse incorrectly. We continuously refine the keyword dictionaries and regex patterns based on edge cases.
