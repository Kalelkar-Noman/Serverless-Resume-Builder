# Redux State Schema Reference

The Serverless Resume Builder uses Redux Toolkit to manage the global application state. The state is divided into two primary slices: `resume` (the actual content of the user's resume) and `settings` (UI preferences, template choices, and layout configuration).

Both slices are automatically persisted to the browser's `localStorage` to ensure users don't lose data on page refresh.

---

## 1. `resume` Slice

**File:** `src/app/lib/redux/resumeSlice.ts`
**Types:** `src/app/lib/redux/types.ts`

The `resume` slice holds the structured data that populates the PDF.

```typescript
export interface Resume {
  profile: ResumeProfile;
  workExperiences: ResumeWorkExperience[];
  educations: ResumeEducation[];
  projects: ResumeProject[];
  skills: ResumeSkills;
  custom: ResumeCustom;
  customSections?: Record<string, ResumeCustom>;
}
```

### Key Data Structures

#### Profile

```typescript
export interface ResumeProfile {
  name: string;
  email: string;
  phone: string;
  url: string;
  customLinks?: string[]; // (Optional) Additional portfolio URLs or social media
  summary: string;
  location: string;
}
```

#### Arrays (Work, Education, Projects)

These sections are arrays of objects, allowing users to add multiple entries.

```typescript
export interface ResumeWorkExperience {
  company: string;
  jobTitle: string;
  date: string;
  descriptions: string[]; // Bullet points
}
```

#### Skills

Skills are divided into two parts: a list of `featuredSkills` (with ratings) and a general block of `descriptions`.

```typescript
export interface FeaturedSkill {
  skill: string;
  rating: number; // 0 to 5
}

export interface ResumeSkills {
  featuredSkills: FeaturedSkill[];
  descriptions: string[];
}
```

---

## 2. `settings` Slice

**File:** `src/app/lib/redux/settingsSlice.ts`

The `settings` slice controls _how_ the resume data is rendered, including typography, layout order, and section visibility.

```typescript
export interface Settings {
  templateId: 'base' | 'tech';
  themeColor: string; // The primary accent color (e.g., "#38bdf8")

  // Design tokens for extensive theming capabilities
  design: {
    highlight: string;
    text: string;
    background: string;
    surface: string;
  };

  fontFamily: string;
  fontSize: string;
  documentSize: string; // "A4" or "Letter"

  // Configuration maps keyed by section ID
  formToShow: Record<string, boolean>; // Toggles section visibility in PDF
  formToHeading: Record<string, string>; // Maps section ID to display title (e.g., "WORK EXPERIENCE")
  formsOrder: string[]; // Ordered array dictating rendering sequence
  showBulletPoints: Record<string, boolean>; // Toggles bullet points per section
}
```

### Note on Dynamic Sections

When a user adds a new dynamic Custom Section, an entry is dynamically appended to `formToShow`, `formToHeading`, `showBulletPoints`, and `formsOrder` using a unique ID (e.g., `custom-xxxx`).
