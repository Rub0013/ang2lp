import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule, JsonpModule } from '@angular/http';

import { LoginModule } from './components/login/login.module';
import { MainFrameModule } from './components/main-frame/main-frame.module';

import { routing } from './app.routing';

import { AppComponent } from './components/app.component';
import { ErrorComponent } from './components/error.component';


import { LimeProxiesService } from './services/limeproxies.service';

import { ExcelExportService } from './services/excel-export.service';

import {
    LocationStrategy,
    HashLocationStrategy
} from '@angular/common';
import { Error500Component } from './components/main-frame/error-500.component';
import { ConfirmDialog } from './components/confirm-dialog.component';
import { DialogService } from './services/dialog.service';
import { QuizDialog } from './components/quiz.component';
import { ProductsModule } from './components/products/products.module';
import { AccountModule } from './components/account/account.module';
import { BillingModule } from './components/billing/billing.module';
import { AffiliateModule } from './components/affiliate/affiliate.module';
import { HelpModule } from './components/help/help.module';
import { BillingConfirmComponent } from './components/billing/billing-confirm.component';

@NgModule({
    imports: [BrowserModule, routing, LoginModule, MainFrameModule,
        HttpModule, JsonpModule, FormsModule, ReactiveFormsModule,
        ProductsModule, AccountModule, BillingModule, AffiliateModule, HelpModule],
    declarations: [AppComponent, ErrorComponent, Error500Component, ConfirmDialog, QuizDialog, BillingConfirmComponent],
    providers: [LimeProxiesService, {provide: LocationStrategy, useClass: HashLocationStrategy}, DialogService, ExcelExportService],
    bootstrap: [AppComponent]
})
export class AppModule {
}
