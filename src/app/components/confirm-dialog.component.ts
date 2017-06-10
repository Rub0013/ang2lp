import { Component } from "@angular/core";
import { DialogService } from "../services/dialog.service";

@Component({
    selector: 'confirm-dialog-modal',
    template: `
<div id="modal" class="modal-overlay">
  <div class="modal" [ngStyle]="dialogService.style">
    <div class="modal-content">
        <div class="modal-header">
            <h4 class="modal-title">{{dialogService.dialogHeader}}</h4>
        </div>
        <div class="modal-body">
            <div class="modal-txt" [ngStyle]="dialogService.p" [ngClass]="{'text-center': dialogService.isConfirm}" [innerHtml]="dialogService.dialogMessage"></div>
        </div>
    </div>
    <div *ngIf="dialogService.isConfirm" class="modal-footer">
      <a (click)="reject()" class="modal-action modal-close waves-effect waves-green btn-flat">No</a>
      <a (click)="confirm()" class="modal-action modal-close waves-effect waves-green btn-flat">Yes</a>
    </div>
    <div *ngIf="!dialogService.isConfirm" class="modal-footer">
      <a (click)="reject()" style="width: 100%" class="modal-action modal-close waves-effect waves-green btn-flat">Close</a>
    </div>
  </div>
  </div>
  `,
})
export class ConfirmDialog {
    constructor(public dialogService: DialogService) {
    }

    confirm() {
        this.dialogService.dialogConfirmation();
    }

    reject() {
        this.dialogService.dialogRejection();
    }
}