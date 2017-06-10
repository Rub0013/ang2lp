import { Component, Input } from '@angular/core';

@Component({
    selector: '.home-main',
    templateUrl: '../../templates/home/home-main-content.template.html'
})

export class HomeMainContentComponent {

    @Input() active;
    @Input() credit;
    @Input() renewal;
    @Input() validatePhone;
    @Input() products;


}
