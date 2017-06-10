import { Component, HostBinding } from '@angular/core';

@Component({
    selector: 'payouts-sidebar',
    templateUrl: '../../templates/affiliate/sidebar-payouts.template.html'
})

export class PayoutsSidebarComponent {

    @HostBinding('class') sidebarClass = 'page__sidebar-col';
}