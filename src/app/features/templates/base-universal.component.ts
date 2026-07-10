import { Component, Input, OnInit, inject } from '@angular/core';

import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ResumeData, ResumeSection } from '../../core/models/resume.model';

@Component({
  selector: 'app-base-universal',
  standalone: true,
  imports: [],
  template: `
    @if (data) {
      <div
        [style.--theme-text]="data.design?.text || '#1F2937'"
        [style.--theme-bg]="data.design?.background || '#FFFFFF'"
        [style.--theme-highlight]="data.design?.highlight || '#4F46E5'"
        [style.--theme-surface]="data.design?.surface || '#EEF2FF'"
        [style.padding]="'var(--doc-padding, 1.5rem)'"
        [class]="
          'mx-auto shadow-lg print:shadow-none print:max-w-none print:w-full print:p-0 resume-template ' +
          (data.design?.font || 'font-sans')
        "
      >
        <header class="text-center mb-6">
          <h1 class="text-4xl font-bold" style="color: var(--theme-text);">
            {{ data.personalInfo.name }}
          </h1>
          <p class="text-xl mb-2" style="color: var(--theme-highlight);">
            {{ data.personalInfo.title }}
          </p>
          <div
            class="flex flex-wrap justify-center gap-x-4 gap-y-1 text-sm"
            style="color: var(--theme-text); opacity: 0.8;"
          >
            <span>{{ data.personalInfo.email }}</span>
            @if (data.personalInfo.phone) {
              <span>| {{ data.personalInfo.phone }}</span>
            }
            @if (data.personalInfo.location) {
              <span>| {{ data.personalInfo.location }}</span>
            }
            @for (link of data.personalInfo.customLinks; track link) {
              @if (link.url && link.label) {
                <a
                  [href]="link.url"
                  target="_blank"
                  style="color: var(--theme-highlight);"
                  class="hover:underline"
                  >| {{ link.label }}</a
                >
              }
            }
          </div>
        </header>
        @if (data.summary) {
          <section class="mb-6 border-b pb-4">
            <h2 class="section-title">Summary</h2>
            <div class="prose max-w-none" [innerHTML]="sanitizedSummary"></div>
          </section>
        }
        @for (section of data.sections; track section) {
          <section class="mb-6 border-b pb-4 last:border-b-0 last:pb-0">
            <h2 class="section-title">{{ section.title }}</h2>
            @switch (section.type) {
              @case ('timeline') {
                <div class="space-y-4">
                  @for (item of section.items; track item) {
                    <div class="mb-4">
                      <div class="flex flex-col sm:flex-row sm:justify-between sm:items-baseline">
                        <h3 class="font-semibold text-lg" style="color: var(--theme-text);">
                          {{ item.headline }}
                        </h3>
                        <div
                          class="text-sm font-medium mt-1 sm:mt-0"
                          style="color: var(--theme-text); opacity: 0.7;"
                        >
                          {{ item.date }}
                        </div>
                      </div>
                      @if (item.subheading) {
                        <p class="font-medium mb-1" style="color: var(--theme-highlight);">
                          {{ item.subheading }}
                        </p>
                      }
                      @if (item.description) {
                        <div
                          class="text-sm mt-2 prose max-w-none"
                          style="color: var(--theme-text); opacity: 0.9;"
                          [innerHTML]="sanitizeHtml(item.description)"
                        ></div>
                      }
                    </div>
                  }
                </div>
              }
              @case ('skills-grid') {
                <div class="flex flex-wrap gap-2 mt-2">
                  @for (skill of section.skillTags; track skill) {
                    <span class="badge">
                      {{ skill.name }}
                      @if (skill.level) {
                        <span class="ml-1 text-xs italic" style="opacity: 0.7;"
                          >({{ skill.level }})</span
                        >
                      }
                    </span>
                  }
                </div>
              }
              @case ('custom-rich-text') {
                <div class="prose max-w-none mt-2" [innerHTML]="sanitizeHtmlContent(section)"></div>
              }
            }
          </section>
        }
      </div>
    }
  `,
  styles: [
    `
      .resume-template {
        width: 100%;
        min-height: 100%;
        background-color: var(--theme-bg);
        color: var(--theme-text);
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
        color-adjust: exact !important;
      }
      .section-title {
        @apply text-xl font-bold mb-3 border-b-2 pb-1;
        border-color: var(--theme-highlight);
        color: var(--theme-text);
      }
      .badge {
        @apply text-xs font-medium px-2.5 py-0.5 rounded-full;
        background-color: var(--theme-surface);
        color: var(--theme-highlight);
      }
      :host ::ng-deep .prose {
        white-space: pre-wrap;
        word-wrap: break-word;
        overflow-wrap: break-word;
      }
      :host ::ng-deep .prose p {
        margin-bottom: 0.5em;
      }
      :host ::ng-deep .prose img,
      :host ::ng-deep .prose svg,
      :host ::ng-deep .prose video {
        max-width: 100%;
        height: auto;
      }
      :host ::ng-deep .prose svg {
        display: inline-block !important;
        vertical-align: middle !important;
        max-height: 2em !important;
        max-width: 2em !important;
        width: auto !important;
        height: auto !important;
      }
      :host ::ng-deep .prose ul,
      :host ::ng-deep .prose ol {
        list-style-position: inside;
        margin-left: 1em;
        margin-bottom: 0.5em;
      }
      :host ::ng-deep .prose h1,
      :host ::ng-deep .prose h2,
      :host ::ng-deep .prose h3,
      :host ::ng-deep .prose h4 {
        font-weight: bold;
        margin-top: 1em;
        margin-bottom: 0.5em;
      }
      :host ::ng-deep .prose h1 {
        font-size: 1.5em;
      }
      :host ::ng-deep .prose h2 {
        font-size: 1.3em;
      }
      :host ::ng-deep .prose h3 {
        font-size: 1.1em;
      }
      :host ::ng-deep .prose strong {
        font-weight: bold;
      }
      :host ::ng-deep .prose em {
        font-style: italic;
      }
      :host ::ng-deep .prose a {
        color: var(--theme-highlight);
        text-decoration: underline;
      }
      :host ::ng-deep .prose pre {
        background-color: #e5e7eb;
        padding: 0.5em;
        border-radius: 0.25rem;
        overflow-x: auto;
      }
      :host ::ng-deep .prose code {
        font-family: monospace;
        background-color: #e5e7eb;
        padding: 0.1em 0.3em;
        border-radius: 0.25rem;
      }
      :host ::ng-deep .prose table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 1em;
        margin-bottom: 1em;
      }
      :host ::ng-deep .prose th,
      :host ::ng-deep .prose td {
        border: 1px solid #d1d5db;
        padding: 0.5em;
        text-align: left;
      }
      :host ::ng-deep .prose th {
        background-color: #f3f4f6;
        font-weight: bold;
      }
    `,
  ],
})
export class BaseUniversalComponent implements OnInit {
  @Input() data!: ResumeData;

  private sanitizer = inject(DomSanitizer);
  sanitizedSummary!: SafeHtml;

  ngOnInit(): void {
    if (this.data?.summary) {
      const formatted = this.data.summary.replace(/&nbsp;/g, ' ').replace(/\u00A0/g, ' ');
      this.sanitizedSummary = this.sanitizer.bypassSecurityTrustHtml(formatted);
    }
  }

  sanitizeHtmlContent(section: ResumeSection): SafeHtml | null {
    return this.sanitizeHtml(section.customHtmlContent);
  }

  sanitizeHtml(content?: string): SafeHtml | null {
    if (content) {
      const formatted = content.replace(/&nbsp;/g, ' ').replace(/\u00A0/g, ' ');
      return this.sanitizer.bypassSecurityTrustHtml(formatted);
    }
    return null;
  }
}
