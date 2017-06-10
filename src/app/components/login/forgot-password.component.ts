import { Component, HostBinding } from '@angular/core';
import { LimeProxiesService } from '../../services/limeproxies.service';
import { Message } from '../../entities/message';
import { Router } from '@angular/router';
// We will need to import a couple of specific API’s for dealing with reactive forms
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
/// Custom Validators
import { MyValidators } from "../../custom-validators/custom.validator";


@Component({
    selector: 'forgot-password',
    templateUrl: '../../templates/login/forgot-password.template.html'
})

export class ForgotPasswordComponent {

    @HostBinding('class') myClass = "page__content-inner";
    private successMessage: string;
    private errorMessage: string;
    private redirectMessage: string;
    private forgotPasswordForm: FormGroup;
    private email;

    constructor(private router: Router, private limeProxiesService: LimeProxiesService, private fb: FormBuilder) {
        this.forgotPasswordForm = fb.group({
            'email': ["", Validators.compose([MyValidators.validateEmail(), Validators.required])]
        })
    }


    resetMyPassword() {
        let result = this.limeProxiesService.userPasswordRecover(this.email)
            .subscribe(
                message => {
                    this.errorMessage = "";
                    this.limeProxiesService.messageToDisplay.next(new Message(message._user_message, true));
                    this.redirectMessage = "Loading, please wait ...";
                    this.redirectUserToLoginPage(this.router);
                },
                error => {
                    this.successMessage = "";
                    this.errorMessage = error;
                    this.redirectMessage = "Loading, please wait ...";
                    this.redirectUserToLoginPage(this.router);
                }
            );
    }

    redirectUserToLoginPage(router) {
        setTimeout(function () {
            router.navigate(['/login']);
        }, 3000);

    }

}