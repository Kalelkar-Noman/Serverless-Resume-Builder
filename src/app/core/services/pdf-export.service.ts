import { Injectable } from '@angular/core';
import { ResumeDesign } from '../models/resume.model';

/**
 * Canonical pixel widths for document sizes at 96 DPI.
 * Must match the constants in live-preview.component.ts.
 */
const DOC_SIZES = {
  a4: { width: 794, height: 1123 },
  letter: { width: 816, height: 1056 },
} as const;

@Injectable({
  providedIn: 'root',
})
export class PdfExportService {
  /** Tracks whether a PDF generation is in progress */
  isGenerating = false;

  public async downloadPdf(design?: ResumeDesign): Promise<void> {
    const element = document.getElementById('resume-document');
    if (!element) return;

    this.isGenerating = true;

    const isLetter = design?.documentSize === 'letter';
    const pageSize = isLetter ? 'letter' : 'A4';
    const docWidth = isLetter ? DOC_SIZES.letter.width : DOC_SIZES.a4.width;

    // Determine if this is a full-bleed (edge-to-edge) template
    const isFullBleed = element.querySelector('.full-bleed-template') !== null;

    // Determine page margins for @page rule
    let pageMargin = isFullBleed ? '0' : '15mm';
    if (!isFullBleed && design?.margins) {
      if (design.margins === 'narrow') pageMargin = '8mm';
      if (design.margins === 'none') pageMargin = '0';
    }

    // Detect dark background templates (terminal, etc.)
    const bgColor = this.detectBackgroundColor(element, design);

    // --- Snapshot and override the live preview's transform ---
    const origTransform = element.style.transform;
    const origTransformOrigin = element.style.transformOrigin;
    const origWidth = element.style.width;
    const origMinHeight = element.style.minHeight;
    const origMarginBottom = element.style.marginBottom;
    const origBoxShadow = element.style.boxShadow;

    // Reset to canonical size — no scaling for print
    element.style.transform = 'none';
    element.style.transformOrigin = 'top left';
    element.style.width = docWidth + 'px';
    element.style.minHeight = 'auto';
    element.style.marginBottom = '0';
    element.style.boxShadow = 'none';

    // Let the DOM reflow at the canonical width
    await new Promise((r) => setTimeout(r, 100));

    try {
      // Collect all stylesheets from the current document
      const styleContent = this.collectStyles();

      // Open a new window for printing
      const printWindow = window.open('', '_blank', 'width=900,height=700');
      if (!printWindow) {
        throw new Error('Could not open print window. Check popup blocker settings.');
      }

      const printDoc = printWindow.document;
      printDoc.open();
      printDoc.write(`<!DOCTYPE html>
<html>
<head>
  <title>Resume</title>
  ${styleContent}
  <style>
    @page {
      size: ${pageSize} portrait;
      margin: ${pageMargin};
    }
    *, *::before, *::after {
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
      color-adjust: exact !important;
    }
    html, body {
      margin: 0;
      padding: 0;
      background: ${bgColor};
      width: 100%;
    }
    body {
      display: flex;
      justify-content: center;
    }
    #resume-document {
      transform: none !important;
      box-shadow: none !important;
      margin: 0 !important;
      width: ${docWidth}px;
    }
    .resume-template {
      width: 100% !important;
      min-height: auto !important;
      box-shadow: none !important;
      margin: 0 !important;
    }
    /* Hide any non-resume UI elements that might be in the clone */
    .page-break-indicator { display: none !important; }
  </style>
</head>
<body>
  ${element.outerHTML}
</body>
</html>`);
      printDoc.close();

      // Wait for fonts and styles to load in the print window
      await this.waitForPrintReady(printWindow);

      // Trigger the print dialog
      printWindow.focus();
      printWindow.print();

      // Close the print window after a delay to allow printing to complete
      setTimeout(() => {
        printWindow.close();
      }, 1000);
    } finally {
      // --- Restore the live preview's original styles ---
      element.style.transform = origTransform;
      element.style.transformOrigin = origTransformOrigin;
      element.style.width = origWidth;
      element.style.minHeight = origMinHeight;
      element.style.marginBottom = origMarginBottom;
      element.style.boxShadow = origBoxShadow;

      this.isGenerating = false;
    }
  }

  /**
   * Detect the correct background color for the print window.
   * Check the design settings first, then fall back to computed styles.
   */
  private detectBackgroundColor(element: HTMLElement, design?: ResumeDesign): string {
    if (design?.background) {
      return design.background;
    }
    const template = element.querySelector('.resume-template') as HTMLElement;
    if (template) {
      const computed = getComputedStyle(template).backgroundColor;
      if (computed && computed !== 'rgba(0, 0, 0, 0)' && computed !== 'transparent') {
        return computed;
      }
    }
    return 'white';
  }

  /**
   * Collect all stylesheets from the current document.
   * Returns a string of <style> and <link> tags.
   */
  private collectStyles(): string {
    const parts: string[] = [];

    // Collect all <style> tags
    document.querySelectorAll('style').forEach((style) => {
      parts.push(`<style>${style.textContent || ''}</style>`);
    });

    // Collect all <link rel="stylesheet"> tags
    document.querySelectorAll('link[rel="stylesheet"]').forEach((link) => {
      parts.push(link.outerHTML);
    });

    return parts.join('\n');
  }

  /**
   * Wait for the print window to be ready:
   * 1. Wait for document.fonts.ready (all fonts loaded)
   * 2. Additional safety delay for style application
   */
  private async waitForPrintReady(printWindow: Window): Promise<void> {
    // Wait for fonts to load
    try {
      if (printWindow.document.fonts) {
        await Promise.race([
          printWindow.document.fonts.ready,
          new Promise((r) => setTimeout(r, 3000)), // 3s max wait
        ]);
      }
    } catch {
      // Fallback if fonts API isn't available
    }

    // Additional delay for CSS to fully compute
    await new Promise((r) => setTimeout(r, 500));
  }
}
