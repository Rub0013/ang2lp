import { Routes }   from '@angular/router';
import { HomeComponent } from '../home/home.component';

import { ProductsComponent } from '../products/products.component';
import { BillingComponent } from '../billing/billing.component';
import { AccountComponent } from '../account/account.component';
import { AffiliateComponent } from '../affiliate/affiliate.component';
import { HelpComponent } from '../help/help.component';
import { ProfileComponent } from '../profile/profile.component';
import { productRoutes } from "../products/products.routing";
import { accountRoutes } from "../account/account.routing";
import { billingRoutes } from "../billing/billing.routing";
import { affiliateRoutes } from "../affiliate/affiliate.routing";
import { helpRoutes } from "../help/help.routing";


export const mainFrameRoutes: Routes = [
    {path: '', redirectTo: 'home', pathMatch: 'full'},
    {path: 'home', component: HomeComponent},
    {path: 'profile', component: ProfileComponent},
    {
        path: 'products',
        component: ProductsComponent,
        children: productRoutes
    },
    {
        path: 'account',
        component: AccountComponent,
        children: accountRoutes
    },
    {
        path: 'billing',
        component: BillingComponent,
        children: billingRoutes
    },
    // {
    //     path: 'affiliate',
    //     component: AffiliateComponent,
    //     children: affiliateRoutes
    // },
    {path: 'support', component: HelpComponent, children: helpRoutes}
];
