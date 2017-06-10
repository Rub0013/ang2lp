import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { RouterModule } from '@angular/router';

import { MyAccountComponent } from './my-account.component';
import { IpAuthComponent } from './auth-ip.component';
import { UserWhitelistComponent } from './user-whitelist.component';
import { AuthorizedUserComponent } from './auth-user.component';


import { HttpModule, JsonpModule } from '@angular/http';
import { AccountSidebarComponent } from "./account-sidebar.component";

@NgModule({
    declarations: [MyAccountComponent, IpAuthComponent, UserWhitelistComponent, AccountSidebarComponent, AuthorizedUserComponent], // components, pipes and directives that are part of this module
    imports: [CommonModule, RouterModule, HttpModule, JsonpModule, FormsModule], //importing other modules
})

export class AccountModule {

}