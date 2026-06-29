import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResumeData } from '../../core/models/resume.model';

@Component({
  selector: 'app-modern-template',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      [style.--theme-text]="data.design?.text || '#1F2937'"
      [style.--theme-bg]="data.design?.background || '#FFFFFF'"
      [style.--theme-highlight]="data.design?.highlight || '#4F46E5'"
      [style.--theme-surface]="data.design?.surface || '#EEF2FF'"
      [class]="
        'resume-template full-bleed-template flex shadow-2xl mx-auto overflow-hidden ' +
        (data.design?.font || 'font-sans')
      "
    >
      <!-- LEFT SIDEBAR -->
      <div
        class="w-1/3 modern-sidebar flex flex-col min-w-0"
        [style.padding]="'var(--doc-padding, 2rem)'"
      >
        <!-- Personal Info -->
        <h1 class="text-3xl font-bold uppercase tracking-wider mb-2 break-words">
          {{ data.personalInfo.name }}
        </h1>
        <h2 class="text-xl font-light modern-sidebar-text-muted mb-8 break-words">
          {{ data.personalInfo.title }}
        </h2>

        <div class="space-y-4 mb-10 text-sm">
          <div class="flex flex-col">
            <span class="font-semibold modern-sidebar-text-accent">Email:</span>
            <span class="break-all">{{ data.personalInfo.email }}</span>
          </div>
          <div class="flex flex-col">
            <span class="font-semibold modern-sidebar-text-accent">Phone:</span>
            <span class="break-words">{{ data.personalInfo.phone }}</span>
          </div>
          <div class="flex flex-col">
            <span class="font-semibold modern-sidebar-text-accent">Location:</span>
            <span class="break-words">{{ data.personalInfo.location }}</span>
          </div>
          @for (link of data.personalInfo.customLinks; track link) {
            <div class="flex flex-col">
              <span class="font-semibold modern-sidebar-text-accent">{{ link.label }}</span>
              <a [href]="link.url" class="hover:opacity-80 transition-opacity break-all">{{
                link.url
              }}</a>
            </div>
          }
        </div>

        <!-- Skills Sections (Render only skills-grid in sidebar) -->
        @for (section of data.sections; track section.id) {
          @if (section.type === 'skills-grid') {
            <div class="mb-8">
              <h3
                class="text-lg font-bold uppercase tracking-wider border-b modern-sidebar-title pb-2 mb-4"
              >
                {{ section.title }}
              </h3>
              <div class="flex flex-wrap gap-2">
                @for (skill of section.skillTags; track skill) {
                  <span class="modern-skill-tag px-3 py-1 rounded-full text-sm border shadow-sm">
                    {{ skill.name }}
                  </span>
                }
              </div>
            </div>
          }
        }
      </div>

      <!-- MAIN CONTENT -->
      <div
        class="w-2/3 min-w-0"
        [style.padding]="'var(--doc-padding, 2rem)'"
        style="background-color: var(--theme-bg); color: var(--theme-text);"
      >
        <!-- Summary -->
        @if (data.summary) {
          <div class="mb-10">
            <h3 class="text-2xl font-bold modern-section-title pb-2 mb-4 inline-block">Profile</h3>
            <div
              class="leading-relaxed quill-content break-words"
              style="opacity: 0.8;"
              [innerHTML]="formatHtml(data.summary)"
            ></div>
          </div>
        }

        <!-- Other Sections (Timeline and Custom Content) -->
        @for (section of data.sections; track section.id) {
          @if (section.type === 'timeline') {
            <div class="mb-10">
              <h3 class="text-2xl font-bold modern-section-title pb-2 mb-6 inline-block">
                {{ section.title }}
              </h3>
              <div class="space-y-6">
                @for (item of section.items; track item) {
                  <div class="relative pl-6 border-l-2 modern-timeline-line">
                    <div
                      class="absolute w-3 h-3 modern-timeline-dot rounded-full -left-[7px] top-1.5"
                    ></div>
                    <div class="flex justify-between items-baseline mb-1">
                      <h4 class="text-lg font-bold break-words">
                        {{ item.headline }}
                      </h4>
                      <span
                        class="text-sm font-medium modern-timeline-date px-2 py-1 rounded shrink-0 ml-4"
                        >{{ item.date }}</span
                      >
                    </div>
                    <div class="text-md font-medium mb-2 break-words" style="opacity: 0.6;">
                      {{ item.subheading }}
                    </div>
                    @if (item.description) {
                      <div
                        class="quill-content break-words"
                        style="opacity: 0.8;"
                        [innerHTML]="formatHtml(item.description)"
                      ></div>
                    }
                  </div>
                }
              </div>
            </div>
          }
          @if (section.type === 'custom-rich-text') {
            <div class="mb-10">
              <h3 class="text-2xl font-bold modern-section-title pb-2 mb-4 inline-block">
                {{ section.title }}
              </h3>
              <div
                class="quill-content break-words"
                style="opacity: 0.8;"
                [innerHTML]="formatHtml(section.customHtmlContent)"
              ></div>
            </div>
          }
        }
      </div>
    </div>
  `,
  styles: [
    `
      .resume-template {
        width: var(--doc-width, 210mm);
        min-height: var(--doc-height, 297mm);
        background: var(--theme-bg);
        color: var(--theme-text);
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
        color-adjust: exact !important;
      }
      .modern-sidebar {
        background-color: var(--theme-surface);
        color: var(--theme-text);
      }
      .modern-sidebar-text-muted {
        color: var(--theme-text);
        opacity: 0.7;
      }
      .modern-sidebar-text-accent {
        color: var(--theme-highlight);
      }
      .modern-skill-tag {
        background-color: var(--theme-bg);
        color: var(--theme-text);
        border-color: var(--theme-highlight);
      }
      .modern-section-title {
        border-bottom-color: var(--theme-highlight);
        color: var(--theme-text);
      }
      .modern-sidebar-title {
        border-bottom-color: var(--theme-highlight);
        color: var(--theme-text);
      }
      .modern-timeline-line {
        border-left-color: var(--theme-surface);
      }
      .modern-timeline-dot {
        background-color: var(--theme-highlight);
      }
      .modern-timeline-date {
        color: var(--theme-highlight);
        background-color: var(--theme-surface);
      }
      @media print {
        .resume-template {
          width: 100% !important;
          min-height: 100vh !important;
          box-shadow: none !important;
          margin: 0 !important;
        }
      }
      ::ng-deep .quill-content {
        white-space: pre-wrap;
        word-wrap: break-word;
        overflow-wrap: break-word;
      }
      ::ng-deep .quill-content p {
        margin-bottom: 0.5rem;
      }
      ::ng-deep .quill-content ul {
        list-style-type: disc;
        padding-left: 1.5rem;
        margin-bottom: 0.5rem;
      }
      ::ng-deep .quill-content ol {
        list-style-type: decimal;
        padding-left: 1.5rem;
        margin-bottom: 0.5rem;
      }
    `,
  ],
})
export class ModernTemplateComponent {
  @Input({ required: true }) data!: ResumeData;

  formatHtml(html: string | undefined): string {
    if (!html) return '';
    return html.replace(/&nbsp;/g, ' ').replace(/\u00A0/g, ' ');
  }
}
