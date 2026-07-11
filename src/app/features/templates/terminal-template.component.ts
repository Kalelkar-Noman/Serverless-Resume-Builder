import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResumeData } from '../../core/models/resume.model';

@Component({
  selector: 'app-terminal-template',
  standalone: true,
  imports: [CommonModule],
  template: `
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;600;700&display=swap');
      .font-fira {
        font-family: 'Fira Code', monospace !important;
      }
    </style>
    <div
      [style.--theme-text]="data.design?.text || '#4ade80'"
      [style.--theme-bg]="data.design?.background || '#000000'"
      [style.--theme-highlight]="data.design?.highlight || '#22c55e'"
      [style.padding]="'var(--doc-padding, 2.5rem)'"
      [class]="
        'resume-template full-bleed-template term-main shadow-2xl mx-auto print:p-6 overflow-hidden ' +
        (data.design?.font || 'font-fira')
      "
    >
      <div class="mb-10 print:mb-6 border-b term-border border-dashed pb-8 print:pb-4">
        <h1 class="text-4xl font-bold mb-3 tracking-tight">> {{ data.personalInfo.name }}_</h1>
        @if (data.personalInfo.title && data.personalInfo.title.trim() !== '') {
          <h2 class="text-xl term-light mb-6 font-semibold">[{{ data.personalInfo.title }}]</h2>
        }

        <div class="grid grid-cols-2 gap-4 text-sm term-muted">
          <div class="break-all">
            <span class="term-dark font-bold mr-2">email:</span> {{ data.personalInfo.email }}
          </div>
          <div>
            <span class="term-dark font-bold mr-2">phone:</span> {{ data.personalInfo.phone }}
          </div>
          <div>
            <span class="term-dark font-bold mr-2">location:</span>
            {{ data.personalInfo.location }}
          </div>
          @for (link of data.personalInfo.customLinks; track link) {
            <div>
              <span class="term-dark font-bold mr-2">{{ link.label }}:</span>
              <span class="break-all">{{ link.url }}</span>
            </div>
          }
        </div>
      </div>

      @if (data.summary) {
        <div class="mb-10 print:mb-6">
          <div class="term-light font-bold mb-3 text-lg">user&#64;term:~$ cat profile.txt</div>
          <div
            class="term-main pl-4 border-l-2 term-border quill-content break-words"
            [innerHTML]="formatHtml(data.summary)"
          ></div>
        </div>
      }

      @for (section of data.sections; track section.id) {
        <div class="mb-10 print:mb-6">
          <div class="term-light font-bold mb-5 print:mb-3 text-lg">
            user&#64;term:~$ ./{{ getSectionCmd(section.title) }}.sh
          </div>

          <div class="pl-4 border-l-2 term-border">
            @switch (section.type) {
              @case ('timeline') {
                <div class="space-y-8 print:space-y-4">
                  @for (item of section.items; track item) {
                    <div class="mb-8 print:mb-4">
                      <div class="flex justify-between items-start term-light font-bold mb-1">
                        <span class="text-lg break-words">[*] {{ item.headline }}</span>
                        <span class="term-dark shrink-0 ml-4">[{{ item.date }}]</span>
                      </div>
                      <div class="term-muted mb-3 print:mb-1 font-semibold break-words">
                        @ {{ item.subheading }}
                      </div>
                      @if (item.description) {
                        <div
                          class="term-main quill-content break-words"
                          [innerHTML]="formatHtml(item.description)"
                        ></div>
                      }
                    </div>
                  }
                </div>
              }
              @case ('skills-grid') {
                <div class="flex flex-wrap gap-3 mt-2">
                  @for (skill of section.skillTags; track skill) {
                    <span
                      class="term-surface term-main px-3 py-1 border term-border-light font-semibold shadow-sm"
                    >
                      {{ skill.name }}
                    </span>
                  }
                </div>
              }
              @case ('custom-rich-text') {
                <div
                  class="term-main quill-content break-words"
                  [innerHTML]="formatHtml(section.customHtmlContent)"
                ></div>
              }
            }
          </div>
        </div>
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
        /* Force dark background printing */
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
        color-adjust: exact !important;
      }
      .term-main {
        color: var(--theme-text);
      }
      .term-light {
        color: var(--theme-highlight);
      }
      .term-muted {
        color: var(--theme-text);
        opacity: 0.8;
      }
      .term-dark {
        color: var(--theme-highlight);
        opacity: 0.8;
      }
      .term-border {
        border-color: var(--theme-surface);
      }
      .term-border-light {
        border-color: var(--theme-highlight);
      }
      .term-surface {
        background-color: var(--theme-surface);
      }

      ::ng-deep .quill-content {
        white-space: pre-wrap;
        word-wrap: break-word;
        overflow-wrap: break-word;
      }
      ::ng-deep .quill-content p {
        margin-bottom: 0.75rem;
      }
      ::ng-deep .quill-content ul {
        list-style-type: square;
        padding-left: 1.5rem;
        margin-bottom: 0.75rem;
      }
      ::ng-deep .quill-content ol {
        list-style-type: decimal-leading-zero;
        padding-left: 1.5rem;
        margin-bottom: 0.75rem;
      }
    `,
  ],
})
export class TerminalTemplateComponent {
  @Input({ required: true }) data!: ResumeData;

  getSectionCmd(title: string): string {
    return title.toLowerCase().replace(/[^a-z0-9]/g, '_');
  }

  formatHtml(html: string | undefined): string {
    if (!html) return '';
    return html.replace(/&nbsp;/g, ' ').replace(/\u00A0/g, ' ');
  }
}
