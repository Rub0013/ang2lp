import {Component, OnInit} from '@angular/core';
import { LimeProxiesService } from '../../services/limeproxies.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
    selector: '.profile-sidebar',
    templateUrl: '../../templates/profile/profile-sidebar.template.html'
})

export class ProfileSidebarComponent implements OnInit {

    private code;
    private codeVerificationForm: FormGroup;


    public userProfile: any = {};

    constructor(public limeProxiesService: LimeProxiesService, fb: FormBuilder) {

        this.codeVerificationForm = fb.group({
            'code': ['', [Validators.required, Validators.minLength(4), Validators.maxLength(4)]],
        });

    }

    // loadProfile() {
    //     this.limeProxiesService.getUserProfile()
    //         .subscribe(
    //             profile => {
    //                 this.userProfile = profile;
    //                 if (this.userProfile.verified) {
    //                     this.codeVerificationForm.get('code').disable();
    //                     this.codeVerificationForm.get('code').patchValue('Account verified successfully!');
    //                 }else if (this.userProfile.phone_code == false) {
    //                     this.codeVerificationForm.get('code').disable();
    //                     this.codeVerificationForm.get('code').patchValue('Update your phone number');
    //                 }
    //             }
    //         );
    // }

    ngOnInit() {
        // this.loadProfile();
        this.userProfile = this.limeProxiesService.userData;
        if (this.userProfile.verified) {
            this.codeVerificationForm.get('code').disable();
            this.codeVerificationForm.get('code').patchValue('Account verified successfully!');
        }else if (this.userProfile.phone_code == false) {
            this.codeVerificationForm.get('code').disable();
            this.codeVerificationForm.get('code').patchValue('Update your phone number');
        }
    }

    isValid() {
        const ret = this.codeVerificationForm.valid && this.limeProxiesService.codeVerificationInputActive;
        if (this.limeProxiesService.codeVerificationInputActive) {
            this.codeVerificationForm.get('code').enable();
        } else {
            this.codeVerificationForm.get('code').disable();
        }
        return ret;
    }


    validateCODE() {
            this.limeProxiesService.validateCODE(this.codeVerificationForm.get('code').value)
                .subscribe(
                    res => {
                        const isSuccess = res['_user_message_type'] == 'success';
                        this.limeProxiesService.showMessage(res);
                        if (isSuccess) {
                        this.limeProxiesService.codeVerificationInputActive = false;
                            this.codeVerificationForm.get('code').disable();
                        }
                    }
                );
    }

}
