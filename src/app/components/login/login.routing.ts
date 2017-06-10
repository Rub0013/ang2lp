import { Routes }   from '@angular/router';

import { LoginOrRegisterComponent } from './login-or-register.component';
import { AccountCreateComponent } from './account-create.component';
import { ForgotPasswordComponent } from './forgot-password.component';
import { TokenValidationComponent } from './token-validation.component';
import { PasswordRecoverComponent } from './password-recover.component';
import { TokenRevalidationComponent } from './token-revalidation.component';

export const routes: Routes = [
            {path: '', component: LoginOrRegisterComponent, pathMatch: 'full'}
            , {path: 'signup', component: AccountCreateComponent}
            , {path: 'forgot-password', component: ForgotPasswordComponent}
            , {path: 'validate/:token', component: TokenValidationComponent}
            , {path: 'revalidate/:token', component: TokenRevalidationComponent}
            , {path: 'recover/:token', component: PasswordRecoverComponent}
];