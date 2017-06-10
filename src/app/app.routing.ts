import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainFrameComponent } from './components/main-frame/main-frame.component';
import { Error500Component } from './components/main-frame/error-500.component';
import { routes } from './components/login/login.routing';
import { LoginComponent } from './components/login/login.component';
import { mainFrameRoutes } from './components/main-frame/main-frame.routing';
import { BillingConfirmComponent } from './components/billing/billing-confirm.component';


const appRoutes: Routes = [
  {path: '', component: MainFrameComponent, children: mainFrameRoutes},
  {path: 'billing/confirm/:token', component: BillingConfirmComponent},
  {path: 'login', children: routes, component: LoginComponent},
  {path: '500', component: Error500Component},
  {path: '**', redirectTo: 'login', pathMatch: 'full'}
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
