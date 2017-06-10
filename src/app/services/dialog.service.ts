import { Injectable } from "@angular/core";
declare var $: any;

@Injectable()
export class DialogService {
  public dialogHeader:string;
  public dialogMessage:string;
  public dialogConfirmation: () => void;
  public dialogRejection: () => void;
  public isConfirm = true;
  public style;
  public p;

  confirm(titlebar: string, message: string, { isConfirm = true, withEnter = false, style = {}, p = {}}) {
    this.dialogHeader = titlebar;
    this.style = style;
    this.p = p;
    this.dialogMessage = !withEnter ? message : message.replace(/(?:\r\n|\r|\n)/g, '<br />');
    this.isConfirm = isConfirm;

    return new Promise<boolean>((resolve, reject) =>{
      this.dialogConfirmation = () => resolve(true);
      this.dialogRejection = () => resolve(false);

       $('#modal').fadeIn();
    }).then(val => {
        $('#modal').fadeOut(() => {
            this.dialogHeader = '';
            this.style = {};
            this.dialogMessage = '';
            this.isConfirm = true;
        });
        return val;
    });
  };
}