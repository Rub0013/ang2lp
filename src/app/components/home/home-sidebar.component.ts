import { Component, Input } from '@angular/core';

@Component({
    selector: '.home-sidebar',
    templateUrl: '../../templates/home/home-sidebar.template.html'
})

export class HomeSidebarComponent {

    @Input() numOfDeg: any;
    @Input() numOfDegreesToShow: number;
    @Input() chartClass: string;

}
