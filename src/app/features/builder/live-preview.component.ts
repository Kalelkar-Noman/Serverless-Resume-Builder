import { Component, OnInit, inject, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResumeStateService } from '../../core/services/resume-state.service';
import { Observable } from 'rxjs';
import { ResumeData } from '../../core/models/resume.model';
import { BaseUniversalComponent } from '../templates/base-universal.component';
import { ModernTemplateComponent } from '../templates/modern-template.component';
import { TerminalTemplateComponent } from '../templates/terminal-template.component';
import { MinimalistTemplateComponent } from '../templates/minimalist-template.component';
import { PdfExportService } from '../../core/services/pdf-export.service';

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
      <div
        class="h-full overflow-y-auto overflow-x-hidden py-4 custom-scrollbar flex flex-col items-center"
      >
        @if (resumeData$ | async; as data) {
          <div
            id="resume-document"
            class="transition-transform duration-300 flex-shrink-0"
            [style.transform]="scale !== 1 ? 'scale(' + scale + ')' : 'none'"
            [style.transform-origin]="'top center'"
            [style.margin-bottom.px]="
              scale !== 1 ? (data.design?.documentSize === 'letter' ? 1056 : 1122) * (scale - 1) : 0
            "
            [style.width]="data.design?.documentSize === 'letter' ? '215.9mm' : '210mm'"
            [style.min-height]="data.design?.documentSize === 'letter' ? '279.4mm' : '297mm'"
            [style.--doc-width]="data.design?.documentSize === 'letter' ? '215.9mm' : '210mm'"
            [style.--doc-height]="data.design?.documentSize === 'letter' ? '279.4mm' : '297mm'"
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

      <button
        (click)="downloadPdf()"
        class="absolute bottom-4 right-4 bg-brand-accent hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full shadow-lg flex items-center transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-accent"
      >
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
export class LivePreviewComponent implements OnInit {
  private resumeStateService = inject(ResumeStateService);
  private pdfExportService = inject(PdfExportService);

  resumeData$!: Observable<ResumeData>;
  scale = 1;

  @HostListener('window:resize')
  onResize() {
    if (typeof window !== 'undefined') {
      if (window.innerWidth <= 1024) {
        // Standard A4 width in pixels is ~794px. We subtract 32px for padding.
        this.scale = (window.innerWidth - 32) / 794;
      } else {
        this.scale = 1;
      }
    }
  }

  ngOnInit(): void {
    this.resumeData$ = this.resumeStateService.resumeData$;
    this.onResize();
  }

  downloadPdf(): void {
    const data = this.resumeStateService.getCurrentResumeData();
    this.pdfExportService
      .downloadPdf(data.design)
      .catch((error) => console.error('PDF download failed:', error));
  }

  getPaddingForMargins(margins: string | undefined): string {
    // If it's a full-bleed template (like modern), the outer padding might be handled differently,
    // but we can set the default CSS variable for them to use internally if they wish.

    // Optional: we could use templateId here to force 0 padding for specific templates
    // if (templateId === 'modern') return '0';

    if (margins === 'none') return '0';
    if (margins === 'narrow') return '1.5rem';
    return '3rem'; // standard
  }
}
