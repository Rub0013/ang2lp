import { Component, HostBinding, trigger, state, style, transition, animate } from '@angular/core';
import { LimeProxiesService } from '../../services/limeproxies.service';
import { DialogService } from '../../services/dialog.service';
declare var $: any;

@Component({
    selector: 'products-manage',
    templateUrl: '../../templates/products/products-manage.template.html',
    animations: [
        trigger('showConfig', [
            state('false', style({
                opacity: '0',
                display: 'none'
            })),
            state('true',   style({
                opacity: '1'
            })),
            transition('* => *', animate('500ms'))
        ])
    ]
})

export class ProductsManageComponent {

    @HostBinding('class') myClass = 'page__main-col';
    public products;
    public _refresh = {
      show: false,
      id: null,
      text: '',
    };
    noProducts = false;


    constructor(public limeProxiesService: LimeProxiesService, public dialogService: DialogService){
       this.limeProxiesService.getAllProducts().subscribe(data => {
           this.products = data;
           if (data.length == 0) {
               this.noProducts = true;
           }
       });
    }



    switchSocks(item) {
        item.socks = !item.socks;
        this.limeProxiesService.changeSock.next(item);
    }
    refreshProduct() {
      if (this._refresh.text.length <= 250 && this._refresh.text.length > 0) {
      this.limeProxiesService.refreshProduct(this._refresh.id, this._refresh.text)
        .subscribe(data => this.limeProxiesService.showMessage(data), error => console.log(error));
        this.closeRefresh();
      }
    }
    closeRefresh() {
        this._refresh.show = false;
        this._refresh.text = '';
    }

    showRefresh(id: number) {
      this._refresh.id = id;
      this._refresh.show = true;
    }

    showRenew(id: number) {
      this.limeProxiesService.showRenew(id).subscribe(data => {
        this.limeProxiesService.showMessage(data);
        if (data['_user_message_type'] === 'success') {
          this.limeProxiesService._updateUserNotifications.next();
          this.products = this.limeProxiesService.getAllProducts();
        }
      }, error => console.log(error));
    }

    ckeckStatus(id) {
        this.limeProxiesService.ckeckProductStatus(id).subscribe((data: any[]) => {
            const table = `<table class="table table--highlight current-products">
            <thead class="table__header table__header--small">
                <tr>
                    <th class="table__cell">Proxy</th>
                    <th class="table__cell">Status</th>
                </tr>
            </thead>
            <tbody class="table__body">
            ${data.map((row) => {
                return `<tr>
                            <td class="table__cell">${row.proxy}</td>
                            <td class="table__cell"><img src="assets/images/${row.status ? 'green' : 'red'}dot.png"></td>
                        </tr>`;
            }).join('')}
            </tbody>
        </table>`;
            this.dialogService.confirm('Status', table, {isConfirm: false, style: {height: 410 + 'px'}});
        });
    }

    downloadProduct(id) {
        this.limeProxiesService.downloadProduct(id).subscribe(data => {
            const blob = new Blob([data], {type: 'text/plain'});
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            document.body.appendChild(a);
            a.style.display = 'none';
            a.href = url;
            a.download = `product-${id}.txt`;
            a.click();
            window.URL.revokeObjectURL(url);
        });
    }
    switchRenewal(item) {
        const temp = !item.auto;
        this.limeProxiesService.changeRenewal.next({state: temp, id: item.id});
        item.auto = temp;
    }
}
