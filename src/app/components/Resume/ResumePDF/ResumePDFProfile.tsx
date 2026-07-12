import { View } from '@react-pdf/renderer';
import { ResumePDFIcon, type IconType } from 'components/Resume/ResumePDF/common/ResumePDFIcon';
import { styles, spacing } from 'components/Resume/ResumePDF/styles';
import { ResumePDFLink, ResumePDFSection, ResumePDFText } from 'components/Resume/ResumePDF/common';
import type { ResumeProfile } from 'lib/redux/types';

export const ResumePDFProfile = ({
  profile,
  themeColor,
  isPDF,
}: {
  profile: ResumeProfile;
  themeColor: string;
  isPDF: boolean;
}) => {
  const { name, email, phone, url, summary, location } = profile;
  const iconProps = { email, phone, location, url };

  return (
    <ResumePDFSection style={{ marginTop: spacing['4'] }}>
      <ResumePDFText bold={true} themeColor={themeColor} style={{ fontSize: '20pt' }}>
        {name}
      </ResumePDFText>
      {summary ? <ResumePDFText>{summary}</ResumePDFText> : null}
      <View
        style={{
          ...styles.flexRowBetween,
          flexWrap: 'wrap',
          marginTop: spacing['0.5'],
        }}
      >
        {Object.entries(iconProps).map(([key, value]) => {
          if (!value) return null;

          let iconType = key as IconType;
          if (key === 'url') {
            if (value.includes('github')) {
              iconType = 'url_github';
            } else if (value.includes('linkedin')) {
              iconType = 'url_linkedin';
            }
          }

          const shouldUseLinkWrapper = ['email', 'url', 'phone'].includes(key);
          const Wrapper = ({ children }: { children: React.ReactNode }) => {
            if (!shouldUseLinkWrapper) return <>{children}</>;

            let src = '';
            switch (key) {
              case 'email': {
                src = `mailto:${value}`;
                break;
              }
              case 'phone': {
                src = `tel:${value.replace(/[^\d+]/g, '')}`; // Keep only + and digits
                break;
              }
              default: {
                src = value.startsWith('http') ? value : `https://${value}`;
              }
            }

            return (
              <ResumePDFLink src={src} isPDF={isPDF}>
                {children}
              </ResumePDFLink>
            );
          };

          return (
            <View
              key={key}
              style={{
                ...styles.flexRow,
                alignItems: 'center',
                gap: spacing['1'],
              }}
            >
              <ResumePDFIcon type={iconType} isPDF={isPDF} />
              <Wrapper>
                <ResumePDFText>{value}</ResumePDFText>
              </Wrapper>
            </View>
          );
        })}

        {/* Map through custom links (e.g. GitHub, GitLab) */}
        {profile.customLinks?.map((customLink, idx) => {
          if (!customLink) return null;

          let iconType: IconType = 'url';
          const lowerLink = customLink.toLowerCase();
          if (lowerLink.includes('github')) {
            iconType = 'url_github';
          } else if (lowerLink.includes('linkedin')) {
            iconType = 'url_linkedin';
          } else if (lowerLink.includes('gitlab')) {
            // Re-using the standard URL icon for GitLab if a specific one doesn't exist yet
            iconType = 'url';
          }

          const src = customLink.startsWith('http') ? customLink : `https://${customLink}`;

          return (
            <View
              key={`customLink-${idx}`}
              style={{
                ...styles.flexRow,
                alignItems: 'center',
                gap: spacing['1'],
                marginTop: spacing['0.5'],
              }}
            >
              <ResumePDFIcon type={iconType} isPDF={isPDF} />
              <ResumePDFLink src={src} isPDF={isPDF}>
                <ResumePDFText>{customLink}</ResumePDFText>
              </ResumePDFLink>
            </View>
          );
        })}
      </View>
    </ResumePDFSection>
  );
};
