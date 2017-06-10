import {AfterViewInit, Component, HostBinding} from '@angular/core';
import { LimeProxiesService } from '../../services/limeproxies.service';
import { countryList } from '../../services/countryList.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MyValidators } from "../../custom-validators/custom.validator";


@Component({
    selector: 'account-create',
    templateUrl: '../../templates/login/account-create.template.html'
})

export class AccountCreateComponent implements AfterViewInit{

    @HostBinding('class') myClass = "page__content-inner";

    private signUpForm: FormGroup;
    private tokenValid: boolean = false;

    private signUpData = {
        firstName: undefined,
        lastName: undefined,
        email: undefined,
        country: undefined,
        city: undefined,
        zipCode: undefined,
        address: undefined,
        phone: undefined,
        password: undefined
    };

    //private stepId:number;
    private subscribtionObject: any;


    private countries = [];
  public submited: boolean = false;

    constructor(private route: ActivatedRoute, private limeProxiesService: LimeProxiesService, private router: Router, fb: FormBuilder) {

      this.signUpForm = fb.group({
                'first_name': ["", Validators.required],
                'last_name': ["", Validators.required],
                'email': ["", Validators.compose([Validators.required, MyValidators.validateEmail()])]
            });

      this.route.queryParams.subscribe((params:any) => {
        if(params.first_name && params.last_name && params.email){
          this.signUpForm.setValue({
            'first_name':params.first_name,
            'last_name':params.last_name,
            'email':params.email,
          });
          if(this.signUpForm.valid){
            this.submited = true;
            this.sendValidationLinkToEmail();
          }
        }
      });

        this.countries.push({display: "Country", value: ""});
        countryList.forEach(country => {
            this.countries.push({
                display: country,
                value: country.split(" ").map(c => c.toLowerCase()).join("_")
            });
        })


    }
    ngAfterViewInit(){
      this.route.queryParams.subscribe((data:any) => {
        switch (parseInt(data.error)){
          case 1:
            this.limeProxiesService.notifyBarNew("Invalid Email or Name", "error");
            break;
        }
      });
    }

    goNext() {
        this.saveData();
        //this.stepId++;
        //this.router.navigate([`/login/create/step/${this.stepId}`]);
    }

    saveData() {
        let profileUpdateObj = {};
        for (let property in this.signUpData) {
            if (this.signUpData.hasOwnProperty(property)) {
                // do stuff
                if (property != undefined) {
                    profileUpdateObj[property] = this.signUpData[property];
                }
            }
        }

        this.limeProxiesService.updateUserProfile(profileUpdateObj)
            .subscribe(

            );
    }

    saveDataToLocalStorage() {
        let profileUpdateObj = {};
        for (let property in this.signUpData) {
            if (this.signUpData.hasOwnProperty(property)) {
                // do stuff
                if (this.signUpData[property] != undefined) {
                    profileUpdateObj[property] = this.signUpData[property];
                }
            }
        }

        localStorage.setItem("signUpData", JSON.stringify(profileUpdateObj));
    }

    sendValidationLinkToEmail() {
        this.limeProxiesService.signUpUserAndSendValidationTokenToEmail(this.signUpForm.value)
            .subscribe(
                success => {
                        this.limeProxiesService.showMessage(success);
                    if (success._user_message_type != "error") {
                        this.saveDataToLocalStorage();
                        this.submited = false;
                        LimeProxiesService.saveTokenAndAuthID(success.auth_token, success.auth_userid);
                        this.redirectUserToPage(this.router, '../profile');
                    }
                },
                error => this.limeProxiesService.showMessage(error)

    );

    }

    updateProfileInfo() {
        this.limeProxiesService.updateUserProfile(JSON.parse(localStorage.getItem("signUpData")))
            .subscribe(

            );
        this.saveData();
        this.limeProxiesService.notifyBarNew("Account successfully created! You will be redirected.", 'success');
        this.redirectUserToPage(this.router, '/');
    }

    selectCountry(country) {
        this.signUpData.country = country.split(": ")[1];
    }


    redirectUserToPage(router, page) {
        setTimeout(function () {
            router.navigate([page]);
        }, 3000);

    }


}
