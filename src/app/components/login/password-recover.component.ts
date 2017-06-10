import { Component, HostBinding, OnInit } from '@angular/core';
import { LimeProxiesService } from '../../services/limeproxies.service';
import { Message } from '../../entities/message';
import { Router, ActivatedRoute } from '@angular/router';


@Component({
    selector: 'password-recover',
    templateUrl: '../../templates/login/password-recover.template.html'
})

export class PasswordRecoverComponent implements OnInit {

    @HostBinding('class') myClass = "page__content-inner";
    private successMessage: string;
    private errorMessage: string;
    private redirectMessage: string;

    private token: string;
    private subscribtionObject: any;

    constructor(private router: Router, private route: ActivatedRoute, private limeProxiesService: LimeProxiesService) {
        this.token = "";
    }

    ngOnInit() {
        this.subscribtionObject = this.route.params.subscribe(params => {
            this.token = params['token'];
            this.limeProxiesService.loginWithToken(this.token).subscribe(
                //success
                creds => this.router.navigate(['../home']),
                //error
                error => {
                    this.limeProxiesService.messageToDisplay.next(new Message("Unauthorized", false));
                    this.router.navigate(['../']);
                }
                //completed
            );

            // In a real app: dispatch action to load the details here.
        });


    }

    redirectUserToPage(router, page) {
        setTimeout(function () {
            router.navigate([page]);
        }, 3000);

    }


}
