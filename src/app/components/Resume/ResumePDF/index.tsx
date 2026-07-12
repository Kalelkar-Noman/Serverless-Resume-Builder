import { Page, View, Document } from '@react-pdf/renderer';
import { styles, spacing } from 'components/Resume/ResumePDF/styles';
import { ResumePDFProfile } from 'components/Resume/ResumePDF/ResumePDFProfile';
import { ResumePDFWorkExperience } from 'components/Resume/ResumePDF/ResumePDFWorkExperience';
import { ResumePDFEducation } from 'components/Resume/ResumePDF/ResumePDFEducation';
import { ResumePDFProject } from 'components/Resume/ResumePDF/ResumePDFProject';
import { ResumePDFSkills } from 'components/Resume/ResumePDF/ResumePDFSkills';
import { ResumePDFCustom } from 'components/Resume/ResumePDF/ResumePDFCustom';
import { DEFAULT_FONT_COLOR } from 'lib/redux/settingsSlice';
import type { Settings, ShowForm } from 'lib/redux/settingsSlice';
import type { Resume } from 'lib/redux/types';
import { SuppressResumePDFErrorMessage } from 'components/Resume/ResumePDF/common/SuppressResumePDFErrorMessage';

/**
 * Note: ResumePDF is supposed to be rendered inside PDFViewer. However,
 * PDFViewer is rendered too slow and has noticeable delay as you enter
 * the resume form, so we render it without PDFViewer to make it render
 * instantly. There are 2 drawbacks with this approach:
 * 1. Not everything works out of box if not rendered inside PDFViewer,
 *    e.g. svg doesn't work, so it takes in a isPDF flag that maps react
 *    pdf element to the correct dom element.
 * 2. It throws a lot of errors in console log, e.g. "<VIEW /> is using incorrect
 *    casing. Use PascalCase for React components, or lowercase for HTML elements."
 *    in development, causing a lot of noises. We can possibly workaround this by
 *    mapping every react pdf element to a dom element, but for now, we simply
 *    suppress these messages in <SuppressResumePDFErrorMessage />.
 *    https://github.com/diegomura/react-pdf/issues/239#issuecomment-487255027
 */
export const ResumePDF = ({
  resume,
  settings,
  isPDF = false,
}: {
  resume: Resume;
  settings: Settings;
  isPDF?: boolean;
}) => {
  const { profile, workExperiences, educations, projects, skills, custom } = resume;
  const { name } = profile;
  const {
    fontFamily,
    fontSize,
    documentSize,
    formToHeading,
    formToShow,
    formsOrder,
    showBulletPoints,
    templateId,
    design,
  } = settings;

  // Fallback to legacy themeColor if design is undefined
  const highlightColor = design?.highlight || settings.themeColor || DEFAULT_FONT_COLOR;
  const textColor = design?.text || DEFAULT_FONT_COLOR;
  const bgColor = design?.background || '#ffffff';
  const surfaceColor = design?.surface || '#f8fafc';

  const showFormsOrder = formsOrder.filter((form) => formToShow[form]);

  const renderContent = () => (
    <>
      {showFormsOrder.map((form) => {
        if (form === 'workExperiences') {
          return (
            <ResumePDFWorkExperience
              key={form}
              heading={formToHeading[form]}
              workExperiences={workExperiences}
              themeColor={highlightColor}
            />
          );
        }
        if (form === 'educations') {
          return (
            <ResumePDFEducation
              key={form}
              heading={formToHeading[form]}
              educations={educations}
              themeColor={highlightColor}
              showBulletPoints={showBulletPoints[form]}
            />
          );
        }
        if (form === 'projects') {
          return (
            <ResumePDFProject
              key={form}
              heading={formToHeading[form]}
              projects={projects}
              themeColor={highlightColor}
            />
          );
        }
        if (form === 'skills') {
          return (
            <ResumePDFSkills
              key={form}
              heading={formToHeading[form]}
              skills={skills}
              themeColor={highlightColor}
              showBulletPoints={showBulletPoints[form]}
            />
          );
        }
        if (form.startsWith('custom')) {
          const customData =
            form === 'custom' ? custom : resume.customSections?.[form] || { descriptions: [] };

          return (
            <ResumePDFCustom
              key={form}
              heading={formToHeading[form]}
              custom={customData}
              themeColor={highlightColor}
              showBulletPoints={showBulletPoints[form]}
            />
          );
        }
        return null;
      })}
    </>
  );

  const document = (
    <Document title={`${name} Resume`} author={name} producer={'Free Resume Builder'}>
      <Page
        size={documentSize === 'A4' ? 'A4' : 'LETTER'}
        style={{
          ...styles.flexCol,
          color: textColor,
          backgroundColor: bgColor,
          fontFamily,
          fontSize: fontSize + 'pt',
        }}
      >
        {templateId === 'base' && (
          <View style={{ ...styles.flexCol, height: '100%' }}>
            <View
              style={{
                width: spacing['full'],
                height: spacing[3.5],
                backgroundColor: highlightColor,
              }}
            />
            <View style={{ ...styles.flexCol, padding: `${spacing[0]} ${spacing[20]}` }}>
              <ResumePDFProfile profile={profile} themeColor={highlightColor} isPDF={isPDF} />
              {renderContent()}
            </View>
          </View>
        )}

        {templateId === 'tech' && (
          <View
            style={{ ...styles.flexCol, height: '100%', padding: `${spacing[10]} ${spacing[20]}` }}
          >
            <View
              style={{
                borderBottom: `2pt solid ${highlightColor}`,
                paddingBottom: spacing[4],
                marginBottom: spacing[4],
              }}
            >
              <ResumePDFProfile profile={profile} themeColor={highlightColor} isPDF={isPDF} />
            </View>
            {renderContent()}
          </View>
        )}
      </Page>
    </Document>
  );

  if (isPDF) {
    return document;
  }

  return (
    <>
      {document}
      <SuppressResumePDFErrorMessage />
    </>
  );
};
