import { Component, AfterViewInit, OnDestroy } from '@angular/core';
declare let $: any;


@Component({
    selector: 'page-500',
    templateUrl: '../../templates/error.500.template.html',
    styleUrls: ['../../styles/error-500-style.css']
})

export class Error500Component implements AfterViewInit, OnDestroy {

    ngAfterViewInit() {
        $('body').css('background', '#78ad30')
    }

    ngOnDestroy() {
        $('body').css('background', 'none')

    }

}