import { Component, OnInit } from '@angular/core';
import { LimeProxiesService } from '../../services/limeproxies.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MyValidators } from '../../custom-validators/custom.validator';

@Component({
    selector: '.profile-main',
    templateUrl: '../../templates/profile/profile-main.template.html'
})

export class ProfileMainComponent implements OnInit {

    private userProfile;
    private selected_country;
    private selected_phone_code: string;
    private newPassword: string;
    private confirmPassword: string;
    private hasPhone: boolean;
    private canSendSmS = true;

    profileForm: FormGroup;
    passwordForm: FormGroup;
    emailForm: FormGroup;

    private successMessage;
    private errorMessage;
    public phone_cc: string;

    private countries = [];

    // We are passing an instance of the FormBuilder to our constructor
    constructor(public limeProxiesService: LimeProxiesService, fb: FormBuilder) {

        this.userProfile = {};

        this.profileForm = fb.group({
            'firstName': ['', Validators.compose([Validators.maxLength(50), Validators.required])],
            'lastName': ['', Validators.compose([Validators.maxLength(50), Validators.required])],
            'address': ['', Validators.maxLength(250)],
            'city': ['', Validators.maxLength(50)],
            'companyName': ['', Validators.maxLength(50)],
            'companyNumber': ['', Validators.maxLength(50)],
            'phone': ['', Validators.compose([Validators.required, MyValidators.validatePhone()])],
            'phone_cc': ['', [Validators.required]],
            'zipCode': [''],
        });
        this.profileForm.controls['phone_cc'].disable();

        this.passwordForm = fb.group({
            'newPassword': ['', Validators.compose([Validators.minLength(8), Validators.maxLength(50), Validators.required])],
            'confirmPassword': ['', Validators.compose([Validators.minLength(8), Validators.maxLength(50), Validators.required])]
        }, {validator: MyValidators.MatchPassword});
        this.emailForm = fb.group({
            'email': ['', Validators.compose([Validators.required, MyValidators.validateEmail()])]
        });
    }


    ngOnInit() {
        this.newPassword = '';
        this.confirmPassword = '';
        this.limeProxiesService.getUserProfile()
            .subscribe(
                profile => {
                    this.limeProxiesService.codeVerificationInputActive = !profile.verified && profile.phone_code;
                    this.userProfile = profile;
                  this.emailForm.get('email').patchValue(profile.email);
                  // this.checkPhone(profile);
                    this.phone_cc = this.limeProxiesService.getPhoneCC(profile.country);
                    this.userProfile.phone = this.userProfile.phone.replace(this.phone_cc, '');
                    this.selected_country = profile.country;
                    this.hasPhone = this.userProfile == '';
                }
            );
    }
    canSendPhoneSms(){
        return !!this.userProfile.phone && !this.userProfile.verified && this.canSendSmS;
    }
    emailFormIsValid(){
       return (this.emailForm.valid && this.emailForm.get('email').touched);
    }

    sendSMSCode() {
        this.canSendSmS = false;
        this.limeProxiesService.sendSMSCode()
            .subscribe(
                success => this.limeProxiesService.showMessage(success),
                error => this.limeProxiesService.showMessage(error, 'error')
            );
    }


    selectCountry(event) {
        const country = event.target.value;
        this.phone_cc = event.target.selectedOptions[0].attributes.code.value;
        this.selected_country = country.split(': ')[1];
        this.userProfile.country = country.split(': ')[1];
    }

    updatePassword() {
        if (this.newPassword.length == 0) {
            this.limeProxiesService.notifyBarNew('Minimum password length is 8 characters', 'error');
        }
        else if (this.newPassword != this.confirmPassword) {
            this.limeProxiesService.notifyBarNew('New and confirmation password must be the same', 'error');
        }
        else {
            const obj = {password: this.newPassword};
            this.limeProxiesService.updateUserProfile(obj)
                .subscribe(
                    success => {
                        this.limeProxiesService.showMessage(success);
                    },
                    error => {
                        this.limeProxiesService.showMessage(error, 'error');
                    }
                );
        }
    }
    updateEmail() {
        const email = this.emailForm.get('email').value;
        this.limeProxiesService.updateUserProfile({email})
            .subscribe(
                data => {
                    this.limeProxiesService.showMessage(data);

                }
            );
    }
    private checkPhone(profile) {
        if (profile.phone) {
            this.profileForm.controls['phone'].disable();
        } else {
            this.profileForm.controls['phone'].enable();
        }
    }

    updateUserProfile() {
      const clone = Object.assign({}, this.userProfile);
      if (clone.hasOwnProperty('email')) {
        delete clone.email;
      }
      clone.phone = this.phone_cc + clone.phone;
      delete clone.phone_code;
      delete clone.uid;
      delete clone.verified;
        this.limeProxiesService.updateUserProfile(clone)
            .subscribe(
                profile => {
                    this.limeProxiesService.codeVerificationInputActive = !profile.verified && profile.phone_code;
                    this.userProfile = profile;
                    this.emailForm.get('email').patchValue(profile.email);
                    // this.checkPhone(profile);
                    this.selected_country = profile.country;
                    this.phone_cc = this.limeProxiesService.getPhoneCC(profile.country);
                    this.userProfile.phone = this.userProfile.phone.replace(this.phone_cc, '');
                    this.canSendSmS = !profile.verified;
                    this.hasPhone = this.userProfile == '';
                    this.limeProxiesService.showMessage(profile);
                },
                error => {
                    this.limeProxiesService.showMessage(error, 'error');
                }
            );
    }
}
