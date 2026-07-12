# How to Add a New Resume Template

This guide explains how to create and integrate a new resume template layout using `@react-pdf/renderer` in the Serverless Resume Builder.

## 1. Create the Template Component

Templates are located in `src/app/components/Resume/ResumePDF/`.
The application uses `@react-pdf/renderer` to generate PDFs, so your template must use their specific components (`Document`, `Page`, `View`, `Text`, etc.) instead of standard HTML tags.

Create a new file for your template, for example: `src/app/components/Resume/ResumePDF/ResumePDFModern.tsx`.

```tsx
import { Page, View, Document } from '@react-pdf/renderer';
import { ResumePDFProfile } from './ResumePDFProfile';
import { ResumePDFWorkExperience } from './ResumePDFWorkExperience';
import { ResumePDFEducation } from './ResumePDFEducation';
import { ResumePDFProject } from './ResumePDFProject';
import { ResumePDFSkills } from './ResumePDFSkills';
import { ResumePDFCustom } from './ResumePDFCustom';
import { styles } from './styles';
import type { Resume, Settings } from 'lib/redux/types';

export const ResumePDFModern = ({
  resume,
  settings,
  isPDF = false,
}: {
  resume: Resume;
  settings: Settings;
  isPDF?: boolean;
}) => {
  const { profile, workExperiences, educations, projects, skills, custom } = resume;

  return (
    <Document title={`${profile.name} Resume`} author={profile.name}>
      <Page size={settings.documentSize as any} style={{ ...styles.page, padding: '30pt' }}>
        {/* Profile Section */}
        <ResumePDFProfile profile={profile} themeColor={settings.themeColor} isPDF={isPDF} />

        {/* Custom Layout: Two Columns */}
        <View style={{ flexDirection: 'row', marginTop: 15 }}>
          <View style={{ width: '60%', paddingRight: 10 }}>
            {/* Main Content */}
            <ResumePDFWorkExperience
              heading={settings.formToHeading.workExperiences}
              workExperiences={workExperiences}
              themeColor={settings.themeColor}
            />
            <ResumePDFProject
              heading={settings.formToHeading.projects}
              projects={projects}
              themeColor={settings.themeColor}
            />
          </View>
          <View style={{ width: '40%', paddingLeft: 10, borderLeft: '1pt solid #eee' }}>
            {/* Sidebar Content */}
            <ResumePDFSkills
              heading={settings.formToHeading.skills}
              skills={skills}
              themeColor={settings.themeColor}
            />
            <ResumePDFEducation
              heading={settings.formToHeading.educations}
              educations={educations}
              themeColor={settings.themeColor}
            />
          </View>
        </View>
      </Page>
    </Document>
  );
};
```

## 2. Register the Template

Once you've created your template, you need to make the application aware of it.

1. **Update Settings Type:** If you are adding a new `templateId`, update the `Settings` interface in `src/app/lib/redux/settingsSlice.ts` to include your new template ID (e.g., `'modern'`).
2. **Update the Main PDF Entrypoint:** Open `src/app/components/Resume/ResumePDF/index.tsx`.
3. Import your new template and add it to the rendering logic based on `settings.templateId`.

```tsx
// src/app/components/Resume/ResumePDF/index.tsx
import { ResumePDFBase } from './ResumePDFBase';
import { ResumePDFModern } from './ResumePDFModern'; // Your new template

export const ResumePDF = ({ resume, settings, isPDF }: Props) => {
  // Render different templates based on user selection
  if (settings.templateId === 'modern') {
    return <ResumePDFModern resume={resume} settings={settings} isPDF={isPDF} />;
  }

  // Default fallback
  return <ResumePDFBase resume={resume} settings={settings} isPDF={isPDF} />;
};
```

## 3. Add to the Template Selector UI

Finally, add your new template to the UI so users can select it. This is typically found in the `ThemeForm` (e.g., `src/app/components/ResumeForm/ThemeForm/index.tsx`).

Add your new template option to the template selection component, ensuring it dispatches the `changeTemplate` Redux action with your new `templateId`.

## Best Practices

- **Reuse Existing Sub-components:** Whenever possible, reuse existing section components (like `ResumePDFProfile`, `ResumePDFEducation`) as they already handle the `isPDF` flag and theme color mapping.
- **Styling limitations:** `@react-pdf/renderer` has limited CSS support. Avoid complex flexbox wrapping or grid layouts, and rely primarily on basic flexbox (`flexDirection`, `justifyContent`, `alignItems`) and explicit widths.
