import { Component, HostBinding } from '@angular/core';

@Component({
    selector: 'affiliate-referral',
    templateUrl: '../../templates/affiliate/affiliate-referral.template.html'
})

export class AffiliateReferralComponent {

    @HostBinding('class') myClass = 'page__main-col page__main-col--with-sidebar';

}
