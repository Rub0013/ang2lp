import { Routes }   from '@angular/router';
import { MyAccountComponent } from './my-account.component';
import { IpAuthComponent } from './auth-ip.component';
import { UserWhitelistComponent } from './user-whitelist.component';
import { AuthorizedUserComponent } from './auth-user.component';
import { AccountSidebarComponent } from "./account-sidebar.component";


export const accountRoutes: Routes = [
    {path: 'my-account', component: MyAccountComponent},
    {path: 'auth-ip', component: IpAuthComponent},
    {path: 'user-whitelist', component: UserWhitelistComponent},
    {path: 'auth-user', component: AuthorizedUserComponent},
    {path: 'sidebar', component: AccountSidebarComponent}
];