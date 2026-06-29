import { Injectable } from '@angular/core';
import { ResumeDesign } from '../models/resume.model';

@Injectable({
  providedIn: 'root',
})
export class PdfExportService {
  public async downloadPdf(design?: ResumeDesign): Promise<void> {
    const element = document.getElementById('resume-document');
    if (!element) return Promise.resolve();

    const isFullBleed = element.querySelector('.full-bleed-template') !== null;
    const isTerminal = element.querySelector('.bg-gray-900') !== null;

    // Determine margins based on user settings, default to 15mm (or 0 for full-bleed)
    let pageMargin = isFullBleed ? '0' : '15mm';
    if (!isFullBleed && design?.margins) {
      if (design.margins === 'narrow') pageMargin = '8mm';
      if (design.margins === 'none') pageMargin = '0';
    }

    // Determine document size based on user settings
    const pageSize = design?.documentSize === 'letter' ? 'letter' : 'A4';

    const bodyBg = isTerminal ? '#111827' : 'white';

    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    document.body.appendChild(iframe);

    // Copy all styles to ensure Tailwind works
    const styles = Array.from(document.querySelectorAll('style, link[rel="stylesheet"]'))
      .map((node) => node.outerHTML)
      .join('');

    const iframeDoc = iframe.contentWindow?.document;
    if (iframeDoc) {
      iframeDoc.open();
      iframeDoc.write(`
        <html>
          <head>
            <title>Resume</title>
            ${styles}
            <style>
              @page { margin: ${pageMargin}; size: ${pageSize} portrait; }
              * {
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
                color-adjust: exact !important;
              }
              body { background: ${bodyBg}; margin: 0; padding: 0; }
              /* Remove shadow and constraints for printing */
              .resume-template { 
                box-shadow: none !important; 
                max-width: none !important; 
                width: 100% !important; 
              }
            </style>
          </head>
          <body>
            ${element.outerHTML}
          </body>
        </html>
      `);
      iframeDoc.close();

      iframe.contentWindow?.focus();
      // Wait for any fonts/styles to apply
      setTimeout(() => {
        iframe.contentWindow?.print();
        setTimeout(() => document.body.removeChild(iframe), 1000);
      }, 1500);
    }

    return Promise.resolve();
  }
}
