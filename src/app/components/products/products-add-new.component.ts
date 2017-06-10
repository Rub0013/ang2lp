import { Component, HostBinding, AfterViewInit } from '@angular/core';
import { OrderReviewService } from '../../services/order-review.service';
import { LimeProxiesService } from '../../services/limeproxies.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
declare var $: any;

@Component({
    selector: 'products-add-new',
    templateUrl: '../../templates/products/products-add-new.template.html'
})
export class ProductsAddNewComponent implements AfterViewInit {


    @HostBinding('class') myClass = 'page__main-col';

    pageName = 'private';
    availableCredits: number;

    premium_locs_max_number = 2;
    private_locs_max_number = 2;

    locs_max_number = 2;
    newProductForm: FormGroup;
    canAddLocation: boolean;

    public payment_method = [
        {
            value: 'recurring',
            name: 'Recurring'
        }, {
            value: 'one_time',
            name: 'One time'
        },
    ];

    paymentTypes = [
        {
            value: 'fastspring',
            title: 'FastSpring',
            img: 'assets/images/payment/fastspring.png'
        },
        {
            value: 'bitcoin',
            title: 'BitCoin',
            img: 'assets/images/payment/bitcoin.png'
        },
        {
            value: 'paypal',
            title: 'PayPal',
            img: 'assets/images/payment/paypal.png'
        }
    ];
    paymentTypesWithCredits = [
        {
            value: 'credit',
            title: 'Credit',
            img: 'assets/images/payment/credit.png'
        },
        {
            value: 'fastspring',
            title: 'FastSpring',
            img: 'assets/images/payment/fastspring.png'
        },
        {
            value: 'bitcoin',
            title: 'BitCoin',
            img: 'assets/images/payment/bitcoin.png'
        },
        {
            value: 'paypal',
            title: 'PayPal',
            img: 'assets/images/payment/paypal.png'
        }
    ];
    credits = {
        title: 'Credits',
        img: 'assets/images/payment/credit.png'
    };
    locations = [];


    constructor(public limeProxiesService: LimeProxiesService,
                public _fb: FormBuilder) {

        this.newProductForm = _fb.group({
            payment: [null, [Validators.required]],
            proxy_num: [null, [ Validators.required ]],
            payment_method: [null],
            locations: [null, [ Validators.required ]],
            proxies_value: [''],
            discount: [0]
        });
        this.limeProxiesService.getUserNotification()
            .subscribe(
                data => {
                    this.availableCredits = data.credit;
                }
            );
    }

    clearForm() {
      $('.locations-list input[type=checkbox]').prop('checked', false);
      this.newProductForm.reset();
      this.locations = [];
    }

    clearPayment() {
        this.newProductForm.controls['payment'].setValue(null);
    }

    sendCoupon(coupon: HTMLInputElement) {
        this.limeProxiesService.sendCoupon(this.newProductForm.get('proxy_num').value.name, coupon.value).subscribe((data) => {
          if (data.valid) {
            this.newProductForm.patchValue({discount: data.value});
          } else {
            this.limeProxiesService.notifyBarNew('Coupon code is not valid', 'error');
          }
        }, error => console.log(error), () => coupon.value = '');
    }

    hasLocations(location) {
       return this.locations.find((value) => {
           return value === location;
        });
    }

    addLocations(location, event) {
        if (event.target.checked) {
            if (this.canCheck()) {
                this.locations.push(location);
            }else {
                event.target.checked = false;
            }
        }else {
            this.locations.splice(this.locations.indexOf(location), 1);
        }
        this.newProductForm.get('locations').patchValue(this.locations);
    }

    getImage(lang: string) {
        return `assets/images/countries/${lang.toLowerCase()}.png`;
    }

    getValue(value: string) {
        return value.toLowerCase().replace(/ /g, '_');
    }

    getNumbers(value: string) {
        return value.match(/\d+/g);
    }

    ngAfterViewInit() {
        this.limeProxiesService.showProductsSidebar = true;
    }

    canCheck() {
        return this.locations.length < this.locs_max_number;
    }
    openPage(page: string) {
        this.newProductForm.reset();
        this.pageName = page;
        this.locations = [];
    }

    selectPremiumProxiesNumber(prem_prox_num) {
      this.newProductForm.patchValue({proxies_value: ''});
      $('.locations-list input[type=checkbox]').prop('checked', false);
      this.locations = [];
      this.premium_locs_max_number = prem_prox_num.locations;
      this.locs_max_number = prem_prox_num.locations;
      this.newProductForm.controls['locations'].setValue(null);
    }

    selectPrivateProxiesNumber(priv_prox_num) {
      this.newProductForm.patchValue({proxies_value: ''});
      $('.locations-list input[type=checkbox]').prop('checked', false);
      this.locations = [];
      this.private_locs_max_number = priv_prox_num.locations;
      this.locs_max_number = priv_prox_num.locations;
      this.newProductForm.controls['locations'].setValue(null);
    }

}
