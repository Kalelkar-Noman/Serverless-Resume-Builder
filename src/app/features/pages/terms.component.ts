import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-terms',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="min-h-screen bg-brand-base text-brand-main py-12 px-4 sm:px-6 lg:px-8">
      <div
        class="max-w-3xl mx-auto bg-brand-card rounded-xl shadow-xl overflow-hidden border border-brand-border"
      >
        <div class="p-8 sm:p-12">
          <div class="mb-8 flex items-center justify-between">
            <h1 class="text-3xl font-bold">Terms & Conditions</h1>
            <a
              routerLink="/"
              class="text-brand-accent hover:text-blue-400 font-medium transition-colors"
            >
              &larr; Back to Builder
            </a>
          </div>

          <div class="prose prose-invert max-w-none text-brand-muted">
            <p class="mb-4">Last updated: June 2026</p>

            <h2 class="text-xl font-semibold text-brand-main mt-8 mb-4">1. Introduction</h2>
            <p>
              Welcome to KN Free Resume Builder. By accessing our website and using our service, you
              agree to comply with and be bound by the following terms.
            </p>

            <h2 class="text-xl font-semibold text-brand-main mt-8 mb-4">2. Open Source License</h2>
            <p class="mb-4">
              This project is open-source. The source code is available on GitHub and is provided
              "as is" without warranty of any kind, express or implied.
            </p>

            <h2 class="text-xl font-semibold text-brand-main mt-8 mb-4">3. User Data & Privacy</h2>
            <p class="mb-4">
              We respect your privacy. This application runs entirely in your browser. We do not
              store, track, or collect your resume data on any remote servers. All data remains
              securely on your local device.
            </p>

            <h2 class="text-xl font-semibold text-brand-main mt-8 mb-4">
              4. Limitations of Liability
            </h2>
            <p class="mb-4">
              In no event shall the author or contributors be liable for any claim, damages, or
              other liability arising from, out of, or in connection with the software or the use or
              other dealings in the software.
            </p>

            <div class="mt-12 pt-8 border-t border-brand-border text-sm text-center">
              <p>&copy; 2026 Kalelkar Noman. All rights reserved.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class TermsComponent {}
