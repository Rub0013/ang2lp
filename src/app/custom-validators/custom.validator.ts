import { AbstractControl, FormControl, ValidatorFn } from '@angular/forms';

export class MyValidators {
    static validatePhone(): ValidatorFn {
        return (c: FormControl) => {
            let PHONE_REGEXP = /^\d{7,}$/;

            return PHONE_REGEXP.test(c.value==undefined?"":c.value.replace(/[\s()+\-\.]|ext/gi, '')) ? null : {
                    validatePhone: {
                        valid: false
                    }
                };
        }
    }

    static MatchPassword(AC: AbstractControl) {
        let password = AC.get('newPassword').value; // to get value in input tag
        let confirmPassword = AC.get('confirmPassword').value; // to get value in input tag
        if(password != confirmPassword) {
            AC.get('confirmPassword').setErrors( {MatchPassword: true} )
        } else {
            return null
        }
    }

    static pattern(pattern: RegExp): ValidatorFn {
        return (control: FormControl): {[key: string]: any} => {
            return control.value.match(pattern) ? null : {pattern: true};
        };
    }
    static validateIpAddress(): ValidatorFn {
        return (c: FormControl) => {
            let IPADDRESS_REGEXP = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

            return IPADDRESS_REGEXP.test(c.value) ? null : {
                    validateIpAddress: {
                        valid: false
                    }
                };
        };
    }
    static validateEmail(): ValidatorFn {
        return (control: AbstractControl): {[key: string]: any} => {
            let EMAIL_REGEXP = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

            return EMAIL_REGEXP.test(control.value) ? null : {
                    validateEmail: {
                        valid: false
                    }
                };
        };
    }
}