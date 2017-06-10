import {AfterViewInit, Component, HostBinding, Input, OnInit} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Http } from '@angular/http';
import { LimeProxiesService } from '../../services/limeproxies.service';

@Component({
    selector: 'add-new-sidebar',
    templateUrl: '../../templates/billing/add-new-sidebar.template.html'
})

export class BillingAddNewSidebarComponent implements AfterViewInit, OnInit {

    @HostBinding('class') sidebarClass = 'page__sidebar-col';

    @Input() productForm: FormGroup;
    @Input() type = 'fastspring';

    public count;
    public nowProdTime: number;


    public user: any = {};

    constructor(public limeProxiesService: LimeProxiesService, public http: Http) {
    }

    ngOnInit() {
        this.limeProxiesService.getUserProfile().subscribe(success => {
            this.user = success;
            // this.user.phone = this.limeProxiesService.getPhoneCC(success.country) + success.phone;
            this.user.phone = success.phone;
        });
        this.nowProdTime = Math.floor( Date.now() / 1000 );
    }

    ngAfterViewInit() {
      // (<any>window).fastspring.builder.reset();
    }

    doPayment() {
      console.log(this.productForm);
        // this.limeProxiesService.showCardPayment = true;
    }
}
