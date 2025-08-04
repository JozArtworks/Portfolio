import { Routes } from '@angular/router';
import { ScrollPageComponent } from './scroll-page/scroll-page.component';

/**
 * Application routes configuration.
 * Defines route-based navigation for the portfolio, including
 * lazy-loaded legal pages and the default scroll-based landing page.
 */
export const routes: Routes = [

  /**
   * Root route.
   * Displays the scroll-based main layout with all sections (home, about, skills, etc.).
   */
  { path: '', component: ScrollPageComponent },

  /**
   * Legal notice (Impressum) route.
   * Lazy-loads the ImprintModule when the user navigates to /imprint.
   */
  {
    path: 'imprint',
    loadChildren: () =>
      import('./pages/legal/imprint/imprint.module').then((m) => m.ImprintModule),
  },

  /**
   * Privacy policy route.
   * Lazy-loads the PrivacyPolicyModule when the user navigates to /privacy-policy.
   * The module uses the `default` export instead of a named one.
   */
  {
    path: 'privacy-policy',
    loadChildren: () =>
      import('./pages/legal/privacy-policy/privacy-policy.module').then((m) => m.default),
  }
];
