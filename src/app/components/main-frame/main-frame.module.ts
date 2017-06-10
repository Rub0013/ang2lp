import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MainFrameComponent } from './main-frame.component';

import { DashboardFooterComponent } from './dashboard-footer.component';
import { DashboardHeaderComponent } from './dashboard-header.component';
import { DashboardNavComponent } from './dashboard-nav.component';

import { HomeComponent } from '../home/home.component';
import { HomeSidebarComponent } from '../home/home-sidebar.component';
import { HomeMainContentComponent } from '../home/home-main-content.component';


import { RouterModule } from '@angular/router';
import { ProductsComponent } from '../products/products.component';
import { BillingComponent } from '../billing/billing.component';
import { AffiliateComponent } from '../affiliate/affiliate.component';
import { AccountComponent } from '../account/account.component';
import { HelpComponent } from '../help/help.component';
import { ProfileComponent } from '../profile/profile.component';
import { ProfileMainComponent } from '../profile/profile-main.component';
import { ProfileSidebarComponent } from '../profile/profile-sidebar.component';


import { HttpModule, JsonpModule } from '@angular/http';
import {HelpSidebarComponent} from "../help/help-sidebar.component";


@NgModule({
    declarations: [MainFrameComponent, DashboardFooterComponent, DashboardNavComponent, DashboardHeaderComponent
        , HomeComponent, HomeSidebarComponent, HomeMainContentComponent,
        AccountComponent, ProductsComponent, BillingComponent, AffiliateComponent, HelpComponent, ProfileComponent
        , ProfileMainComponent, ProfileSidebarComponent], // components, pipes and directives that are part of this module
    imports: [CommonModule, RouterModule, HttpModule, JsonpModule, FormsModule, ReactiveFormsModule], //importing other modules
    exports: [MainFrameComponent] // providers eg services that are part of this module
})

export class MainFrameModule {

}