import {Component, HostBinding, Input, OnInit, ViewChild} from '@angular/core';
import { LimeProxiesService } from '../../services/limeproxies.service';
import { UserAccount } from '../../entities/user-account';
import {AccountSidebarComponent} from "./account-sidebar.component";
declare var $: any;

@Component({
    selector: 'my-account',
    templateUrl: '../../templates/account/my-account.template.html'
})

export class MyAccountComponent implements OnInit {

    @HostBinding('class') productsClass = 'page__main-col';
  @ViewChild('accountSidebar') accountSidebar:AccountSidebarComponent;


  private user_acc: UserAccount;

    private selected_auth_method;
    private selected_access_type;
    private selected_quota;

    private access_type_btn_name: string = "REQUEST UPDATE";
    private quota_btn_name: string = "REQUEST UPDATE";

    private quota;
    private quota_size = "mb";
    private user_auth_method;
    private user_access_type;

    private successMessage;
    private errorMessage;

    private profiles_auth_methods = [
        {display: "ip based", value: "ip"}
        , {display: "user based", value: "user"}
    ];

    private profile_access_types = [
        {display: "whitelist", value: "whitelist"},
        {display: "full access", value: 'blacklist'}
    ];

    private profile_quotas = [
        {display: "100 MB", value: "100"},
        {display: "250 MB", value: "250"},
        {display: "500 MB", value: "500"},
        {display: "1 GB", value: "1000"},
        {display: "5 GB", value: "5000"},
        {display: "1 TB", value: "1000000"},
        {display: "Unlimited", value: "unlimited"}
    ];


    constructor(private limeProxiesService: LimeProxiesService) {
        this.user_acc = new UserAccount(
            "whitelist",
            "ip",
            "0",
            "0",
            "no",
            "0",
            "0000-00-00 00:00:00"
        );
    }


    updateAuthMethod() {
        let obj = {};
        if (this.selected_auth_method != this.user_acc.auth_method)
            obj["auth_method"] = this.selected_auth_method;

        //TODO password
        console.log("this.selected_auth_method", this.selected_auth_method);
        if (Object.keys(obj).length === 0)
            return;

        this.limeProxiesService.updateUserAccount(true, obj)
            .subscribe(
                //success
                success => {
                  this.user_auth_method = success.auth_method;
                  this.accountSidebar.updateUserSubject();
                  this.limeProxiesService.showMessage(success);
                },
                error => {
                    this.limeProxiesService.showMessage(error);

                }
            );
    }

    requestUpdateAccessType() {
        let obj = {};
        if (this.selected_access_type != this.user_acc.access_type)
            obj["access_type"] = this.selected_access_type;

        //TODO password
        console.log(obj);
        if (Object.keys(obj).length === 0)
            return;

        this.limeProxiesService.updateUserAccount(false, obj)
            .subscribe(
                success => {
                  this.accountSidebar.updateUserSubject();
                  this.user_auth_method = success.auth_method;
                    this.limeProxiesService.showMessage(success);
                    this.access_type_btn_name = "PENDING UPDATE";
                },
                error => {
                    this.limeProxiesService.showMessage(error, 'error');
                }
            );


    }

    requestUpdateQuota() {
        let obj = {};
        if (this.selected_quota != this.user_acc.quota)
            obj["quota"] = this.selected_quota;

        //TODO password
        console.log(obj);
        if (Object.keys(obj).length === 0)
            return;

        this.limeProxiesService.updateUserAccount(false, obj)
            .subscribe(
                //success
                success => {
                  this.accountSidebar.updateUserSubject();
                  this.user_auth_method = success.auth_method;
                    this.limeProxiesService.showMessage(success);
                    this.quota_btn_name = "PENDING UPDATE";
                },
                //error
                error => {
                    this.limeProxiesService.showMessage(error, 'error');
                }
            );

    }


    setAuthMethodSelected(auth_method) {
        this.selected_auth_method = auth_method;

    }

    setAccessTypeSelected(access_type) {
        this.selected_access_type = access_type;

    }

    setQuotaSelected(quota) {
        this.selected_quota = quota;

    }

    /////////////////////////////////////

    setProfileQuotas(get_quota) {
        let new_quotas = [];
        if (get_quota == "unlimited") {
            this.profile_quotas = [{display: "Unlimited", value: "unlimited"}];
            return;
        }

        for (let quota of this.profile_quotas)
            if (parseInt(quota.value) >= parseInt(get_quota))
                new_quotas.push(quota);

        this.profile_quotas = new_quotas;
    }


    ngOnInit() {
        this.limeProxiesService.getUserAccount().subscribe(
            user_account_Response => {
                let usr_acc_local: any = user_account_Response;
                this.user_acc = user_account_Response;

                this.selected_auth_method = user_account_Response.auth_method;
                this.selected_access_type = user_account_Response.access_type;
                this.selected_quota = user_account_Response.quota;

                if (usr_acc_local.user_request != undefined) {
                    //this.user_acc.access_type != usr_acc.user_request.access_type && usr_acc.user_request.access_type != undefined? this.access_type_btn_name = "PENDING UPDATE":this.access_type_btn_name = "REQUEST UPDATE";

                    if (usr_acc_local.user_request.access_type != undefined) {
                        this.access_type_btn_name = "PENDING UPDATE";
                        this.selected_access_type = usr_acc_local.user_request.access_type;
                    }
                    else {
                        this.access_type_btn_name = "REQUEST UPDATE";
                        this.selected_access_type = user_account_Response.access_type;
                    }

                    if (usr_acc_local.user_request.quota != undefined) {
                        this.quota_btn_name = "PENDING UPDATE";
                        this.selected_quota = usr_acc_local.user_request.quota;
                    }
                    else {
                        this.quota_btn_name = "REQUEST UPDATE";
                        this.selected_quota = user_account_Response.quota;
                    }


                }
                this.user_auth_method = user_account_Response.auth_method;
                this.user_access_type = user_account_Response.access_type;

                this.setProfileQuotas(this.selected_quota);
            },
            //error
            error => console.log(error)
            //complited
        );
    }
}
