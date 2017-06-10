import { Component, HostBinding } from '@angular/core';


@Component({
    selector: 'main-frame',
    templateUrl: '../../templates/main-frame/main-frame.template.html'
})

export class MainFrameComponent {

    @HostBinding('class') mainFrameClass = 'page';
}
