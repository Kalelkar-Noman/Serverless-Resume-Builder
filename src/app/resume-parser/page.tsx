'use client';
import { useState, useEffect } from 'react';
import { readPdf } from 'lib/parse-resume-from-pdf/read-pdf';
import type { TextItems } from 'lib/parse-resume-from-pdf/types';
import { groupTextItemsIntoLines } from 'lib/parse-resume-from-pdf/group-text-items-into-lines';
import { groupLinesIntoSections } from 'lib/parse-resume-from-pdf/group-lines-into-sections';
import { extractResumeFromSections } from 'lib/parse-resume-from-pdf/extract-resume-from-sections';
import { ResumeDropzone } from 'components/ResumeDropzone';
import { cx } from 'lib/cx';
import { Heading, Link, Paragraph } from 'components/documentation';
import { ResumeTable } from 'resume-parser/ResumeTable';
import { FlexboxSpacer } from 'components/FlexboxSpacer';
import { ResumeParserAlgorithmArticle } from 'resume-parser/ResumeParserAlgorithmArticle';

const defaultFileUrl = '';
export default function ResumeParser() {
  const [fileUrl, setFileUrl] = useState(defaultFileUrl);
  const [textItems, setTextItems] = useState<TextItems>([]);
  const lines = groupTextItemsIntoLines(textItems || []);
  const sections = groupLinesIntoSections(lines);
  const resume = extractResumeFromSections(sections);

  useEffect(() => {
    async function test() {
      if (fileUrl) {
        const textItems = await readPdf(fileUrl);
        setTextItems(textItems);
      } else {
        setTextItems([]);
      }
    }
    test();
  }, [fileUrl]);

  return (
    <main className="h-full w-full overflow-hidden">
      <div className="grid md:grid-cols-6">
        <div className="flex justify-center px-2 md:col-span-3 md:h-[calc(100vh-var(--top-nav-bar-height))] md:justify-end">
          <section className="mt-5 grow px-4 md:max-w-[600px] md:px-0">
            <div className="aspect-h-[9.5] aspect-w-7">
              {fileUrl ? (
                <iframe src={`${fileUrl}#navpanes=0`} className="h-full w-full" />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gray-100 text-gray-400">
                  Upload a PDF to see preview
                </div>
              )}
            </div>
          </section>
          <FlexboxSpacer maxWidth={45} className="hidden md:block" />
        </div>
        <div className="flex px-6 text-gray-900 md:col-span-3 md:h-[calc(100vh-var(--top-nav-bar-height))] md:overflow-y-scroll">
          <FlexboxSpacer maxWidth={45} className="hidden md:block" />
          <section className="max-w-[600px] grow">
            <Heading className="!mt-4 text-primary">Resume Parser Playground</Heading>
            <Paragraph smallMarginTop={true}>
              This playground showcases the resume parser and its ability to parse information from
              a resume PDF. Add your resume below to see how well your resume would be parsed by
              similar Application Tracking Systems (ATS) used in job applications.
            </Paragraph>
            <Paragraph>
              The more information it can parse out, the better it indicates the resume is well
              formatted and easy to read. It is beneficial to have the name and email accurately
              parsed at the very least.
            </Paragraph>
            <div className="mt-3">
              <ResumeDropzone
                onFileUrlChange={(fileUrl) => setFileUrl(fileUrl || defaultFileUrl)}
                playgroundView={true}
              />
            </div>
            <Heading level={2} className="!mt-[1.2em]">
              Resume Parsing Results
            </Heading>
            <ResumeTable resume={resume} />
            <ResumeParserAlgorithmArticle textItems={textItems} lines={lines} sections={sections} />
            <div className="pt-24" />
          </section>
        </div>
      </div>
    </main>
  );
}
