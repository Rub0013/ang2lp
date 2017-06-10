import { Component, HostBinding, OnInit } from '@angular/core';
import { LimeProxiesService } from '../../services/limeproxies.service';
import { Observable } from 'rxjs/Rx';
import { UserCredentials }  from '../../entities/user-credentials';
import { Router } from '@angular/router';
// We will need to import a couple of specific API’s for dealing with reactive forms
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
/// Custom Validators
import { MyValidators } from '../../custom-validators/custom.validator';

@Component({
    selector: 'login-or-register',
    templateUrl: '../../templates/login/login-or-register.template.html'
})

export class LoginOrRegisterComponent implements OnInit {

    @HostBinding('class') myClass = 'page__content-inner';

    private creds: UserCredentials;

    private username;
    private password;

    private loginOrRegisterForm;

    constructor(private limeProxiesService: LimeProxiesService, private router: Router, private fb: FormBuilder) {
        this.loginOrRegisterForm = fb.group({
            'username': ['', Validators.compose([MyValidators.validateEmail(), Validators.required])],
            'password': ['', Validators.compose([Validators.minLength(8), Validators.required])]
        });
    }

    ngOnInit() {
        if (this.limeProxiesService.messageToDisplay.value.message != 'Nothing to display') {
            this.limeProxiesService.notifyBarNew(
                this.limeProxiesService.messageToDisplay.value.message,
                this.limeProxiesService.messageToDisplay.value.success ? 'success' : 'error'
            );
            this.limeProxiesService.messageToDisplay.next({
                message: 'Nothing to display',
                success: false
            });

        }

      localStorage.removeItem('userId');
      localStorage.removeItem('token');
    }


    /*
     calling API method and sending username & password to it
     exprected result: UserCredentials object
     */
    login() {
        this.limeProxiesService.login(this.username, this.password)
            .subscribe(
                creds => {
                    this.limeProxiesService.setUserProfile();
                    this.router.navigate(['../home']);
                },
                error => {
                    console.log(error);
                    this.limeProxiesService.notifyBarNew('Unauthorized', 'error');
                }
            );


    }


}
