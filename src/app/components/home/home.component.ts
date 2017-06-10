import { Component, HostBinding, OnInit } from '@angular/core';
import { LimeProxiesService } from '../../services/limeproxies.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Product } from '../../entities/product';

@Component({
    selector: '.home-component',
    templateUrl: '../../templates/home/home.template.html'
})

export class HomeComponent implements OnInit {

    @HostBinding('class') homeClass = 'page__content-inner';
    numberOfDegreesForFunc: any;
    numberOfDegreesToShow: any;
    transformString: any;
    chartClass = "usage-stats__chart";

    private quota;
    private traffic;

    private active;
    private credit;
    private renewal;
    private verified: boolean = true;
    private products: Product[];

    constructor(private limeProxiesService: LimeProxiesService, private sanitizer: DomSanitizer) {
    }

    calculate() {
        this.numberOfDegreesToShow = (this.traffic / this.quota) * 100;
        this.numberOfDegreesToShow = this.numberOfDegreesToShow.toFixed(1);

        if (this.traffic / this.quota > 0.5) {

            this.numberOfDegreesForFunc = (this.traffic / this.quota) * 380;
            this.numberOfDegreesForFunc -= 180;
            this.chartClass = "usage-stats__chart usage-stats__chart--over-50";
        }
        else {
            this.numberOfDegreesForFunc = (this.traffic / this.quota) * 180;
        }

        this.transformString = "transform: rotate(" + this.numberOfDegreesForFunc.toFixed(1) + "deg)";
        this.transformString = this.sanitizer.bypassSecurityTrustStyle(this.transformString);
    }

    ngOnInit() {
        this.getOverview();
        this.getUserTraffic();
    }

    getOverview() {
        this.limeProxiesService.getUserOverview()
            .subscribe(
                //success
                data => {
                    this.active = data.active;
                    this.credit = data.credit;
                    this.renewal = data.renewal;
                    this.verified = data.verified;
                    this.products = data.products;
                }
                //error
            );
    }

    getUserTraffic() {
        this.limeProxiesService.getUserTraffic()
            .subscribe(
                result => {
                    this.quota = result.quota;
                    this.traffic = result.traffic;
                    this.calculate();
                }
                //error
            );
    }

}
