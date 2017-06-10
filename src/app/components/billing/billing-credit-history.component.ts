import {Component, HostBinding, OnDestroy, AfterViewInit, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Subscription} from 'rxjs/Rx';
import {LimeProxiesService} from '../../services/limeproxies.service';

@Component({
  selector: 'billing-credit-history',
  templateUrl: '../../templates/billing/billing-credit-history.template.html'
})

export class BillingCreditHistoryComponent implements OnDestroy, AfterViewInit, OnInit {

  @HostBinding('class') myClass = 'page__main-col';
  public subscription: Subscription;
  public history: Array<any>;
  public historyFull = false;
  public historyEmpty = false;

  constructor(public limeProxiesService: LimeProxiesService, public route: ActivatedRoute) {

  }

  ngOnInit() {
    this.limeProxiesService.getbillingHistory().subscribe(data => {
      this.history = data;
      if (data.length > 0) {
        this.historyFull = true;
      } else {
        this.historyEmpty = true;
      }
    });
  }

  ngAfterViewInit() {
    this.subscription = this.route.queryParams.subscribe((params: any) => {
      switch (params.paypal) {
        case 'cancel':
          this.limeProxiesService.notifyBarNew('Your PayPal payment was cancelled, no credit will be added !', 'info');
          break;
        case 'success':
          this.limeProxiesService.notifyBarNew('Your PayPal payment was completed successfully, you will receive your credits soon !', 'success');
          break;
      }
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
