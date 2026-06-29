import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="min-h-screen bg-brand-base text-brand-main py-12 px-4 sm:px-6 lg:px-8">
      <div
        class="max-w-3xl mx-auto bg-brand-card rounded-xl shadow-xl overflow-hidden border border-brand-border"
      >
        <div class="p-8 sm:p-12">
          <div class="mb-8 flex items-center justify-between">
            <h1 class="text-3xl font-bold">Contact Us</h1>
            <a
              routerLink="/"
              class="text-brand-accent hover:text-blue-400 font-medium transition-colors"
            >
              &larr; Back to Builder
            </a>
          </div>

          <div class="text-brand-muted mb-8">
            <p class="mb-4">
              Have questions about the resume builder, want to report a bug, or just want to say hi?
              Feel free to reach out!
            </p>
            <p>You can also connect with me directly through my portfolio or GitHub repository.</p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <a
              href="https://kalelkarnoman.netlify.app"
              target="_blank"
              class="block p-6 bg-brand-base rounded-lg border border-brand-border hover:border-brand-accent transition-colors group"
            >
              <h3
                class="text-lg font-bold text-brand-main mb-2 group-hover:text-brand-accent transition-colors"
              >
                Portfolio
              </h3>
              <p class="text-brand-muted text-sm">kalelkarnoman.netlify.app</p>
            </a>

            <a
              href="https://github.com/Kalelkar-Noman"
              target="_blank"
              class="block p-6 bg-brand-base rounded-lg border border-brand-border hover:border-brand-accent transition-colors group"
            >
              <h3
                class="text-lg font-bold text-brand-main mb-2 group-hover:text-brand-accent transition-colors"
              >
                GitHub
              </h3>
              <p class="text-brand-muted text-sm">github.com/Kalelkar-Noman</p>
            </a>
          </div>

          <div class="mt-8 text-center bg-brand-base border border-brand-border rounded-lg p-8">
            <h3 class="text-xl font-bold text-brand-main mb-4">Send an Email directly</h3>
            <p class="text-brand-muted mb-6">
              Clicking the button below will open your default email client (like Gmail, Outlook, or
              Apple Mail).
            </p>
            <a
              href="mailto:kalelkarnoman014@gmail.com"
              class="inline-block bg-brand-accent hover:bg-blue-600 text-white font-medium py-3 px-8 rounded-lg transition-colors shadow-lg shadow-brand-accent/20"
            >
              Email kalelkarnoman014&#64;gmail.com
            </a>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class ContactComponent {}
