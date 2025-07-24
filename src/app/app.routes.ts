import { Routes } from '@angular/router';
import { ScrollPageComponent } from './scroll-page/scroll-page.component';

export const routes: Routes = [
  { path: '', component: ScrollPageComponent },
  {
    path: 'imprint',
    loadChildren: () =>
      import('./pages/legal/imprint/imprint.module').then((m) => m.ImprintModule),
  },
  {
    path: 'privacy-policy',
    loadChildren: () =>
      import('./pages/legal/privacy-policy/privacy-policy.module').then((m) => m.default),
  }
];
