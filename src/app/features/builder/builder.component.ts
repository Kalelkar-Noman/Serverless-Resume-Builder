import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormEditorComponent } from './form-editor.component';
import { LivePreviewComponent } from './live-preview.component';

@Component({
  selector: 'app-builder',
  standalone: true,
  imports: [CommonModule, FormEditorComponent, LivePreviewComponent],
  template: `
    <div class="flex-1 min-h-0 flex flex-col lg:flex-row w-full h-full relative pb-14 lg:pb-0">
      <!-- Editor Section -->
      <aside
        class="w-full lg:w-1/2 p-4 bg-brand-base border-r border-brand-border flex-shrink-0 overflow-x-hidden overflow-y-auto"
        [class.hidden]="activeTab !== 'editor'"
        [class.block]="activeTab === 'editor'"
        [class.lg:block]="true"
      >
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-semibold text-brand-main">Editor</h2>
        </div>
        <app-form-editor></app-form-editor>
      </aside>

      <!-- Live Preview Section -->
      <main
        class="w-full lg:w-1/2 p-4 bg-black relative custom-scrollbar flex-shrink-0 lg:overflow-y-auto"
        [class.hidden]="activeTab !== 'preview'"
        [class.block]="activeTab === 'preview'"
        [class.lg:block]="true"
      >
        <div
          class="absolute inset-0 z-0 pointer-events-none"
          style="background-image: radial-gradient(circle at center, rgba(255,255,255,0.05) 1px, transparent 1px); background-size: 20px 20px;"
        ></div>
        <div class="relative z-10 h-full flex flex-col">
          <h2 class="text-xl font-semibold text-brand-muted mb-4 hidden lg:block">Live Preview</h2>
          <app-live-preview></app-live-preview>
        </div>
      </main>

      <!-- Mobile Sticky Tab Bar -->
      <div
        class="fixed bottom-0 left-0 right-0 bg-brand-card border-t border-brand-border shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] flex lg:hidden z-50"
      >
        <button
          (click)="activeTab = 'editor'"
          class="flex-1 py-3 text-center font-semibold transition-colors flex items-center justify-center gap-2"
          [class.text-brand-accent]="activeTab === 'editor'"
          [class.border-t-2]="activeTab === 'editor'"
          [class.border-brand-accent]="activeTab === 'editor'"
          [class.text-brand-muted]="activeTab !== 'editor'"
          [class.border-transparent]="activeTab !== 'editor'"
          [class.border-t-2]="activeTab !== 'editor'"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"
            />
          </svg>
          Editor
        </button>
        <button
          (click)="activeTab = 'preview'"
          class="flex-1 py-3 text-center font-semibold transition-colors flex items-center justify-center gap-2"
          [class.text-brand-accent]="activeTab === 'preview'"
          [class.border-t-2]="activeTab === 'preview'"
          [class.border-brand-accent]="activeTab === 'preview'"
          [class.text-brand-muted]="activeTab !== 'preview'"
          [class.border-transparent]="activeTab !== 'preview'"
          [class.border-t-2]="activeTab !== 'editor'"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
            <path
              fill-rule="evenodd"
              d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
              clip-rule="evenodd"
            />
          </svg>
          Preview
        </button>
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        display: flex;
        flex-direction: column;
        flex: 1;
        min-height: 0;
      }

      /* Basic styling for ngx-quill */
      :host ::ng-deep .ql-editor {
        min-height: 100px;
      }
    `,
  ],
})
export class BuilderComponent {
  activeTab: 'editor' | 'preview' = 'editor';
}
