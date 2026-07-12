'use client';
import { getHasUsedAppBefore } from 'lib/redux/local-storage';
import { ResumeDropzone } from 'components/ResumeDropzone';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function ImportResume() {
  const [hasUsedAppBefore, setHasUsedAppBefore] = useState(false);
  const [hasAddedResume, setHasAddedResume] = useState(false);
  const onFileUrlChange = (fileUrl: string) => {
    setHasAddedResume(Boolean(fileUrl));
  };

  useEffect(() => {
    setHasUsedAppBefore(getHasUsedAppBefore());
  }, []);

  return (
    <main>
      <div className="mx-auto mt-14 max-w-3xl rounded-md border border-gray-200 px-10 py-10 text-center shadow-md">
        {!hasUsedAppBefore ? (
          <>
            <h1 className="text-lg font-semibold text-gray-900">
              Import data from an existing resume
            </h1>
            <ResumeDropzone onFileUrlChange={onFileUrlChange} className="mt-5" />
            {!hasAddedResume && (
              <>
                <OrDivider />
                <SectionWithHeadingAndCreateButton
                  heading="Don't have a resume yet?"
                  buttonText="Create from scratch"
                />
              </>
            )}
          </>
        ) : (
          <>
            {!hasAddedResume && (
              <>
                <SectionWithHeadingAndCreateButton
                  heading="You have data saved in browser from prior session"
                  buttonText="Continue where I left off"
                />
                <div className="mt-4">
                  <Link
                    href="/resume-builder"
                    onClick={() => {
                      // Clear local storage logic if needed, but going to builder directly
                      // usually keeps old data. If they want to start from scratch,
                      // we should clear local storage first.
                      localStorage.removeItem('serverless-resume-builder-state');
                    }}
                    className="text-sm font-semibold text-gray-500 underline hover:text-gray-700"
                  >
                    Or start from scratch (will clear data)
                  </Link>
                </div>
                <OrDivider />
              </>
            )}
            <h1 className="font-semibold text-gray-900">Override data with a new resume</h1>
            <ResumeDropzone onFileUrlChange={onFileUrlChange} className="mt-5" />
          </>
        )}
      </div>
    </main>
  );
}

const OrDivider = () => (
  <div className="mx-[-2.5rem] flex items-center pb-6 pt-8" aria-hidden="true">
    <div className="flex-grow border-t border-gray-200" />
    <span className="mx-2 mt-[-2px] flex-shrink text-lg text-gray-400">or</span>
    <div className="flex-grow border-t border-gray-200" />
  </div>
);

const SectionWithHeadingAndCreateButton = ({
  heading,
  buttonText,
}: {
  heading: string;
  buttonText: string;
}) => {
  return (
    <>
      <p className="font-semibold text-gray-900">{heading}</p>
      <div className="mt-5">
        <Link
          href="/resume-builder"
          className="outline-theme-blue rounded-full bg-sky-500 px-6 pb-2 pt-1.5 text-base font-semibold text-white"
        >
          {buttonText}
        </Link>
      </div>
    </>
  );
};
