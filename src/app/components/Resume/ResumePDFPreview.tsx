'use client';
import { useState, useEffect } from 'react';
import { pdf } from '@react-pdf/renderer';
import { A4_WIDTH_PX, A4_HEIGHT_PX, LETTER_WIDTH_PX, LETTER_HEIGHT_PX } from 'lib/constants';

import { memo } from 'react';

/**
 * ResumePDFPreview component renders the generated PDF document in an iframe.
 * It is wrapped in React.memo to prevent unnecessary re-renders when the parent
 * component updates due to Redux state changes (like fast keystrokes).
 */
export const ResumePDFPreview = memo(
  ({
    document,
    scale,
    documentSize,
  }: {
    document: React.ReactElement;
    scale: number;
    documentSize: string;
  }) => {
    const [pdfUrl, setPdfUrl] = useState<string | null>(null);

    useEffect(() => {
      let isMounted = true;

      const generatePDF = async () => {
        try {
          const blob = await pdf(document).toBlob();
          if (isMounted) {
            const url = URL.createObjectURL(blob);
            setPdfUrl(url);
          }
        } catch (err) {
          console.error('Failed to render PDF', err);
        }
      };

      generatePDF();

      return () => {
        isMounted = false;
      };
    }, [document]);

    const isA4 = documentSize === 'A4';
    const width = isA4 ? A4_WIDTH_PX : LETTER_WIDTH_PX;
    const height = isA4 ? A4_HEIGHT_PX : LETTER_HEIGHT_PX;

    return (
      <div
        style={{
          width: `${width * scale}px`,
          height: `${height * scale}px`,
        }}
        className="relative bg-white shadow-lg"
      >
        {pdfUrl ? (
          <iframe
            src={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=0`}
            width="100%"
            height="100%"
            className="border-none"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gray-50 text-gray-400">
            Loading Preview...
          </div>
        )}
      </div>
    );
  }
);
ResumePDFPreview.displayName = 'ResumePDFPreview';
