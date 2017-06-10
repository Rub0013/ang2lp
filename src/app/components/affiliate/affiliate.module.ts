import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule } from '@angular/router';

import { AffiliatePayoutsComponent } from './affiliate-payouts.component';
import { AffiliateReferralComponent } from './affiliate-referral.component';
import { AffiliateStatsComponent } from './affiliate-stats.component';
import { PayoutsSidebarComponent } from './payouts-sidebar.component';
import { ReferralSidebarComponent } from './referral-sidebar.component';

@NgModule({
    declarations: [AffiliatePayoutsComponent, AffiliateReferralComponent, AffiliateStatsComponent,
        PayoutsSidebarComponent, ReferralSidebarComponent], // components, pipes and directives that are part of this module
    imports: [CommonModule, RouterModule], //importing other modules
    providers: [] // providers eg services that are part of this module
})

export class AffiliateModule {

}