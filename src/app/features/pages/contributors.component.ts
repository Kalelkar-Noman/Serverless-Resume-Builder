import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

interface Contributor {
  login: string;
  name: string;
  avatar_url: string;
  html_url: string;
}

@Component({
  selector: 'app-contributors',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="min-h-screen bg-brand-base text-brand-main py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-4xl mx-auto">
        <div class="mb-8 flex items-center justify-between">
          <h1 class="text-3xl font-bold">Contributors</h1>
          <a
            routerLink="/"
            class="text-brand-accent hover:text-blue-400 font-medium transition-colors"
          >
            &larr; Back to Builder
          </a>
        </div>

        <div
          class="bg-brand-card rounded-xl shadow-xl overflow-hidden border border-brand-border p-8 sm:p-12 mb-8"
        >
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mb-12">
            @for (contributor of contributors(); track contributor.login) {
              <div
                class="text-center p-6 bg-brand-base rounded-xl border border-brand-border shadow-sm hover:border-brand-accent transition-all hover:-translate-y-1"
              >
                <img
                  [src]="contributor.avatar_url"
                  [alt]="contributor.name"
                  class="w-24 h-24 rounded-full mx-auto mb-4 border-2 border-brand-accent shadow-md"
                />
                <h3 class="text-lg font-bold text-brand-main mb-1">{{ contributor.name }}</h3>
                <p class="text-brand-muted text-sm mb-4">&#64;{{ contributor.login }}</p>
                <a
                  [href]="contributor.html_url"
                  target="_blank"
                  class="inline-block px-4 py-2 bg-brand-card border border-brand-border rounded-lg text-sm font-medium text-brand-accent hover:bg-brand-accent hover:text-white transition-colors"
                >
                  View Profile
                </a>
              </div>
            } @empty {
              <div class="col-span-full text-center text-brand-muted py-8">
                @if (isLoading()) {
                  <p class="animate-pulse">Loading amazing contributors...</p>
                } @else if (error()) {
                  <p class="text-red-500">{{ error() }}</p>
                } @else {
                  <p>No contributors found yet. Be the first!</p>
                }
              </div>
            }
          </div>

          <div
            class="text-center text-brand-muted max-w-2xl mx-auto border-t border-brand-border pt-12"
          >
            <h2 class="text-2xl font-bold text-brand-main mb-4">Join the Community!</h2>
            <p class="mb-6">
              This open-source project is dedicated to providing a fast, serverless, and
              privacy-focused way to build beautiful resumes.
            </p>
            <p>
              Want to contribute? Check out the GitHub repository, open issues, submit PRs, and help
              make this tool even better for everyone.
            </p>

            <a
              href="https://github.com/Kalelkar-Noman/Serverless-Resume-Builder"
              target="_blank"
              class="inline-block mt-8 bg-brand-accent text-white font-medium py-3 px-8 rounded-lg transition-all hover:bg-blue-600 hover:shadow-lg hover:shadow-brand-accent/20"
            >
              View on GitHub
            </a>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class ContributorsComponent implements OnInit {
  contributors = signal<Contributor[]>([]);
  isLoading = signal<boolean>(true);
  error = signal<string | null>(null);

  async ngOnInit() {
    this.isLoading.set(true);
    this.error.set(null);
    try {
      // Fetch the contributors array from the assets/public folder
      const res = await fetch('/contributors.json');
      if (!res.ok) throw new Error('Failed to fetch contributors list');
      const usernames: string[] = await res.json();

      // Fetch details for each contributor
      const contributorsData = await Promise.all(
        usernames.map(async (username) => {
          try {
            const userRes = await fetch(`https://api.github.com/users/${username}`);
            if (!userRes.ok) return null;
            const userData = await userRes.json();
            return {
              login: userData.login,
              name: userData.name || userData.login,
              avatar_url: userData.avatar_url,
              html_url: userData.html_url,
            };
          } catch {
            return null;
          }
        }),
      );

      this.contributors.set(contributorsData.filter((c) => c !== null) as Contributor[]);
    } catch (err) {
      console.error('Failed to load contributors:', err);
      this.error.set('Failed to load contributors. Please try again later.');
    } finally {
      this.isLoading.set(false);
    }
  }
}
