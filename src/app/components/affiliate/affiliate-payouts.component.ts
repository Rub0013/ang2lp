import { Component, HostBinding } from '@angular/core';

@Component({
    selector: 'affiliate-payouts',
    templateUrl: '../../templates/affiliate/affiliate-payouts.template.html'
})

export class AffiliatePayoutsComponent {

    @HostBinding('class') myClass = 'page__main-col page__main-col--with-sidebar';

}
