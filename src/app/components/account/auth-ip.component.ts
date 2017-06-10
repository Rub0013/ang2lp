import { Component, HostBinding, OnInit, Input } from '@angular/core';
import { LimeProxiesService } from '../../services/limeproxies.service';
declare var $: any;

@Component({
    selector: 'auth-ip',
    templateUrl: '../../templates/account/auth-ip.template.html'
})


export class IpAuthComponent implements OnInit {

    @HostBinding('class') productsClass = 'page__main-col';

    private errorMessage = "Current IP:";
    private successMessage;

    constructor(private limeProxiesService: LimeProxiesService) {
    }

    private user_auth_method;
    private user_access_type;

    private ip_address: any = "";

    private authorizedIPs = [];
    private addedIPs = [];
    private numberOfAuthIps = 0;
    private numOfAuthFromGet;
    private authorizedUpdates = 0;
    private updatesLeft = 0;

    private ifDisabled: string = "";

    private noUpdatesLeft = false;

    ngOnInit() {
        this.getAuthorizedIPs();
        this.limeProxiesService.userSubject.subscribe(
            //success
            user => {
                this.user_auth_method = user.auth_method;
                this.user_access_type = user.access_type;
            },
            //error
            error => console.log(error)
            //complited
        );

        this.limeProxiesService.getUserIpAddress()
            .subscribe(
                data => this.ip_address = data.ip,
                error => this.errorMessage = error
            );

    }

    setIpAddress(data) {

    }

    Add(ip_address) {
        //if number of user ips are at max
        if (this.numberOfAuthIps == 0) {
            console.log("You have reached your max authorized IPs limit");
            this.errorMessage = "You have reached your max authorized IPs limit";
            return;
        }

        if (this.updatesLeft == 0) {
            console.log("You have reached your authorized IPs updates limit");
            this.errorMessage = "You have reached your authorized IPs updates limit";
            return;
        }

        if (!this.limeProxiesService.validateIPaddress(ip_address)) {
            this.errorMessage = "Invalid IP address";
            return;
        }
        //this.addedIPs.push(ip_address);
        let exists: boolean = false;
        for (let obj of this.authorizedIPs) {
            if (obj.key == ip_address) {
                exists = true;
                break;
            }
        }
        if (!exists) {
            this.authorizedIPs.push(
                {
                    key: ip_address,
                    initialColor: "#1b4",
                    currentColor: "#1b4"
                }
            );
            this.numberOfAuthIps--;
            this.errorMessage = "";
            this.ip_address = "";
        }
        else this.errorMessage = ip_address + " already exists in your list!";
    }

    removeIp(obj) {
        let ip_address = obj.key;
        for (let element of this.authorizedIPs) {
            let key = element.key;
            if (key == ip_address) {
                let val = element.currentColor;
                if (val == "#f66") //DELETED aka RED
                {
                    if (this.numberOfAuthIps == 0) {
                        this.errorMessage = "You have reached you max authorized IPs limit";
                    }
                    else {
                        element.currentColor = element.initialColor;
                        this.numberOfAuthIps--;
                    }
                }
                else {
                    element.currentColor = "#f66";
                    this.numberOfAuthIps++;
                }
            }
        }
    }

    authorizeIpAddress() {
        let arr = [];
        for (let element of this.authorizedIPs)
            if (element.currentColor != "#f66")
                arr.push(element.key);

        console.log(arr);
        console.log(this.numberOfAuthIps);
        this.updatesLeft--;
        // this.updatesLeft==0 ? this.noUpdatesLeft=true:this.noUpdatesLeft=false;
        if (this.updatesLeft == 0) {
            this.noUpdatesLeft = true;
            this.ifDisabled = "btn--gray";
        }
        else {
            this.noUpdatesLeft = false;
            this.ifDisabled = "";
        }
        this.limeProxiesService.updateProxyAuthorizedIps(arr)
            .subscribe(
                success => {
                    this.limeProxiesService.showMessage(success);
                    this.authorizedIPs = [];
                    let arr = success.authorized_list.split(" ");
                    arr.forEach(element => {
                        this.authorizedIPs.push(
                            {
                                key: [element],
                                initialColor: "#f0f4f7",
                                currentColor: "#f0f4f7"
                            }
                        );
                    });

                    this.updatesLeft = success.updates_left;
                    this.authorizedUpdates = success.authorized_updates;
                    this.numOfAuthFromGet = success.authorized_ips;


                },
                error => {
                    this.limeProxiesService.showMessage(error, 'error');
                }
            );
    }


    getAuthorizedIPs() {
        this.limeProxiesService.getProxyAuthorizedIps()
            .subscribe(
                ips => {
                    let arr = ips.authorized_list.split(" ");
                    arr.forEach(element => {
                        this.authorizedIPs.push(
                            {
                                key: [element],
                                initialColor: "#f0f4f7",
                                currentColor: "#f0f4f7"
                            }
                        );
                    });
                    this.numOfAuthFromGet = ips.authorized_ips;
                    this.numberOfAuthIps = ips.authorized_ips - arr.length;
                    this.authorizedUpdates = ips.authorized_updates;
                    this.updatesLeft = ips.updates_left;
                    this.updatesLeft == 0 ? this.noUpdatesLeft = true : this.noUpdatesLeft = false;
                    console.log(this.authorizedIPs);
                }
            );
    }
}