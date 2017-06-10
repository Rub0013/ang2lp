import { Component } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';

@Component({
    selector: '.dashboard',
    templateUrl: '../../templates/main-frame/dashboard-nav.template.html'
})


export class DashboardNavComponent {

    activePage = 'home';

    isActive = [
        {key: 'home', value: ''},
        {key: 'products', value: ''},
        {key: 'account', value: ''},
        {key: 'billing', value: ''},
        {key: 'affiliate', value: ''},
        {key: 'support', value: ''}
    ];

    constructor(private route: ActivatedRoute, private router: Router) {
        router.events.subscribe((val) => {
            // see also
            //console.log(val instanceof NavigationEnd)
            this.routeChanged(val.url);
        });

    }

    linkActivated(page) {
        this.activePage = page;
    }

    routeChanged(url) {
        let navActive = false;
        for (const pg of this.isActive) {
            if (url.indexOf(pg.key) != -1) {
                pg.value = 'dashboard__link--active';
                navActive = true;
            } else {
                pg.value = '';
            }
        }

        if (!navActive)
            this.activePage = '';
    }


}
