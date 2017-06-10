import { Component, HostBinding, OnInit } from '@angular/core';
import { LimeProxiesService } from '../../services/limeproxies.service';
import { UserAccount } from '../../entities/user-account';

@Component({
    selector: 'user-whitelist',
    templateUrl: '../../templates/account/user-whitelist.template.html'
})

export class UserWhitelistComponent implements OnInit {

    @HostBinding('class') productsClass = 'page__main-col';
    private errorMessage;
    private successMessage;

    private user_auth_method;
    private user_access_type;

    private whitelist = [];

    constructor(private limeProxiesService: LimeProxiesService) {
    }


    ngOnInit() {
        this.limeProxiesService.userSubject.subscribe(
            user => {
                this.user_auth_method = user.auth_method;
                this.user_access_type = user.access_type;
            },
            error => this.errorMessage = error
        );
        this.getMyWhitelist();
    }

    addToWhiteList(address) {
        if (this.limeProxiesService.domainValidate(address) || this.limeProxiesService.validateIPaddress(address)) {
            let exists: boolean = false;
            for (let obj of this.whitelist) {
                if (obj.key == address) {
                    exists = true;
                    break;
                }
            }
            if (!exists) {
                this.whitelist.push(
                    {
                        key: address,
                        initialColor: "#1b4",
                        currentColor: "#1b4"
                    }
                );
                this.errorMessage = "";
            }
            else this.errorMessage = address + " already exists in your list!";
        }
        else this.errorMessage = "Invalid address!";

    }

    remove(obj) {
        let ip_address = obj.key;
        for (let element of this.whitelist) {
            let key = element.key;
            if (key == ip_address) {
                let val = element.currentColor;
                if (val == "#f66") //DELETED aka RED
                    element.currentColor = element.initialColor;
                else
                    element.currentColor = "#f66";
            }
        }
    }

    updateWhitelist() {
        let arr = [];
        for (let element of this.whitelist)
            if (element.currentColor != "#f66")//is it deleted
                arr.push(element.key);

        this.limeProxiesService.updateProxyWhitelist(arr)
            .subscribe(
                success => {
                    this.limeProxiesService.showMessage(success);
                    this.whitelist = [];
                    let arr = success.white_list.split(" ");
                    arr.forEach(element => {
                        this.whitelist.push(
                            {
                                key: [element],
                                initialColor: "#f0f4f7",
                                currentColor: "#f0f4f7"
                            }
                        );
                    });

                },
                error => {
                    this.limeProxiesService.showMessage(error);
                }
            );
    }


    getMyWhitelist() {
        this.limeProxiesService.getMyWhitelist()
            .subscribe(
                //success
                obj => {
                    let arr = obj.white_list.split(" ");
                    arr.forEach(element => {
                        this.whitelist.push(
                            {
                                key: [element],
                                initialColor: "#f0f4f7",
                                currentColor: "#f0f4f7"
                            }
                        );
                    });
                }
                //error

            );
    }
}