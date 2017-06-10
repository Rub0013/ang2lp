import { Component, HostBinding, OnInit } from '@angular/core';
import { LimeProxiesService } from '../../services/limeproxies.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Message } from "../../entities/message";


@Component({
    selector: 'token-validation',
    templateUrl: '../../templates/login/token-validation.template.html'
})

export class TokenRevalidationComponent implements OnInit {

    @HostBinding('class') myClass = "page__content-inner";

    private token: string;
    private subscribtionObject: any;

    constructor(private router: Router, private route: ActivatedRoute, private limeProxiesService: LimeProxiesService) {
        this.token = "";
    }

    ngOnInit() {
        this.subscribtionObject = this.route.params.subscribe(params => {
            this.token = params['token'];
            this.validateToken();
            // In a real app: dispatch action to load the details here.
        });
    }

    validateToken() {
        this.limeProxiesService.validateTokenFromEmail(this.token, true)
            .subscribe(
                (success:any) => {
                  if (success.valid)
                    {
                      let time = new Date();
                        time.setTime(time.getTime() + (0.5 * 60 * 60 * 1000));
                        localStorage.setItem("userId", JSON.stringify({
                            userId: success.auth_userid,
                            expire: time.getTime()
                        }));
                        localStorage.setItem("token", JSON.stringify({
                            token: success.auth_token,
                            expire: time.getTime()
                        }));
                      this.limeProxiesService.messageToDisplay.next(new Message(success['_user_message'], true));
                      this.router.navigate(["/profile"]);
                    }else {
                        this.limeProxiesService.messageToDisplay.next(new Message("Unauthorized", false));
                        this.router.navigate(["/login"]);
                    }
                },
                error => {
                    console.log(error);
                },
            );
    }

    redirectUserToPage(router, page) {
        setTimeout(function () {
            router.navigate([page]);
        }, 3000);

    }


}
