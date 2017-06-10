import {Component, HostBinding, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { UserAccount } from "../../entities/user-account";
import { LimeProxiesService } from "../../services/limeproxies.service";
import { DialogService } from "../../services/dialog.service";

@Component({
    selector: 'account-sidebar',
    templateUrl: '../../templates/account/account-sidebar.template.html'
})

export class AccountSidebarComponent implements OnInit {

    @HostBinding('class') sidebarClass = 'page__sidebar-col';

    private user_acc: UserAccount;
    private access_type;
    private quota;
    private quota_size = "MB";

    constructor(private limeProxiesService: LimeProxiesService, private router: Router, private dialogService: DialogService) {
    }

    updateUserSubject() {
      this.limeProxiesService.userSubject.subscribe(
        userAccount => {
          this.user_acc = userAccount;
          this.user_acc.access_type == "blacklist" ? this.access_type = "full access" : this.access_type = this.user_acc.access_type;
          let temp_quota: number = parseFloat(userAccount.quota);
          temp_quota /= 1000;
          if (temp_quota >= 1) {
            this.quota_size = "GB";
            temp_quota /= 1000;
            if (temp_quota >= 1)
              this.quota_size = "TB";
            else
              temp_quota *= 1000;
          }
          else  temp_quota *= 1000;
          this.quota = temp_quota.toString();
        },
        error => console.log(error)
      );
    }

    ngOnInit() {
        this.updateUserSubject();
    }

    deleteMyAccountPlease() {
        this.limeProxiesService.deleteMyAccount()
            .subscribe(
                success => {
                    this.limeProxiesService.showMessage(success);
                    this.redirectUserToPage(this.router, "/");
                },
                error => this.limeProxiesService.showMessage(error)
            );
    }

    openConfirm() {
        this.dialogService.confirm("CLOSE THIS ACCOUNT", 'Are you sure you want to close your account?', {
            style: {
                width: 350 + 'px',
                height: 180 + 'px'
            }
        }).then((val) => {
            if (val) {
                this.deleteMyAccountPlease();
            }
        });
    }

    redirectUserToPage(router, page) {
        setTimeout(function () {
            router.navigate([page]);
        }, 3000);

    }

}
