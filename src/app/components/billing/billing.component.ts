import { Component, HostBinding } from '@angular/core';

@Component({
    selector: 'billing',
    templateUrl: '../../templates/billing/billing.template.html'
})

export class BillingComponent {

    @HostBinding('class') myClass = 'page__content-inner';
}