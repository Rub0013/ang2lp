import { Component, HostBinding, AfterViewInit } from '@angular/core';
declare let $: any;

@Component({
    selector: 'affiliate-stats',
    templateUrl: '../../templates/affiliate/affiliate-stats.template.html'
})

export class AffiliateStatsComponent implements AfterViewInit {

    @HostBinding('class') myClass = 'page__main-col';

    ngAfterViewInit() {

        function getRandomIntInclusive(min, max) {
            min = Math.ceil(min);
            max = Math.floor(max);
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }


        // Affiliate Stats chart functionality with random data
        // remove in production
        $('.affiliate-chart__nav').on('click', 'a', function (e) {
            e.preventDefault();

            $('.affiliate-chart__bar').each(function () {
                var height = 'height: ' + getRandomIntInclusive(0, 100) + '%;';
                $(this).attr('style', height);
            });
        });
    }


}