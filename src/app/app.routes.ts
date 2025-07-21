import { Routes } from '@angular/router';
import { ScrollPageComponent } from './scroll-page/scroll-page.component';
import { ImprintComponent } from './pages/legal/imprint/imprint.component';
import { PrivacyPolicyComponent } from './pages/legal/privacy-policy/privacy-policy.component';

export const routes: Routes = [
  { path: '', component: ScrollPageComponent },
  { path: 'imprint', component: ImprintComponent },
  { path: 'privacy-policy', component: PrivacyPolicyComponent }
];
