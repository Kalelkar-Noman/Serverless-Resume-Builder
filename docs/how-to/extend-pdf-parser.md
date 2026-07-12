# How to Extend the PDF Parser

The Serverless Resume Builder includes a client-side PDF parsing engine (ATS) that extracts text from uploaded PDF resumes and automatically populates the resume builder form.

This guide explains how to extend the parser to recognize new resume sections or improve its accuracy.

## Understanding the Parsing Pipeline

The parsing process is located in `src/app/lib/parse-resume-from-pdf/` and follows these steps:

1. **Read PDF**: Uses `pdfjs-dist` to extract raw text items and their coordinates.
2. **Group into Lines**: Groups text items that fall on the same Y-axis into logical text lines.
3. **Group into Sections**: Groups lines into major resume sections (Profile, Experience, Education, Skills, Projects) using a scoring algorithm.
4. **Extract Section Data**: Parses specific data structures (like job titles, dates, descriptions) from the grouped sections.

## Adding a New Section Extractor

If you want the parser to recognize a new section type (e.g., "Certifications"):

### 1. Update the Data Models

First, ensure your Redux state can handle the new section data. Update `Resume` in `src/app/lib/redux/types.ts` and the initial state in `resumeSlice.ts`.

### 2. Update Feature Scoring System

The parser identifies sections by scoring lines based on common keywords. Open `src/app/lib/parse-resume-from-pdf/extract-resume-from-sections/lib/feature-scoring-system.ts`.

Add keywords for your new section:

```typescript
export const SECTION_KEYWORDS = {
  // ... existing sections
  certifications: ['certification', 'certificate', 'licenses', 'credential'],
};
```

Update the `SectionFeatureSet` type and scoring logic to accommodate the new section.

### 3. Create an Extractor Function

Create a new file in `extract-resume-from-sections/` (e.g., `extract-certifications.ts`).

Implement an extractor function that takes the `ResumeSectionToLines` map and extracts your specific data.

```typescript
import type { ResumeSectionToLines } from '../types';
import type { ResumeCertification } from '../../redux/types'; // Assuming you created this
import { getSectionLinesByKeywords } from './lib/get-section-lines';

export const extractCertifications = (sections: ResumeSectionToLines): ResumeCertification[] => {
  const certLines = getSectionLinesByKeywords(sections, ['certifications']);

  if (certLines.length === 0) return [];

  // Implement logic to parse lines into your ResumeCertification objects.
  // Use existing utilities from `./lib/subsections.ts` or `./lib/bullet-points.ts`
  // if your section has a standard structure (Header -> Date -> Bullet points).

  return [];
};
```

### 4. Wire It Up

Open `src/app/lib/parse-resume-from-pdf/extract-resume-from-sections/index.ts`.

Import your new extractor and add it to the main `extractResumeFromSections` function:

```typescript
import { extractCertifications } from './extract-certifications';

export const extractResumeFromSections = (sections: ResumeSectionToLines): Resume => {
  return {
    profile: extractProfile(sections),
    workExperiences: extractWorkExperience(sections),
    educations: extractEducation(sections),
    skills: extractSkills(sections),
    projects: extractProject(sections),
    certifications: extractCertifications(sections), // Your new extractor
    custom: { descriptions: [] }, // Default
  };
};
```

## Testing Your Changes

We have a suite of tests for the ATS parser.

1. Run tests with `npm run test` (assuming you have configured Jest).
2. Use the provided `test-ats.mjs` script at the root to test specific PDFs against your new logic.
