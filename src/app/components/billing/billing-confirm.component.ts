import { Component, OnInit } from '@angular/core';
import { LimeProxiesService } from '../../services/limeproxies.service';
import { Router, ActivatedRoute } from '@angular/router';


@Component({
    selector: 'token-confirm',
    template: ''
})
export class BillingConfirmComponent implements OnInit {

    private token: string;

    constructor(private router: Router, private route: ActivatedRoute, private limeProxiesService: LimeProxiesService) {
    }

    ngOnInit() {
        this.route
            .params
            .switchMap((params) => {
                this.token = params['token'];
                return this.limeProxiesService.getBillingConfirm(this.token);
            })
            .subscribe((data: any) => {
                if (localStorage.getItem('token')) {
                    this.router.navigateByUrl('/billing/history').then(() => this.limeProxiesService.showMessage(data));
                } else {
                    this.router.navigateByUrl('/login').then(() => this.limeProxiesService.showMessage(data));
                }
            });
    }


}
