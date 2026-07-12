# How to Add Custom Sections

The Serverless Resume Builder supports adding dynamic custom sections (e.g., "Awards", "Languages", "Publications"). These sections are flexible and user-defined.

This guide explains how the custom section architecture works and how to interact with it programmatically.

## Redux State for Custom Sections

Custom sections are stored in the `resumeSlice` under `customSections` (a dictionary keyed by a unique ID).

```typescript
// src/app/lib/redux/types.ts
export interface Resume {
  // ... core sections
  custom: ResumeCustom; // The default single custom section (legacy)
  customSections?: Record<string, ResumeCustom>; // Dynamic custom sections
}
```

## Adding a Custom Section via UI

The user initiates the creation of a custom section through the Builder UI (`src/app/components/ResumeForm/CustomForm.tsx`).

When a user adds a new section:

1. A unique ID is generated.
2. Two Redux actions are dispatched simultaneously:
   - `addDynamicCustomSection({ id })`: Initializes the data structure in `resumeSlice`.
   - `addCustomSection({ id })`: Configures the visibility and ordering in `settingsSlice`.

## Modifying Custom Section Data Programmatically

If you are building an automation (like parsing a PDF that has a "Certifications" block that you want to map to a Custom Section), you can dispatch the necessary actions.

```typescript
import { store } from 'lib/redux/store';
import { addDynamicCustomSection, changeCustom } from 'lib/redux/resumeSlice';
import { addCustomSection, changeFormHeading } from 'lib/redux/settingsSlice';

const createCertificationsSection = () => {
  const customId = 'custom-certifications'; // Or generate a UUID

  // 1. Register it in Settings (so it appears in UI/PDF)
  store.dispatch(addCustomSection({ id: customId }));
  store.dispatch(changeFormHeading({ field: customId, value: 'CERTIFICATIONS' }));

  // 2. Initialize the data structure
  store.dispatch(addDynamicCustomSection({ id: customId }));

  // 3. Populate data
  store.dispatch(
    changeCustom({
      id: customId,
      field: 'descriptions',
      value: ['AWS Certified Solutions Architect', 'Google Cloud Professional Cloud Architect'],
    })
  );
};
```

## Rendering Custom Sections in PDF

In the PDF template (e.g., `ResumePDFBase`), the dynamic custom sections are iterated over based on the `formsOrder` array from `settingsSlice`.

```tsx
// Inside a page component
{
  settings.formsOrder.map((form) => {
    if (form === 'custom' || form.startsWith('custom-')) {
      // If it's the legacy 'custom', use it. Otherwise pull from customSections map.
      const customData = form === 'custom' ? resume.custom : resume.customSections?.[form];

      if (!customData) return null;

      return (
        <ResumePDFCustom
          key={form}
          heading={settings.formToHeading[form]}
          custom={customData}
          themeColor={settings.themeColor}
        />
      );
    }
    // ... handle other forms
  });
}
```

If you are building a _new_ PDF template layout, ensure you include logic to iterate over dynamically generated `customSections` so user-added data is actually rendered.
