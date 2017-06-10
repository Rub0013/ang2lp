import { Component, HostBinding } from '@angular/core';

@Component({
    templateUrl: '../../templates/profile/profile.template.html'
})

export class ProfileComponent {

    @HostBinding('class') homeClass = 'page__content-inner';
}
