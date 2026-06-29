import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/builder/builder.component').then((m) => m.BuilderComponent),
  },
  {
    path: 'terms',
    loadComponent: () => import('./features/pages/terms.component').then((m) => m.TermsComponent),
  },
  {
    path: 'contact',
    loadComponent: () =>
      import('./features/pages/contact.component').then((m) => m.ContactComponent),
  },
  {
    path: 'contributors',
    loadComponent: () =>
      import('./features/pages/contributors.component').then((m) => m.ContributorsComponent),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
