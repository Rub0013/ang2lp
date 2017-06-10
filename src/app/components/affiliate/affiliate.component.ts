import { Component, HostBinding } from '@angular/core';

@Component({
    selector: 'affiliate',
    templateUrl: '../../templates/affiliate/affiliate.template.html'
})

export class AffiliateComponent {

    @HostBinding('class') myClass = 'page__content-inner';
}