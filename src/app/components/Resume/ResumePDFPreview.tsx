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
      <div className="flex h-full w-full justify-center md:block md:h-auto md:w-auto">
        <div
          style={{
            width: `${width * scale}px`,
            height: `${height * scale}px`,
          }}
          className="relative hidden bg-white shadow-lg md:block"
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

        {/* Mobile View PDF Button */}
        <div className="flex w-full flex-col items-center justify-center px-4 py-16 md:hidden">
          <p className="mb-4 text-center text-sm text-gray-500">
            Live preview is optimized for desktop. On mobile, please open the PDF directly.
          </p>
          <a
            href={pdfUrl || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary w-full max-w-xs text-center"
            style={{ opacity: pdfUrl ? 1 : 0.5, pointerEvents: pdfUrl ? 'auto' : 'none' }}
          >
            {pdfUrl ? 'View Resume PDF' : 'Generating PDF...'}
          </a>
        </div>
      </div>
    );
  }
);
ResumePDFPreview.displayName = 'ResumePDFPreview';
