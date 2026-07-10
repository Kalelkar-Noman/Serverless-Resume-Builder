import {
  Component,
  OnInit,
  OnDestroy,
  inject,
  ElementRef,
  AfterViewInit,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResumeStateService } from '../../core/services/resume-state.service';
import { Observable } from 'rxjs';
import { ResumeData } from '../../core/models/resume.model';
import { BaseUniversalComponent } from '../templates/base-universal.component';
import { ModernTemplateComponent } from '../templates/modern-template.component';
import { TerminalTemplateComponent } from '../templates/terminal-template.component';
import { MinimalistTemplateComponent } from '../templates/minimalist-template.component';
import { PdfExportService } from '../../core/services/pdf-export.service';

/**
 * Canonical pixel widths for document sizes at 96 DPI.
 * These are the ONLY source of truth for document dimensions.
 * - A4:     210mm × 297mm → 794px × 1123px
 * - Letter: 8.5in × 11in → 816px × 1056px
 */
const DOC_SIZES = {
  a4: { width: 794, height: 1123 },
  letter: { width: 816, height: 1056 },
} as const;

@Component({
  selector: 'app-live-preview',
  standalone: true,
  imports: [
    CommonModule,
    BaseUniversalComponent,
    ModernTemplateComponent,
    TerminalTemplateComponent,
    MinimalistTemplateComponent,
  ],
  template: `
    <div class="h-full relative bg-gray-50/50">
      <!-- Scrollable preview area -->
      <div
        #previewContainer
        class="h-full overflow-y-auto overflow-x-hidden py-4 custom-scrollbar flex flex-col items-center"
      >
        @if (resumeData$ | async; as data) {
          <div
            id="resume-document"
            class="flex-shrink-0 bg-white shadow-xl"
            [style.width.px]="getDocWidth(data.design?.documentSize)"
            [style.min-height.px]="getDocHeight(data.design?.documentSize)"
            [style.transform]="'scale(' + scale + ')'"
            [style.transform-origin]="'top center'"
            [style.margin-bottom.px]="getMarginBottom(data.design?.documentSize)"
            [style.--doc-padding]="getPaddingForMargins(data.design?.margins)"
          >
            @switch (data.templateId) {
              @case ('modern') {
                <app-modern-template [data]="data"></app-modern-template>
              }
              @case ('terminal') {
                <app-terminal-template [data]="data"></app-terminal-template>
              }
              @case ('minimalist') {
                <app-minimalist-template [data]="data"></app-minimalist-template>
              }
              @default {
                <app-base-universal [data]="data"></app-base-universal>
              }
            }
          </div>
        }
      </div>

      <!-- Download button -->
      <button
        (click)="downloadPdf()"
        [disabled]="isGenerating"
        class="absolute bottom-4 right-4 bg-brand-accent hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full shadow-lg flex items-center transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-accent disabled:opacity-60 disabled:cursor-not-allowed"
      >
        @if (isGenerating) {
          <svg
            class="animate-spin h-5 w-5 mr-2"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            ></circle>
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            ></path>
          </svg>
          Generating...
        } @else {
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5 mr-2"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
              clip-rule="evenodd"
            />
          </svg>
          Download PDF
        }
      </button>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        height: 100%;
      }
      .custom-scrollbar::-webkit-scrollbar {
        width: 8px;
      }
      .custom-scrollbar::-webkit-scrollbar-track {
        background: #f1f1f1;
      }
      .custom-scrollbar::-webkit-scrollbar-thumb {
        background: #888;
        border-radius: 4px;
      }
      .custom-scrollbar::-webkit-scrollbar-thumb:hover {
        background: #555;
      }
    `,
  ],
})
export class LivePreviewComponent implements OnInit, AfterViewInit, OnDestroy {
  private resumeStateService = inject(ResumeStateService);
  private pdfExportService = inject(PdfExportService);
  private elRef = inject(ElementRef);
  private cdr = inject(ChangeDetectorRef);

  resumeData$!: Observable<ResumeData>;
  scale = 1;
  isGenerating = false;

  private resizeObserver: ResizeObserver | null = null;
  private containerEl: HTMLElement | null = null;

  ngOnInit(): void {
    this.resumeData$ = this.resumeStateService.resumeData$;
  }

  ngAfterViewInit(): void {
    // Get the actual scrollable container element
    this.containerEl = this.elRef.nativeElement.querySelector('.custom-scrollbar');
    if (!this.containerEl || typeof ResizeObserver === 'undefined') {
      // Fallback for SSR or environments without ResizeObserver
      this.updateScale();
      return;
    }

    this.resizeObserver = new ResizeObserver(() => {
      this.updateScale();
    });
    this.resizeObserver.observe(this.containerEl);

    // Initial scale calculation
    this.updateScale();
  }

  ngOnDestroy(): void {
    this.resizeObserver?.disconnect();
  }

  /**
   * Calculate the correct scale factor based on the container's actual width.
   * The document is always rendered at its canonical pixel width (794px for A4).
   * We scale it down to fit the container, but never scale up beyond 1.0.
   */
  private updateScale(): void {
    if (!this.containerEl) return;

    const containerWidth = this.containerEl.clientWidth;
    const padding = 32; // 16px padding on each side
    const availableWidth = containerWidth - padding;

    // Get the current document size from state
    const data = this.resumeStateService.getCurrentResumeData();
    const docWidth = this.getDocWidth(data.design?.documentSize);

    // Scale down to fit, but never scale up
    const newScale = Math.min(1, availableWidth / docWidth);
    if (Math.abs(newScale - this.scale) > 0.001) {
      this.scale = newScale;
      this.cdr.detectChanges();
    }
  }

  /** Get the canonical pixel width for the selected document size */
  getDocWidth(size?: string): number {
    return size === 'letter' ? DOC_SIZES.letter.width : DOC_SIZES.a4.width;
  }

  /** Get the canonical pixel height for the selected document size */
  getDocHeight(size?: string): number {
    return size === 'letter' ? DOC_SIZES.letter.height : DOC_SIZES.a4.height;
  }

  /**
   * When the document is scaled down, it visually shrinks but still occupies
   * its full pixel height in the layout flow. We add negative margin-bottom
   * to compensate, so the scrollbar reflects the visual size.
   */
  getMarginBottom(size?: string): number {
    if (this.scale >= 1) return 0;
    const docHeight = this.getDocHeight(size);
    return docHeight * (this.scale - 1);
  }

  getPaddingForMargins(margins: string | undefined): string {
    if (margins === 'none') return '0';
    if (margins === 'narrow') return '1.5rem';
    return '3rem'; // standard
  }

  async downloadPdf(): Promise<void> {
    if (this.isGenerating) return;
    this.isGenerating = true;
    this.cdr.detectChanges();
    try {
      const data = this.resumeStateService.getCurrentResumeData();
      await this.pdfExportService.downloadPdf(data.design);
    } catch (error) {
      console.error('PDF download failed:', error);
    } finally {
      this.isGenerating = false;
      this.cdr.detectChanges();
    }
  }
}
