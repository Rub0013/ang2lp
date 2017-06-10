import { Component, Input } from "@angular/core";
import { LimeProxiesService } from "../services/limeproxies.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Http } from "@angular/http";
import { MyValidators } from "../custom-validators/custom.validator";

@Component({
    selector: 'card-payment',
    templateUrl: '../templates/card-payment.template.html',

})
export class cardPaymentDialog {
    public ip = 1;
    public cardPaymentForm:FormGroup;
    @Input() public productForm:FormGroup;
    @Input() public type:string;

    constructor(public limeProxiesService: LimeProxiesService, public fb: FormBuilder, public http: Http) {
        this.cardPaymentForm = fb.group({
            name: ['', Validators.required],
            number: ['', [MyValidators.pattern(/^\d{12}$/)]],
            expiry: ['', [MyValidators.pattern(/^\d{2}\/\d{2}$/)]],
            cvc: ['', [MyValidators.pattern(/^\d{3,4}$/)]],
        });
    }

    send() {
        console.log(this.cardPaymentForm);
        console.log(this.cardPaymentForm.get('number'));
        let price = this.productForm.get('num').value || this.productForm.get('other_num').value || 0;
        if(price && this.cardPaymentForm.valid){
            // let data =  {...this.cardPaymentForm.value, price};
            // console.log(data);
            this.limeProxiesService.showCardPayment = false;
        }
    }
}
