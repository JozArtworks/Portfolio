import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { privacyPolicyRoutes } from './privacy-policy.routes';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    RouterModule.forChild(privacyPolicyRoutes),
  ],
})
export default class PrivacyPolicyModule {}
