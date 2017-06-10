import {Component, AfterViewInit, HostBinding, ViewChild, ElementRef, OnInit} from '@angular/core';
import { LimeProxiesService } from '../../services/limeproxies.service';
import * as moment from 'moment';
import { Ticket } from '../../entities/ticket';
declare const $: any;

@Component({
    selector: 'support',
    templateUrl: '../../templates/help/help.template.html'
})

export class HelpComponent implements AfterViewInit, OnInit {


    @HostBinding('class') myClass = 'page__content-inner';
    @ViewChild('supportFile') supportFile: ElementRef;

    private ticket_type;
    private ticket_subject;
    private ticket_message;
    public disabled = false;
    public second = false;
    public third = false;
    public openedInputFields = 1;
    public attachedFiles: any = [];

    TICKET_TYPES = [
        {
            label: 'Sales',
            value: 'sales'
        },
        {
            label: 'Support',
            value: 'support'
        },
        {
            label: 'Billing',
            value: 'billing'
        },
        {
            label: 'Other',
            value: 'other'
        }

    ];

    constructor(private limeProxiesService: LimeProxiesService) {
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

        // Popup toggler functionality
        $('.popup-toggle').on('click', function (e) {
            e.preventDefault();
            const toggler = $(this),
                target = $(toggler.attr('data-popup-target'));

            target.addClass('popup--show');
        });

        $('.popup__dismiss').on('click', function (e) {
            e.preventDefault();
            $(e.target).closest('.popup').removeClass('popup--show');
        });

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

    }

    ngOnInit() {
        this.limeProxiesService.getTickets();
    }

    removeInputField() {
        this.openedInputFields -= 1;
        if (this.openedInputFields == 2) {
            this.third = false;
            delete this.attachedFiles['third'];
        } else {
            this.second = false;
            delete this.attachedFiles['second'];
        }
    }

    addInputField() {
        this.openedInputFields += 1;
        if (this.openedInputFields == 2){
            this.second = true;
        } else {
            this.third = true;
        }
    }

    onChange(event, currentInput) {
        const file = event.srcElement.files;
        const label = $('.' + currentInput + ' .label'),
            selected = $('.' + currentInput + ' .input-file__selected');
        const key = currentInput.split('-')[2];
        if (file.length) {
            selected.removeClass('hide').text(file[0].name);
            label.addClass('hide');
            this.attachedFiles[key] = file[0];
        } else {
            selected.addClass('hide');
            label.removeClass('hide');
            delete this.attachedFiles[key];
        }
    }

    sendTicket() {
        if (this.ticket_subject && this.ticket_message && this.ticket_type) {
            this.disabled = true;
            this.limeProxiesService.newTicket(this.ticket_type, this.ticket_subject, this.ticket_message)
                .subscribe(
                    data => {
                        if (data._user_message_type == 'success') {
                            const date = moment(new Date()).format('YYYY-MM-DD hh:mm:ss');
                            const ticket = new Ticket(this.ticket_message, 'new', this.ticket_subject, date, data.id);
                            this.limeProxiesService.addToOpenTickets(ticket);
                            this.ticket_subject = '';
                            this.ticket_message = '';
                            this.ticket_type = '';
                        }
                        $('.open-ticket').removeClass('popup--show');
                        this.limeProxiesService.showMessage(data);
                        this.disabled = false;
                    }
                );
        }
    }
}
