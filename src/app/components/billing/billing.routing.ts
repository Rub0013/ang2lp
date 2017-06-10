import { Routes } from '@angular/router';

import { BillingCreditHistoryComponent } from './billing-credit-history.component';
import { BillingAddNewComponent } from './billing-add-new.component';


export const billingRoutes: Routes = [
    {path: 'history', component: BillingCreditHistoryComponent},
    {path: 'new', component: BillingAddNewComponent}
];