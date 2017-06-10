import { Component, HostBinding, AfterViewInit } from '@angular/core';
import { LimeProxiesService } from '../../services/limeproxies.service';

@Component({
    selector: 'products',
    templateUrl: '../../templates/products/products.template.html'
})

export class ProductsComponent {

    @HostBinding('class') myClass = 'page__content-inner';

    constructor(public limeProxiesService: LimeProxiesService) {
    }

}