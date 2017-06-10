import { Component, HostBinding, AfterViewInit } from '@angular/core';
declare let $: any;

@Component({
    selector: 'help-sidebar',
    templateUrl: '../../templates/help/help-sidebar.template.html'
})

export class HelpSidebarComponent implements AfterViewInit {

    @HostBinding('class') sidebarClass = 'page__sidebar-col';

    ngAfterViewInit() {
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
    }
}
