import { Component, HostBinding, } from '@angular/core';
@Component({
    selector: 'account',
    templateUrl: '../../templates/account/account.template.html'
})

export class AccountComponent {

    @HostBinding('class') productsClass = 'page__content-inner';


}