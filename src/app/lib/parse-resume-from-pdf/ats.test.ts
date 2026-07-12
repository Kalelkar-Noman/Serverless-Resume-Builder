/**
 * @jest-environment node
 */
import { parseResumeFromPdf } from './index';
import { initialSettings } from 'lib/redux/settingsSlice';
import { initialResumeState } from 'lib/redux/resumeSlice';
import { renderToStream } from '@react-pdf/renderer';
import { ResumePDF } from 'components/Resume/ResumePDF';
import React from 'react';
import fs from 'fs';
import path from 'path';

const dummyResume = {
  ...initialResumeState,
  profile: {
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '123-456-7890',
    location: 'New York, NY',
    url: 'linkedin.com/in/johndoe',
    summary: 'A highly motivated software engineer.',
  },
  workExperiences: [
    {
      company: 'Tech Corp',
      jobTitle: 'Software Engineer',
      date: 'Jan 2020 - Present',
      descriptions: ['Developed awesome features.', 'Fixed bugs.'],
    },
  ],
};

describe('ATS Parser E2E Test', () => {
  it('should successfully parse the base template PDF', async () => {
    // 1. Render the PDF
    const document = React.createElement(ResumePDF, {
      resume: dummyResume,
      settings: { ...initialSettings, fontFamily: 'Helvetica' },
      isPDF: true,
    });

    const stream = await renderToStream(document);
    const pdfPath = path.join(__dirname, 'test-resume.pdf');
    const writeStream = fs.createWriteStream(pdfPath);

    await new Promise((resolve, reject) => {
      stream.pipe(writeStream);
      writeStream.on('finish', resolve);
      writeStream.on('error', reject);
      stream.on('error', reject);
    });

    // 2. Parse the PDF
    // Note: This relies on pdfjs-dist. In Node, we might need a workaround for the worker.
    try {
      const parsedResume = await parseResumeFromPdf(pdfPath);

      // 3. Assertions
      expect(parsedResume.profile.name).toBe(dummyResume.profile.name);
      expect(parsedResume.profile.email).toBe(dummyResume.profile.email);
      expect(parsedResume.profile.phone).toBe(dummyResume.profile.phone);
      expect(parsedResume.profile.location).toBe(dummyResume.profile.location);
      expect(parsedResume.profile.url).toBe(dummyResume.profile.url);
      expect(parsedResume.profile.summary).toBe(dummyResume.profile.summary);

      expect(parsedResume.workExperiences.length).toBe(1);
      expect(parsedResume.workExperiences[0].company).toBe(dummyResume.workExperiences[0].company);
      expect(parsedResume.workExperiences[0].jobTitle).toBe(
        dummyResume.workExperiences[0].jobTitle
      );
      expect(parsedResume.workExperiences[0].date).toBe(dummyResume.workExperiences[0].date);
      expect(parsedResume.workExperiences[0].descriptions[0]).toBe(
        dummyResume.workExperiences[0].descriptions[0]
      );
      // Clean up
      fs.unlinkSync(pdfPath);
    } catch (e) {
      if (fs.existsSync(pdfPath)) fs.unlinkSync(pdfPath);
      throw e;
    }
  });
});
