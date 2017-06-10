import {Component, AfterViewInit, HostBinding, OnDestroy} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Subscription} from "rxjs/Subscription";
import {LimeProxiesService} from "../../services/limeproxies.service";
declare var $: any;

@Component({
    selector: 'faq',
    templateUrl: '../../templates/help/faq.template.html'
})

export class FaqComponent implements AfterViewInit, OnDestroy {


    @HostBinding('class') myClass = 'page__main-col';

    private subsc:Subscription;

    constructor(private route: ActivatedRoute, private _limeService: LimeProxiesService){}

    ngOnDestroy(){
      this.subsc.unsubscribe();
    }

    ngAfterViewInit() {

        $('.toggle-grid__item').on('click', function (e) {
            e.preventDefault();
            let target = $(this),
              grid = target.closest('.toggle-grid'),
              maxSelect = parseInt(grid.attr('data-max-select'), 10) || false;

            // When clicking the input that resets other selected options
            if (target.attr('data-reset-selected') !== undefined) {
                target.siblings().removeClass('toggle-grid__item--active')
                    .find('input').prop('checked', false);
            }

            if (maxSelect) {
                if (maxSelect > target.siblings('.toggle-grid__item--active').length) {
                    let input = target.find('input');
                    target.toggleClass('toggle-grid__item--active');
                    input.prop('checked', !input.prop('checked'));
                }
            } else {
                target.siblings().removeClass('toggle-grid__item--active')
                    .find('input').prop('checked', false);
                target.addClass('toggle-grid__item--active')
                    .find('input').prop('checked', true);
            }
        });


        // Tab functionality
        $('.tab__toggle').on('click', function () {
            let toggle = $(this),
              index = toggle.index(),
              nav = toggle.closest('.tab__nav'),
              content = $('.tab__content-wrapper');

            nav.children().removeClass('tab__toggle--active');
            toggle.addClass('tab__toggle--active');

            content.children().removeClass('tab__content-block--active').eq(index).addClass('tab__content-block--active');
        });

        // FAQ Q&A blocks accordion
        $('.faq-block--answer').on('click', function () {
            $(this).siblings('.faq-block--active').removeClass('faq-block--active').find('.block__desc').slideUp();
            if($(this).hasClass('faq-block--active')){
              $(this).removeClass('faq-block--active').find('.block__desc').slideUp();
            }else {
              $(this).addClass('faq-block--active').find('.block__desc').slideDown();
            }
        });


      this.subsc =  this.route.queryParams.subscribe((params:any) => {
        if(params.id){
          let selector = '.support.'+params.id;
          $(selector).trigger('click');
        }
      });

    }
}
