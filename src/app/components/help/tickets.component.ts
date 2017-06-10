import { Component, AfterViewInit, HostBinding, OnInit } from '@angular/core';
import { LimeProxiesService } from '../../services/limeproxies.service';
import { Ticket } from '../../entities/ticket';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

// import arrayContaining = jasmine.arrayContaining;
declare let $: any;


@Component({
    selector: 'tickets',
    templateUrl: '../../templates/help/tickets.template.html'
})

export class TicketsComponent implements AfterViewInit, OnInit {

    @HostBinding('class') myClass = 'page__main-col';

    constructor(private limeProxiesService: LimeProxiesService, private route: ActivatedRoute, private router: Router) {}

    ngOnInit() {
        this.limeProxiesService.getTickets();
        this.route
            .queryParams
            .subscribe((params) => {
            if ( params['addTicket'] ) {
                $('.open-ticket').addClass('popup--show');
            }
        });
    }

    firstToUpperCase(str: string) {
        return str.substr(0, 1).toUpperCase() + str.substr(1);
    }

    ngAfterViewInit() {

        $('.toggle-grid__item').on('click', function (e) {
            e.preventDefault();
            const target = $(this),
                grid = target.closest('.toggle-grid'),
                maxSelect = parseInt(grid.attr('data-max-select'), 10) || false;

            // When clicking the input that resets other selected options
            if (target.attr('data-reset-selected') !== undefined) {
                target.siblings().removeClass('toggle-grid__item--active')
                    .find('input').prop('checked', false);
            }

            if (maxSelect) {
                if (maxSelect > target.siblings('.toggle-grid__item--active').length) {
                    const input = target.find('input');
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
            const toggle = $(this),
                index = toggle.index(),
                nav = toggle.closest('.tab__nav'),
                content = $('.tab__content-wrapper');

            nav.children().removeClass('tab__toggle--active');
            toggle.addClass('tab__toggle--active');

            content.children().removeClass('tab__content-block--active').eq(index).addClass('tab__content-block--active');
        });


    }

    cacheAndRedirect(ticket: Ticket) {
        this.limeProxiesService.cacheTicket(ticket);
        const navigationExtras = {
            queryParams: { 'id': ticket.id }
        };
        this.router.navigate(['/support/', 'chat'], navigationExtras);
    }

    close(ticket: Ticket) {
        this.limeProxiesService.closeTicket(ticket.id).subscribe( data => {
            if (data._user_message_type === 'success') {
                this.limeProxiesService.removeFromOpened(ticket);
            }
        });
    }
}
