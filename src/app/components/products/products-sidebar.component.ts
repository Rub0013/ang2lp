import { Component, EventEmitter, HostBinding, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { LimeProxiesService } from '../../services/limeproxies.service';
import { Http } from '@angular/http';
import { Router } from '@angular/router';
declare const $: any;

@Component({
    selector: 'products-sidebar',
    templateUrl: '../../templates/products/products-sidebar.template.html'
})
export class ProductsSidebarComponent implements OnInit {

    @HostBinding('class') sidebarClass = 'page__sidebar-col';
    @Input() productForm: FormGroup;
    @Output() clearForm = new EventEmitter();
    public userInfo: any = {};
    public nowProdTime: number;
    public productInvoice: string;
    public productInvoiceGettted = false;

    constructor(public limeProxiesService: LimeProxiesService, public http: Http, private router: Router) {
    }

    ngOnInit() {
        this.limeProxiesService.getUserProfile().subscribe(success => {
            this.userInfo = success;
            // this.userInfo.phone = this.limeProxiesService.getPhoneCC(success.country) + success.phone;
            this.userInfo.phone = success.phone;
        });
        this.nowProdTime = Math.floor( Date.now() / 1000 );
    }

    productPath() {
        if (this.productForm.value.payment_method.value == 'one_time') {
            return '/1credit';
        } else {
            if (this.productForm.value.payment_method.value == 'recurring') {
                return '/1credit-auto';
            }
        }

    }

    newProduct(event: Event, selector) {
        const block = $('#' + selector);
        if (this.productInvoiceGettted === false) {
            this.productInvoiceGettted = true;
            event.preventDefault();
            const newProduct = this.productForm.value;
            if (newProduct.proxy_num && this.productForm.value.locations.length > 0) {
                const proxy_num = newProduct.proxy_num.name;
                const no = proxy_num.split(' ')[0];
                const type = proxy_num.split(' ')[1].toLowerCase();
                const payment = newProduct.payment.value;
                const locationsString = this.getLocationsCodes();
                this.limeProxiesService.orderProduct(no, type, locationsString, payment).subscribe(data => {
                    this.productInvoice = data.oid;
                    block.click();
                    this.productInvoiceGettted = false;
                });
            } else {
                console.log('Choose something!!!');
            }
        }
    }

    newCreditProduct() {
        const newProduct = this.productForm.value;
        if (newProduct.proxy_num && this.productForm.value.locations.length > 0) {
            const proxy_num = newProduct.proxy_num.name;
            const no = proxy_num.split(' ')[0];
            const type = proxy_num.split(' ')[1].toLowerCase();
            const payment = newProduct.payment.value;
            const locationsString = this.getLocationsCodes();
            this.limeProxiesService.orderProduct(no, type, locationsString, payment).switchMap(data => {
                return this.limeProxiesService.orderCreditProduct(data.oid);
            }).subscribe(success => {
                if (success._user_message_type == 'success') {
                    this.router.navigate(['/products/', 'manage']);
                    this.limeProxiesService.showMessage(success);
                }
            });
        } else {
            console.log('Choose something!!!');
        }
    }

    get showLocations(){
        if (this.productForm.value.locations) {
            return this.productForm.value.locations.map(row => {
                return row.state ? row.state : this.limeProxiesService.getFullCountryName(row.country);
            }).join(', ');
        } else {
            return '';
        }
    }

    getLocationsCodes () {
        if (this.productForm.value.locations) {
            return this.productForm.value.locations.map(row => {
                if (row.country == 'US') {
                    return row.country + ' ' + row.state;
                } else {
                    return row.country;
                }
            }).join();
        } else {
            return '';
        }
    }

    getNumbers(value: string) {
      return value ? value.match(/\d+/g) : 0;
    }
}
