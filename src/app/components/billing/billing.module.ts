import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule } from '@angular/router';


import { BillingCreditHistoryComponent } from './billing-credit-history.component';
import { BillingAddNewComponent } from './billing-add-new.component';
import { BillingAddNewSidebarComponent } from './add-new-sidebar.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { cardPaymentDialog } from '../card-payment.component';

@NgModule({
    declarations: [BillingCreditHistoryComponent, BillingAddNewComponent, BillingAddNewSidebarComponent, cardPaymentDialog], // components, pipes and directives that are part of this module
    imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],  // importing other modules
    providers: [] // providers eg services that are part of this module
})

export class BillingModule {

}