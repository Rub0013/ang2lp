import { Component, HostBinding } from '@angular/core';


@Component({
    selector: 'login',
    templateUrl: '../../templates/login/login.template.html'
})


export class LoginComponent {
    @HostBinding('class') myClass = 'page page--form';
}