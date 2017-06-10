import {Component, HostBinding, AfterViewInit, ViewChildren, OnInit} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {LimeProxiesService} from '../../services/limeproxies.service';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'billing-add-new',
    templateUrl: '../../templates/billing/billing-add-new.template.html'
})

export class BillingAddNewComponent implements AfterViewInit, OnInit {

    @HostBinding('class') myClass = 'page__main-col';
    @ViewChildren('liPayment') payments;
    fastSpringForm: FormGroup;
    type = 'fastSpring';

    constructor(public fb: FormBuilder, public limeProxiesService: LimeProxiesService, private route: ActivatedRoute) {
        this.fastSpringForm = fb.group({
            num: [5],
            other_num: [''],
            tos: [false, [Validators.required]]
        });
    }
    ngOnInit() {

    }
    ngAfterViewInit() {
    }
}
