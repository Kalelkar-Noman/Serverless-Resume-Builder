import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResumeData } from '../../core/models/resume.model';

@Component({
  selector: 'app-minimalist-template',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      [style.--theme-text]="data.design?.text || '#374151'"
      [style.--theme-bg]="data.design?.background || '#FFFFFF'"
      [style.--theme-highlight]="data.design?.highlight || '#111827'"
      [style.--theme-surface]="data.design?.surface || '#F3F4F6'"
      [style.padding]="'var(--doc-padding, 3rem)'"
      [class]="
        'resume-template full-bleed-template shadow-2xl mx-auto print:p-8 overflow-hidden ' +
        (data.design?.font || 'font-sans')
      "
    >
      <header
        class="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 border-b-2 pb-6"
        style="border-color: var(--theme-surface);"
      >
        <div>
          <h1
            class="text-5xl font-light tracking-tight mb-2"
            style="color: var(--theme-highlight);"
          >
            {{ data.personalInfo.name }}
          </h1>
          <p class="text-2xl font-medium" style="color: var(--theme-text);">
            {{ data.personalInfo.title }}
          </p>
        </div>
        <div
          class="text-left sm:text-right text-sm mt-4 sm:mt-0 flex flex-col gap-1"
          style="color: var(--theme-text); opacity: 0.7;"
        >
          <span class="font-medium">{{ data.personalInfo.email }}</span>
          @if (data.personalInfo.phone) {
            <span>{{ data.personalInfo.phone }}</span>
          }
          @if (data.personalInfo.location) {
            <span>{{ data.personalInfo.location }}</span>
          }
          @for (link of data.personalInfo.customLinks; track link) {
            <a
              [href]="link.url"
              style="color: var(--theme-highlight);"
              class="hover:opacity-80 transition-opacity"
              >{{ link.url }}</a
            >
          }
        </div>
      </header>

      @if (data.summary) {
        <section class="mb-8">
          <div
            class="leading-relaxed quill-content break-words"
            style="color: var(--theme-text); opacity: 0.8;"
            [innerHTML]="formatHtml(data.summary)"
          ></div>
        </section>
      }

      @for (section of data.sections; track section.id) {
        <section class="mb-8">
          <h2
            class="text-lg uppercase tracking-widest font-semibold mb-4"
            style="color: var(--theme-highlight);"
          >
            {{ section.title }}
          </h2>

          @switch (section.type) {
            @case ('timeline') {
              <div class="space-y-6">
                @for (item of section.items; track item) {
                  <div>
                    <div class="flex justify-between items-baseline mb-1">
                      <h3
                        class="text-xl font-medium break-words"
                        style="color: var(--theme-highlight);"
                      >
                        {{ item.headline }}
                      </h3>
                      <span
                        class="text-sm font-medium shrink-0 ml-4"
                        style="color: var(--theme-text); opacity: 0.7;"
                        >{{ item.date }}</span
                      >
                    </div>
                    <div
                      class="text-md italic mb-2 break-words"
                      style="color: var(--theme-text); opacity: 0.8;"
                    >
                      {{ item.subheading }}
                    </div>
                    @if (item.description) {
                      <div
                        class="quill-content break-words"
                        style="color: var(--theme-text); opacity: 0.8;"
                        [innerHTML]="formatHtml(item.description)"
                      ></div>
                    }
                  </div>
                }
              </div>
            }
            @case ('skills-grid') {
              <div class="flex flex-wrap gap-x-4 gap-y-2">
                @for (skill of section.skillTags; track skill) {
                  <span class="font-medium" style="color: var(--theme-text);">
                    {{ skill.name }}
                    @if (skill.level) {
                      <span class="font-normal" style="opacity: 0.5;">({{ skill.level }})</span>
                    }
                  </span>
                }
              </div>
            }
            @case ('custom-rich-text') {
              <div
                class="quill-content break-words"
                style="color: var(--theme-text); opacity: 0.8;"
                [innerHTML]="formatHtml(section.customHtmlContent)"
              ></div>
            }
          }
        </section>
      }
    </div>
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
export class MinimalistTemplateComponent {
  @Input({ required: true }) data!: ResumeData;

  formatHtml(html: string | undefined): string {
    if (!html) return '';
    return html.replace(/&nbsp;/g, ' ').replace(/\u00A0/g, ' ');
  }
}
