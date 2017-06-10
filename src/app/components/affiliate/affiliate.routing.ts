import { Routes }   from '@angular/router';


import { AffiliatePayoutsComponent } from './affiliate-payouts.component';
import { AffiliateReferralComponent } from './affiliate-referral.component';
import { AffiliateStatsComponent } from './affiliate-stats.component';
import { ReferralSidebarComponent } from './referral-sidebar.component';


export const affiliateRoutes: Routes = [
    {path: '', redirectTo: 'referral', pathMatch: 'full'}
    , {path: 'stats', component: AffiliateStatsComponent, outlet: 'main'}
    , {path: 'referral', component: AffiliateReferralComponent, outlet: 'main'}
    , {path: 'payouts', component: AffiliatePayoutsComponent, outlet: 'main'}
    , {path: 'referral-sidebar', component: ReferralSidebarComponent, outlet: 'side'}
    , {path: 'payouts-sidebar', component: ReferralSidebarComponent, outlet: 'side'}
];