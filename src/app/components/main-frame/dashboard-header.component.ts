import { Component, AfterViewInit, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { LimeProxiesService } from '../../services/limeproxies.service';
import { DialogService } from '../../services/dialog.service';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs/Rx';
declare const $: any;

@Component({
    selector: '.page__header',
    templateUrl: '../../templates/main-frame/dashboard-header.template.html',
    styleUrls: ['../../styles/dashboard-header.css']
})
export class DashboardHeaderComponent implements AfterViewInit, OnInit, OnDestroy {

    private userNotifications;
    private errorMessage;
    private warning;
    private error;
    private info;
    private globalClick: Subscription[] = [];


    private messageToUser: string;
    @ViewChild('notification') notification: ElementRef;
    @ViewChild('userDropdown') userDropdown: ElementRef;
    public showNotification = false;
    public showProfile = false;


    constructor(private limeProxiesService: LimeProxiesService, private router: Router, private dialogService: DialogService) {
        this.userNotifications = {
            full_name: '',
            credit: '',
            notifications: []
        };
    }

    ngOnDestroy() {
        this.globalClick.forEach(row => row.unsubscribe());
    }

    openNotification(notify) {
        if (notify.id) {
            this.limeProxiesService.getNotification(notify.id).subscribe((data) => {
                this.dialogService.confirm('Notification', data.message, {
                    isConfirm: false,
                    withEnter: true,
                    style: {width: 900 + 'px', height: 410 + 'px'}
                });

            });
        } else if (notify.link) {
            this.showNotification = false;
            this.router.navigateByUrl(`/${notify.link}`);
        }
    }


    getDiff(date) {
        let diff;
        const start = moment(new Date());
        const end = moment(date);
        if (diff = start.diff(end, 'weeks')) {
          return `${diff} week(s) ago`;
        } else if (diff = start.diff(end, 'days')) {
            return `${diff} days(s) ago`;
        } else if (diff = start.diff(end, 'hours')) {
            return `${diff} hour(s) ago`;
        } else if (diff = start.diff(end, 'minutes')) {
            return `${diff} minute(s) ago`;
        } else if (diff = start.diff(end, 'seconds')) {
            return `${diff} second(s) ago`;
        }
    }

    ngAfterViewInit() {
        this.globalClick[0] = Observable.fromEvent(document, 'click')
            .subscribe((event: MouseEvent) => {
                if (!this.notification.nativeElement.contains(event.target)) {
                    this.showNotification = false;
                }
                if (!this.userDropdown.nativeElement.contains(event.target)) {
                    this.showProfile = false;
                }
            });
        $('.page__header .hamburger').on('click', function (e) {
            e.preventDefault();
            $('body').toggleClass('dashboard--show');
        });
    }

    ngOnInit() {
      // this.limeProxiesService.setUserProfile();
      if (this.limeProxiesService.messageToDisplay.value.message !== 'Nothing to display') {
        this.limeProxiesService.notifyBarNew(
          this.limeProxiesService.messageToDisplay.value.message,
          this.limeProxiesService.messageToDisplay.value.success ? 'success' : 'error'
        );
        this.limeProxiesService.messageToDisplay.next({
          message: 'Nothing to display',
          success: false
        });

      }
      this.setUserNotifications();
      this.globalClick[1] = this.limeProxiesService._updateUserNotifications.subscribe(() => {
        this.setUserNotifications();
      });
    }

    setUserNotifications() {
        this.limeProxiesService.getUserNotification()
            .subscribe(
              success => {
                    this.userNotifications = success;
                },
                error => this.errorMessage = error
            );
    }

    getTypeColor(type) {
        let color, background;
        switch (type) {
            case 'info':
                background = '#aaece3';
                color = '#000';
                break;
            case 'warning':
                background = '#E67E22';
                color = '#fff';
                break;
            case 'error':
                background = '#d83333';
                color = '#fff';
                break;
            case 'success':
                background = '#58ad30';
                color = '#fff';
                break;
            default:
                background = '#888';
                color = '#fff';
        }
        return {background, color};
    }

    removeNotification(notif, event: Event) {
        event.stopPropagation();
        if (notif.id) {
            this.limeProxiesService.deleteUserNotification(notif.id).subscribe((done) => {
            }, (error) => {
                alert(error);
            });
        }
        this.userNotifications.notifications = this.userNotifications.notifications.filter((value) => value != notif);
    }

}
