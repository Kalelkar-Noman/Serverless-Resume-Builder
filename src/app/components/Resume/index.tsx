'use client';
import { useState, useMemo } from 'react';
import { ResumePDFPreview } from 'components/Resume/ResumePDFPreview';
import { ResumePDF } from 'components/Resume/ResumePDF';
import { ResumeControlBarCSR, ResumeControlBarBorder } from 'components/Resume/ResumeControlBar';
import { FlexboxSpacer } from 'components/FlexboxSpacer';
import { useAppSelector } from 'lib/redux/hooks';
import { selectResume } from 'lib/redux/resumeSlice';
import { selectSettings } from 'lib/redux/settingsSlice';
import { useDebounce } from 'lib/hooks/useDebounce';
import {
  useRegisterReactPDFFont,
  useRegisterReactPDFHyphenationCallback,
} from 'components/fonts/hooks';

export const Resume = () => {
  const [scale, setScale] = useState(0.8);
  const resume = useAppSelector(selectResume);
  const settings = useAppSelector(selectSettings);

  const debouncedResume = useDebounce(resume, 500);
  const debouncedSettings = useDebounce(settings, 500);

  const document = useMemo(
    () => <ResumePDF resume={debouncedResume} settings={debouncedSettings} isPDF={true} />,
    [debouncedResume, debouncedSettings]
  );

  useRegisterReactPDFFont();
  useRegisterReactPDFHyphenationCallback(settings.fontFamily);

  return (
    <>
      <div className="relative flex justify-center md:justify-start">
        <FlexboxSpacer maxWidth={50} className="hidden md:block" />
        <div className="relative flex h-full w-full flex-col">
          <ResumeControlBarCSR
            scale={scale}
            setScale={setScale}
            documentSize={settings.documentSize}
            document={document}
            fileName={resume.profile.name + ' - Resume'}
          />
          <ResumeControlBarBorder />
          <section className="h-[calc(100vh-var(--top-nav-bar-height)-var(--resume-control-bar-height))] overflow-hidden md:p-[var(--resume-padding)]">
            <ResumePDFPreview
              documentSize={settings.documentSize}
              scale={scale}
              document={document}
            />
          </section>
        </div>
      </div>
    </>
  );
};
