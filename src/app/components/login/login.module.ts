import { NgModule }      from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule, JsonpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { LoginComponent } from './login.component';
import { LoginOrRegisterComponent } from  './login-or-register.component';
import { AccountCreateComponent } from './account-create.component';
import { ForgotPasswordComponent } from './forgot-password.component';
import { TokenValidationComponent } from './token-validation.component';
import { PasswordRecoverComponent } from './password-recover.component';
import { RouterModule } from "@angular/router";
import { TokenRevalidationComponent } from "./token-revalidation.component";


@NgModule({
    imports: [CommonModule, FormsModule, ReactiveFormsModule, HttpModule, JsonpModule, RouterModule],
    declarations: [LoginComponent, LoginOrRegisterComponent, AccountCreateComponent, ForgotPasswordComponent,  TokenRevalidationComponent,TokenValidationComponent, PasswordRecoverComponent],
    exports: [LoginComponent]
})
export class LoginModule {

}