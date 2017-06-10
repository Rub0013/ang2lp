import { Component } from '@angular/core';
import { DialogService } from "../services/dialog.service";

@Component({
    selector: 'app-root',
    templateUrl: '../templates/app.template.html'
})


export class AppComponent {

    constructor(public dialogService: DialogService) {
    }

}