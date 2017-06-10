import { Component, HostBinding } from '@angular/core';
import { LimeProxiesService } from '../../services/limeproxies.service';

@Component({
    selector: 'auth-user',
    templateUrl: '../../templates/account/auth-user.template.html'
})

export class AuthorizedUserComponent {

    @HostBinding('class') productsClass = 'page__main-col';

    private username: string = "";
    private proxy_password: string = "";

    private user_auth_method;
    private user_access_type;

    private errorMessage;
    private successMessage;

    constructor(private limeProxiesService: LimeProxiesService) {
        this.limeProxiesService.getProxyPassword()
            .subscribe(
                success => {
                    this.username = success.username;
                    this.proxy_password = success.password;
                },
                error => this.errorMessage = error
            );

        this.limeProxiesService.userSubject.subscribe(
            subject => {
                this.user_auth_method = subject.auth_method;
                this.user_access_type = subject.access_type;
            },
            error => this.errorMessage = error
        );

    }

    updateProxyPassword() {
        if (this.proxy_password.length >= 8 && this.proxy_password.length <= 32) {
            this.limeProxiesService.updateProxyPassword(this.proxy_password)
                .subscribe(
                    success => {
                        this.limeProxiesService.showMessage(success);
                    },
                    error => {
                        this.limeProxiesService.showMessage(error, 'error');
                    }
                );
        }
        else {
            this.limeProxiesService.notifyBarNew("Password length must be between 8 and 32 characters.", 'error');
        }

    }

}