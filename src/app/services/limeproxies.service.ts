import {Inject, Injectable} from '@angular/core';
import { Http, Response, Headers, RequestOptions, RequestMethod, URLSearchParams } from '@angular/http';
import { UserCredentials } from '../entities/user-credentials';
import { Message } from '../entities/message';
import { Observable, Subject, BehaviorSubject } from 'rxjs/Rx';
import { Router } from '@angular/router';
import { UserAccount } from '../entities/user-account';
import { UserProfile } from '../entities/user-profile';
import * as moment from 'moment';
import { Ticket } from '../entities/ticket';
import { countryWithPhone, countryList } from './countryList.service';
import { DOCUMENT } from '@angular/platform-browser';

declare const $: any;
declare var analytics: any;
const API_TOKEN = 'XXX';


@Injectable()
export class LimeProxiesService {

  public quizPage = 1;
  public showQuizPage = false;
  public showCardPayment = false;
  public showProductsSidebar: number | boolean | null = 1;
  public products: any;
  public codeVerificationInputActive = true;
  public changeSock: Subject<any> = new Subject<any>();
  public changeRenewal: Subject<any> = new Subject<any>();
  public _updateUserNotifications: Subject<any> = new Subject<any>();
  private countryWithPhone = countryWithPhone;
  public userData: any = {};
  public openTickets: Array<Ticket> = [];
  public closedTickets: Array<Ticket> = [];
  public emptyOpenTickets = false;
  public emptyClosedTickets = false;



  userSubject = new BehaviorSubject<UserAccount>(
    new UserAccount(
      'whitelist',
      'ip',
      '0',
      '0',
      'no',
      '0',
      '2011-07-12 19:37:32'
    ));
  profileSubject = new Subject<UserProfile>();

  messageToDisplay = new BehaviorSubject<Message>(new Message('Nothing to display', false));

  // private instance variable to hold base url
  private limeproxiesUrl = 'https://dashboard.limeproxies.com/api/';

  private countryNames = {
    US: 'United States of America',
    GB: 'United Kingdom of Great Britain',
    ES: 'Spain',
    DK: 'Denmark',
    IE: 'Ireland',
    IT: 'Italy',
    DE: 'Germany',
    AU: 'Australia',
    BE: 'Belgium',
    NO: 'Norway',
    VN: 'Vietnam',
    RU: 'Russia',
    CA: 'Canada',
    SE: 'Sweden',
    AT: 'Austria',
    FR: 'France',
    ZA: 'South Africa',
    BR: 'Brazil',
    PL: 'Poland',
    CH: 'Switzerland',
    NL: 'Netherlands',
    KR: 'Korea',
    IN: 'India',
    PT: 'Portugal',
    JP: 'Japan',
    SG: 'Singapore',
    HK: 'Hong Kong'
  };


  // Resolve HTTP using the constructor
  constructor(private http: Http, private router: Router, @Inject(DOCUMENT) private document: any) {
    let logo;
    switch (document.location.hostname) {
      default:
        logo = '#logo';
        document.title = 'LimeProxies';
    }
    const currentUrl = this.document.location.href,
        expr = /billing\/confirm/;
    if (!expr.test(currentUrl)) {
      if (!localStorage.getItem('userId')) {
        this.router.navigateByUrl('/login');
      }
    }
    this.getProducts().subscribe((data) => {
      this.products = data;
    });
    this.changeSock.debounceTime(1000).distinctUntilChanged()
      .switchMap(data => this.setSock(data))
      .catch(error => this.checkStatusCodeOnError(error))
      .subscribe(data => this.showMessage(data), error => console.log(error));
    this.changeRenewal.debounceTime(1000).distinctUntilChanged()
      .switchMap(data => this.setRenewal(data))
      .catch(error => this.checkStatusCodeOnError(error))
      .subscribe(data => this.showMessage(data), error => console.log(error));
  }

  getPhoneCC(country: string) {
    const res = this.countryWithPhone.find(value => {
      return value.name === country;
    });
    return res ? res.code : '';
  }

  showMessage(data, code: string = 'success') {
    this.notifyBarNew(data['_user_message'], data['_user_message_type'] || code);
  }

  setUserProfile() {
    this.getUserProfile().subscribe((data) => {
      this.userData = data;
      analytics.identify(data.uid, {
        name: data.first_name + ' ' + data.last_name,
        email: data.email
      });
      (<any>window).Intercom('boot', {
        app_id: 'app_id',
        email: data.email,
        user_id: data.uid,
        created_at: 1234567890,
      });
    });
  }

  newTicket(type: string, subject: string, description: string) {
    if (LimeProxiesService.checkExpired()) {
      this.messageToDisplay.next(new Message('Your session has expired', false));
      this.router.navigateByUrl('/login');
    } else {
      const body = {
        'type': type,
        'subject': subject,
        'body': description
      };

      const options = new RequestOptions({method: RequestMethod.Put, headers: LimeProxiesService.authHeaders});
      const api_endpoint = this.limeproxiesUrl.concat(`support/ticket`);

      return this.http.put(api_endpoint, body, options)
          .map(data => {
            const res = this.extractData(data);
            return res;
          }).catch(error => {
            return this.checkStatusCodeOnError(error);
          });
    }
  }

  addToOpenTickets(ticket: Ticket){
     this.openTickets.push(ticket);
  }

  closeTicket(id: number){
    const options = new RequestOptions({method: RequestMethod.Delete, headers: LimeProxiesService.authHeaders});
    const api_endpoint = this.limeproxiesUrl.concat(`support/ticket/${id}`);

    return this.http.delete(api_endpoint, options)
        .map(data => {
          const res = this.extractData(data);
          return res;
        }).catch(error => {
          return this.checkStatusCodeOnError(error);
        });
  }

  removeFromOpened(ticket: Ticket){
    this.openTickets = this.openTickets.filter(function( obj ) {
      return obj.id != ticket.id;
    });
    ticket.status = 'solved';
    this.closedTickets.push(ticket);
  }

  getTickets() {
    const options = new RequestOptions({headers: LimeProxiesService.authHeaders});
    const api_endpoint = this.limeproxiesUrl.concat(`support/tickets`);
    this.http.get(api_endpoint, options).catch(error => {
        return this.checkStatusCodeOnError(error);
      })
        .subscribe(data => {
          const allTickets = this.extractData(data);
          this.closedTickets = [];
          this.openTickets = [];
          for (const ticket of allTickets.tickets) {
            if (ticket.status == 'closed' || ticket.status == 'solved') {
              this.closedTickets.push(ticket);
            } else {
              this.openTickets.push(ticket);
            }
          }
          if (this.closedTickets.length == 0) {
            this.emptyClosedTickets = true;
          }
          if (this.openTickets.length == 0) {
            this.emptyOpenTickets = true;
          }
    });
  }

  getTicket(id: number) {
    const options = new RequestOptions({headers: LimeProxiesService.authHeaders});
    const api_endpoint = this.limeproxiesUrl.concat(`support/ticket/${id}`);
    return this.http.get(api_endpoint, options)
        .map(data => {
          const res = this.extractData(data);
          return res;
        }).catch(error => {
          return this.checkStatusCodeOnError(error);
        });
  }

  getSupportComments(id: number){
    const options = new RequestOptions({headers: LimeProxiesService.authHeaders});
    const api_endpoint = this.limeproxiesUrl.concat(`support/comments/${id}`);
    return this.http.get(api_endpoint, options)
        .map(data => {
          const res = this.extractData(data);
          return res;
        }).catch(error => {
          return this.checkStatusCodeOnError(error);
        });
  }

  sendComment(id: number, comment: string){
    const body = {
      'comment': comment
    };
    const options = new RequestOptions({method: RequestMethod.Put, headers: LimeProxiesService.authHeaders});
    const api_endpoint = this.limeproxiesUrl.concat(`support/comments/${id}`);

    return this.http.put(api_endpoint, body, options)
        .map(data => {
          const res = this.extractData(data);
          console.log(res);
          return res;
        }).catch(error => {
          return this.checkStatusCodeOnError(error);
        });
  }

  cacheTicket(ticket: Ticket){
    localStorage.setItem('cachedTicket', JSON.stringify(ticket));
  }

  getCachedTicket() {
    return JSON.parse(localStorage.getItem('cachedTicket'));
  }

  getbillingHistory() {
    const options = new RequestOptions({headers: LimeProxiesService.authHeaders});
    const api_endpoint = this.limeproxiesUrl.concat(`user/billing`);
    return this.http.get(api_endpoint, options)
        .map(data => {
          const res = this.extractData(data);
          return res;
        }).catch(error => {
          return this.checkStatusCodeOnError(error);
        });
    // return [
    //   {
    //     'date' : '2017-05-24 16:19:02',
    //     'value' : -1,
    //     'type' : 'New',
    //     'method' : 'Credits',
    //     'transaction' : 'Test Product #32236'
    //   },
    //   {
    //     'date' : '2017-05-24 16:18:49',
    //     'value' : 1,
    //     'type' : 'Bonus',
    //     'method' : 'Credits',
    //     'transaction' : 'Phone validation',
    //   },
    //   {
    //     'date' : '2017-05-24 16:18:49',
    //     'value' : -2,
    //     'type' : 'Bonus',
    //     'method' : 'Credits',
    //     'transaction' : 'Phone validation',
    //   },
    //   {
    //     'date' : '2017-05-24 16:18:49',
    //     'value' : 2,
    //     'type' : 'Bonus',
    //     'method' : 'Credits',
    //     'transaction' : 'Phone validation',
    //   }
    // ];
  }

  getBillingConfirm(token: string) {

    let options;

    if (localStorage.getItem('token')) {
      options = new RequestOptions({method: RequestMethod.Post, headers: LimeProxiesService.authHeaders});
    } else {
      const headers = new Headers({
        'Content-Type': 'application/json'
      });
      options = new RequestOptions({method: RequestMethod.Post, headers: headers});
    }

    const body = {
      'token' : token
    };

    const api_endpoint = this.limeproxiesUrl.concat('billing/confirm');

    return this.http.post(api_endpoint, body, options)
        .map(this.extractData)
        .catch(error => this.checkStatusCodeOnError(error));
  }

  orderProduct(no: number, type: string, locations: string, payment: string) {
    const body = {
      'source': 'dashboard',
      'no': no,
      'type': type,
      'locations': locations,
      'payment': payment
    };
    const options = new RequestOptions({method: RequestMethod.Put, headers: LimeProxiesService.authHeaders});
    const api_endpoint = this.limeproxiesUrl.concat(`product/order`);

    return this.http.put(api_endpoint, body, options)
        .map(data => {
          const res = this.extractData(data);
          return res;
        }).catch(error => {
          return this.checkStatusCodeOnError(error);
        });
  }

  orderCreditProduct(oid: string) {
    const body = {
      'oid': oid
    };
    const options = new RequestOptions({method: RequestMethod.Put, headers: LimeProxiesService.authHeaders});
    const api_endpoint = this.limeproxiesUrl.concat(`product/add`);

    return this.http.put(api_endpoint, body, options)
        .map(data => {
          const res = this.extractData(data);
          return res;
        }).catch(error => {
          return this.checkStatusCodeOnError(error);
        });
  }

  notifyBarNew(msg: string, error: string) {
    if (!$('.alert-box').length) {
      switch (error) {
        case 'error':
          $('<div class="alert-box error" >' + msg + '</div>').prependTo($('.notify-top-popup')).delay(5000).fadeOut(1000, function () {
            $('.alert-box').remove();
          });
          break;
        case 'info':
          $('<div class="alert-box" >' + msg + '</div>').prependTo($('.notify-top-popup')).delay(5000).fadeOut(1000, function () {
            $('.alert-box').remove();
          });
          break;
        case 'warning':
          $('<div class="alert-box warning" >' + msg + '</div>').prependTo($('.notify-top-popup')).delay(5000).fadeOut(1000, function () {
            $('.alert-box').remove();
          });
          break;
        default:
          $('<div class="alert-box success" >' + msg + '</div>').prependTo($('.notify-top-popup')).delay(5000).fadeOut(1000, function () {
            $('.alert-box').remove();
          });
      }
    }
  };

  setSock(item) {
    const options = new RequestOptions({headers: LimeProxiesService.authHeaders});
    const api_endpoint = this.limeproxiesUrl.concat(`product/${item.id}/socks`);
    return this.http.put(api_endpoint, {state: item.socks}, options)
      .map(data => {
        const res = this.extractData(data);
        analytics.track('sock changed', item);
        if (res['_user_message_type'] == 'error') {
          item.socks = !item.socks;
        }
        return res;
      }).catch(error => {
        item.socks = !item.socks;
        return this.checkStatusCodeOnError(error);
      });
  }

  wizardStepOne(traffic_type) {
    const options = new RequestOptions({headers: LimeProxiesService.authHeaders});
    const api_endpoint = this.limeproxiesUrl.concat(`user/wizard`);
    return this.http.put(api_endpoint, {traffic_type}, options)
      .map(data => {
        const res = this.extractData(data);
        /*analytics.track('sock changed', item);
         if(res['_user_message_type'] != 'error'){
         item.socks = !item.socks;
         }*/
        return res;
      }).catch(error => {
        return this.checkStatusCodeOnError(error);
      });
  }

  wizardStepTwo(ips: string[]) {
    const options = new RequestOptions({headers: LimeProxiesService.authHeaders});
    const api_endpoint = this.limeproxiesUrl.concat(`proxy/authorized`);
    return this.http.put(api_endpoint, {authorized_list: ips.join(' ')}, options)
      .map(data => {
        const res = this.extractData(data);
        /*analytics.track('sock changed', item);
         if(res['_user_message_type'] != 'error'){
         item.socks = !item.socks;
         }*/
        return res;
      }).catch(error => {
        return this.checkStatusCodeOnError(error);
      });
  }

  setRenewal(data) {
    const options = new RequestOptions({headers: LimeProxiesService.authHeaders});
    const api_endpoint = this.limeproxiesUrl.concat(`product/${data.id}/auto`);
    return this.http.put(api_endpoint, {state: data.state}, options)
      .catch(error => this.checkStatusCodeOnError(error))
      .map(this.extractData)
      .do(data => analytics.track('Recover password sent', data));
  }

  /*
   Login method implementation
   Getting token and userid for the user. Will be valid for 30mins.
   Sending username & password from login page.
   */
  login(email: string, password: string): Observable<UserCredentials> {

    const api_endpoint = this.limeproxiesUrl.concat('user/login');

    return this.http.post(api_endpoint, {email, password})
      .map(this.getUserCreds)
      .first<UserCredentials>()
      .do((creds: UserCredentials) => {
        LimeProxiesService.saveTokenAndAuthID(creds.userID, creds.token);
      });
  }

  loginWithToken(recover_token) {
    const api_endpoint = this.limeproxiesUrl.concat('user/login');
    return this.http.post(api_endpoint, {recover_token})
      .map(this.getUserCreds)
      .first<UserCredentials>()
      .do(
        (creds: UserCredentials) => {
          LimeProxiesService.saveTokenAndAuthID(creds.userID, creds.token);
        })
      .catch(this.checkStatusCodeOnError);
  }

  static saveTokenAndAuthID(auth_id, auth_token) {
    const time = new Date();
    time.setTime(time.getTime() + (0.5 * 60 * 60 * 1000));
    localStorage.setItem('userId', JSON.stringify({userId: auth_id, expire: time.getTime()}));
    localStorage.setItem('token', JSON.stringify({token: auth_token, expire: time.getTime()}));
  }

  userPasswordRecover(email) {
    const api_endpoint = this.limeproxiesUrl.concat('user/recover');

    return this.http.put(api_endpoint, {email})
      .map(this.extractData).do( data => {
        analytics.track('recover email sent', {user_id: email});
      })
      .catch(error => this.checkStatusCodeOnError(error));
  }

  getProducts() {
    return this.http.get('assets/json/products.json')
      .map(this.extractData)
      .catch(error => this.checkStatusCodeOnError(error));
  }

  getFullCountryName(shortName: string) {
    return this.countryNames[shortName.toUpperCase()];
  }

  static get authHeaders(): Headers {
    /*      let userId = localStorage.getItem("userId");
     userId = userId ? JSON.parse(userId).userId : 0;
     let token = localStorage.getItem("token");
     token = token ? JSON.parse(userId).token : 0;*/
    const user =  JSON.parse(localStorage.getItem('userId'));
    const userId =  user && user.userId;
    const t =  JSON.parse(localStorage.getItem('token'));
    const token = t && t.token;

    return new Headers({
      'Content-Type': 'application/json',
      'X-Auth-UserID': userId,
      'X-Auth-Token': token
    });
  }

  downloadProduct(id) {
    if (LimeProxiesService.checkExpired()) {
      this.messageToDisplay.next(new Message('Your session has expired', false));
      this.router.navigateByUrl('/login');
    } else {

      const options = new RequestOptions({headers: LimeProxiesService.authHeaders});

      const api_endpoint = this.limeproxiesUrl.concat(`product/${id}/download`);

      return this.http.get(api_endpoint, options)
        .map(data => data.text())
        .catch(error => this.checkStatusCodeOnError(error));
    }
  }

  ckeckProductStatus(id) {
    if (LimeProxiesService.checkExpired()) {
      this.messageToDisplay.next(new Message('Your session has expired', false));
      this.router.navigateByUrl('/login');
    } else {
      const options = new RequestOptions({headers: LimeProxiesService.authHeaders});
      const api_endpoint = this.limeproxiesUrl.concat(`product/${id}/status`);
      return this.http.get(api_endpoint, options)
        .map(this.extractData)
        .catch(error => this.checkStatusCodeOnError(error));
    }
  }

  getAllProducts() {
    if (LimeProxiesService.checkExpired()) {
      this.messageToDisplay.next(new Message('Your session has expired', false));
      this.router.navigateByUrl('/login');
    } else {
      const options = new RequestOptions({headers: LimeProxiesService.authHeaders});

      const api_endpoint = this.limeproxiesUrl.concat('product/active');

      return this.http.get(api_endpoint, options)
        .map(this.extractData)
        .catch(error => this.checkStatusCodeOnError(error));
    }
  }

  sendCoupon(product: string, code: string) {
    if (LimeProxiesService.checkExpired()) {
      this.messageToDisplay.next(new Message('Your session has expired', false));
      this.router.navigateByUrl('/login');
    } else {
      const options = new RequestOptions({headers: LimeProxiesService.authHeaders});

      const api_endpoint = this.limeproxiesUrl.concat('product/discount');

      return this.http.post(api_endpoint, {product, code}, options)
        .map(this.extractData)
        .catch(error => this.checkStatusCodeOnError(error));
    }
  }

  refreshProduct(id: number, reason: string) {
    if (LimeProxiesService.checkExpired()) {
      this.messageToDisplay.next(new Message('Your session has expired', false));
      this.router.navigateByUrl('/login');
    } else {
      const options = new RequestOptions({headers: LimeProxiesService.authHeaders});

      const api_endpoint = this.limeproxiesUrl.concat(`product/${id}/refresh`);

      return this.http.put(api_endpoint, {reason}, options)
        .map(this.extractData)
        .catch(error => this.checkStatusCodeOnError(error));
    }
  }

  static checkExpired(): boolean {
    const user = JSON.parse(localStorage.getItem('userId'));
    if (user) {
      const time = user.expire;
      return time < new Date().getTime();
    } else {
      return false;
    }
  }

  deleteMyAccount() {
    if (LimeProxiesService.checkExpired()) {
      this.messageToDisplay.next(new Message('Your session has expired', false));
      this.router.navigateByUrl('/login');
    }

    const options = new RequestOptions({headers: LimeProxiesService.authHeaders});
    const api_endpoint = this.limeproxiesUrl.concat('user/account');

    return this.http.delete(api_endpoint, options)
      .map(this.extractData).do(data => {
        analytics.track('account was deleted', this.userData);
      })
      .catch(error => this.checkStatusCodeOnError(error));
  }


  signUpUserAndSendValidationTokenToEmail({first_name, last_name, email}) {

    const api_endpoint = this.limeproxiesUrl.concat('user/signup');

    return this.http.put(api_endpoint, {email, first_name, last_name})
      .map(this.extractData)
      .catch(error => this.checkStatusCodeOnError(error));
  }


  validateTokenFromEmail(token, revaidate: boolean = false) {
    const api_endpoint = revaidate ? this.limeproxiesUrl.concat('user/revalidate') : this.limeproxiesUrl.concat('user/validate');

    return this.http.post(api_endpoint, {token})
      .map(this.extractData).do(data => {
        analytics.track('email was validated', this.userData);
      })
      .catch(error => this.checkStatusCodeOnError(error));
  }

  _keyPress(event: any) {
    const pattern = /[0-9]/;
    const inputChar = String.fromCharCode(event.charCode);

    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  toDate(date: string) {
    return moment(date).toDate();
  }


  getUserNotification() {
    if (LimeProxiesService.checkExpired()) {
      this.messageToDisplay.next(new Message('Your session has expired', false));
      this.router.navigateByUrl('/login');
    }


    const options = new RequestOptions({headers: LimeProxiesService.authHeaders});

    const api_endpoint = this.limeproxiesUrl.concat('user/notification');

    return this.http.get(api_endpoint, options)
      .map(this.extractData)
      .catch(error => this.checkStatusCodeOnError(error));
  }

  getNotification(id: string) {
    if (LimeProxiesService.checkExpired()) {
      this.messageToDisplay.next(new Message('Your session has expired', false));
      this.router.navigateByUrl('/login');
    } else {
      const options = new RequestOptions({headers: LimeProxiesService.authHeaders});

      const api_endpoint = this.limeproxiesUrl.concat('notification/' + id);

      return this.http.get(api_endpoint, options)
        .map(this.extractData)
        .catch(error => this.checkStatusCodeOnError(error));
    }
  }

  deleteUserNotification(id: string) {
    if (LimeProxiesService.checkExpired()) {
      this.messageToDisplay.next(new Message('Your session has expired', false));
      this.router.navigateByUrl('/login');
    }


    const options = new RequestOptions({headers: LimeProxiesService.authHeaders});

    const api_endpoint = this.limeproxiesUrl.concat('notification/' + id);

    return this.http.delete(api_endpoint, options)
      .map(this.extractData)
      .catch(error => this.checkStatusCodeOnError(error));
  }

  getUserProfile(): Observable<UserProfile> {
    if (LimeProxiesService.checkExpired()) {
      this.messageToDisplay.next(new Message('Your session has expired', false));
      this.router.navigateByUrl('/login');
    }


    const options = new RequestOptions({headers: LimeProxiesService.authHeaders});

    const api_endpoint = this.limeproxiesUrl.concat('user/profile');

    return this.http.get(api_endpoint, options)
      .map(res => {
        const val = this
          .extractData(res);
        this.profileSubject.next(val);
        return val;
      })
      .catch(error => this.checkStatusCodeOnError(error));
  }

  updateUserProfile(obj) {
    if (LimeProxiesService.checkExpired()) {
      this.messageToDisplay.next(new Message('Your session has expired', false));
      this.router.navigateByUrl('/login');
    }
    const options = new RequestOptions({headers: LimeProxiesService.authHeaders});

    const api_endpoint = this.limeproxiesUrl.concat('user/profile');

    return this.http.put(api_endpoint, obj, options)
      .map(this.extractData).do(data => {
        analytics.track('update User Profile', obj);
      })
      .catch(error => this.checkStatusCodeOnError(error));
  }

  updateUserEmail(email) {
    if (LimeProxiesService.checkExpired()) {
      this.messageToDisplay.next(new Message('Your session has expired', false));
      this.router.navigateByUrl('/login');
    }

    const options = new RequestOptions({method: RequestMethod.Put, headers: LimeProxiesService.authHeaders});

    const api_endpoint = this.limeproxiesUrl.concat('user/profile/email');

    return this.http.put(api_endpoint, {email}, options)
      .map(this.extractData).do(data => {
        analytics.track('update User Email', {email});
      })
      .catch(error => this.checkStatusCodeOnError(error));
  }


  getUserOverview() {
    if (LimeProxiesService.checkExpired()) {
      this.messageToDisplay.next(new Message('Your session has expired', false));
      this.router.navigateByUrl('/login');
    }


    const options = new RequestOptions({headers: LimeProxiesService.authHeaders});

    const api_endpoint = this.limeproxiesUrl.concat('user/overview');

    return this.http.get(api_endpoint, options)
      .map(this.extractData)
      .catch(error => this.checkStatusCodeOnError(error));
  }


  /*
   GetUserAccount method implementation
   Getting user account info.
   Sending cached credentials.
   */
  getUserAccount(): Observable<UserAccount> {
    if (LimeProxiesService.checkExpired()) {
      this.messageToDisplay.next(new Message('Your session has expired', false));
      this.router.navigateByUrl('/login');
    }


    const options = new RequestOptions({headers: LimeProxiesService.authHeaders});

    const api_endpoint = this.limeproxiesUrl.concat('user/account');

    return this.http.get(api_endpoint, options)
      .map(res => {
        const val = this.extractData(res);
        this.userSubject.next(val);
        return val;
      })
      .catch(error => this.checkStatusCodeOnError(error));
  }


  updateUserAccount(isAuth, obj) {
    if (LimeProxiesService.checkExpired()) {
      this.messageToDisplay.next(new Message('Your session has expired', false));
      this.router.navigateByUrl('/login');
    }


    const options = new RequestOptions({headers: LimeProxiesService.authHeaders});

    const api_endpoint = this.limeproxiesUrl.concat('user/account');

    return this.http.put(api_endpoint, obj, options)
      .map(res => {
        const val = this.extractData(res);
        if (isAuth) this.userSubject.value.auth_method = val.auth_method;
        analytics.track('update User Profile', val);
        return val;
      })
      .catch(error => this.checkStatusCodeOnError(error));
  }


  getUserTraffic() {
    if (LimeProxiesService.checkExpired()) {
      this.messageToDisplay.next(new Message('Your session has expired', false));
      this.router.navigateByUrl('/login');
    }

    const options = new RequestOptions({headers: LimeProxiesService.authHeaders});

    const api_endpoint = this.limeproxiesUrl.concat('user/traffic');

    return this.http.get(api_endpoint, options)
      .map(this.extractData)
      .catch(error => this.checkStatusCodeOnError(error));
  }

  getProxyAuthorizedIps() {
    if (LimeProxiesService.checkExpired()) {
      this.messageToDisplay.next(new Message('Your session has expired', false));
      this.router.navigateByUrl('/login');
    }


    const options = new RequestOptions({headers: LimeProxiesService.authHeaders});

    const api_endpoint = this.limeproxiesUrl.concat('proxy/authorized');

    return this.http.get(api_endpoint, options)
      .map(this.extractData)
      .catch(error => this.checkStatusCodeOnError(error));
  }

  updateProxyAuthorizedIps(new_authorizedIps_list) {
    if (LimeProxiesService.checkExpired()) {
      this.messageToDisplay.next(new Message('Your session has expired', false));
      this.router.navigateByUrl('/login');
    }
    const body = {
      'authorized_list': new_authorizedIps_list.toString().split(',').join(' ')
    };
    const options = new RequestOptions({method: RequestMethod.Put, headers: LimeProxiesService.authHeaders});

    const api_endpoint = this.limeproxiesUrl.concat('proxy/authorized');

    return this.http.put(api_endpoint, body, options)
      .map(this.extractData)
      .catch(error => this.checkStatusCodeOnError(error));
  }

  getProxyPassword() {
    if (LimeProxiesService.checkExpired()) {
      this.messageToDisplay.next(new Message('Your session has expired', false));
      this.router.navigateByUrl('/login');
    }

    const options = new RequestOptions({headers: LimeProxiesService.authHeaders});

    const api_endpoint = this.limeproxiesUrl.concat('proxy/password');

    return this.http.get(api_endpoint, options)
      .map(this.extractData)
      .catch(error => this.checkStatusCodeOnError(error));
  }

  updateProxyPassword(password) {
    if (LimeProxiesService.checkExpired()) {
      this.messageToDisplay.next(new Message('Your session has expired', false));
      this.router.navigateByUrl('/login');
    }

    const options = new RequestOptions({headers: LimeProxiesService.authHeaders});

    const api_endpoint = this.limeproxiesUrl.concat('proxy/password');

    return this.http.put(api_endpoint, {password}, options)
      .map(this.extractData).do(data => {
        analytics.track('update Proxy Password', {password});
      })
      .catch(error => this.checkStatusCodeOnError(error));
  }


  getMyWhitelist() {
    if (LimeProxiesService.checkExpired()) {
      this.messageToDisplay.next(new Message('Your session has expired', false));
      this.router.navigateByUrl('/login');
    }


    const options = new RequestOptions({headers: LimeProxiesService.authHeaders});

    const api_endpoint = this.limeproxiesUrl.concat('proxy/whitelist');

    return this.http.get(api_endpoint, options)
      .map(this.extractData)
      .catch(error => this.checkStatusCodeOnError(error));
  }

  updateProxyWhitelist(white_list) {
    if (LimeProxiesService.checkExpired()) {
      this.messageToDisplay.next(new Message('Your session has expired', false));
      this.router.navigateByUrl('/login');
    }
    const body = {
      'white_list': white_list.toString().split(',').join(' ')
    };
    const options = new RequestOptions({headers: LimeProxiesService.authHeaders});

    const api_endpoint = this.limeproxiesUrl.concat('proxy/whitelist');

    return this.http.put(api_endpoint, body, options)
      .map(this.extractData)
      .do(data => {
        analytics.track('update Proxy White list', white_list);
      })
      .catch(error => this.checkStatusCodeOnError(error));
  }


  sendSMSCode() {
    if (LimeProxiesService.checkExpired()) {
      this.messageToDisplay.next(new Message('Your session has expired', false));
      this.router.navigateByUrl('/login');
    }

    const options = new RequestOptions({headers: LimeProxiesService.authHeaders});

    const api_endpoint = this.limeproxiesUrl.concat('phone/send');

    return this.http.put(api_endpoint, null, options)
      .map(this.extractData)
      .do(data => {
        analytics.track('send SMS Code', this.userData);
      })
      .catch(error => this.checkStatusCodeOnError(error));
  }

  validateCODE(code) {
    if (LimeProxiesService.checkExpired()) {
      this.messageToDisplay.next(new Message('Your session has expired', false));
      this.router.navigateByUrl('/login');
    }

    const options = new RequestOptions({headers: LimeProxiesService.authHeaders});

    const api_endpoint = this.limeproxiesUrl.concat('phone/validate');

    return this.http.put(api_endpoint, {code}, options)
      .map(this.extractData)
      .do(data => {
        analytics.track('validate sms CODE', this.userData);
      })
      .catch(error => this.checkStatusCodeOnError(error));
  }

  sendWizardProduct(product) {
    if (LimeProxiesService.checkExpired()) {
      this.messageToDisplay.next(new Message('Your session has expired', false));
      this.router.navigateByUrl('/login');
    }

    const options = new RequestOptions({headers: LimeProxiesService.authHeaders});

    const api_endpoint = this.limeproxiesUrl.concat('user/wizard');

    return this.http.put(api_endpoint, {product}, options)
      .map(this.extractData)
      .do(data => {
        analytics.track('validate sms CODE', this.userData);
      })
      .catch(error => this.checkStatusCodeOnError(error));
  }

  getUserIpAddress() {
    return this.http.get('https://jsonip.com/?')
      .map(this.extractData)
      .catch(error => this.checkStatusCodeOnError(error));
  }


  checkStatusCodeOnError(error) {
    if (error.status == 401) {
      this.router.navigateByUrl('/login');
      this.messageToDisplay.next(new Message('Your session has expired', false));
    } else if (error.status == 500) {
      this.router.navigateByUrl('/500');
      // this.messageToDisplay.next(new Message("Your session has expired", false));
    }


    return this.handleError(error);
  }

  //////////////####################################################////////////////
  ///////////////############ HELPER METHODS #####################////////////////
  //////////////####################################################////////////////

  validateIPaddress(ipaddress) {
    if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ipaddress)) {
      return (true);
    }
    console.log('You have entered an invalid IP address!');
    return (false);
  }

  domainValidate(domain) {
    if (/^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+$/.test(domain)) {
      return true;
    } else {
      console.log('Enter Valid Domain Name');
      return false;
    }
  }

  private extractData(res: Response) {
    const body = res.json();
    return body || {};
  }

  private handleError(error: any) {
    // In a real world app, we might  error to get a better message
    const errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    return Observable.throw(errMsg);
  }

  private getUserCreds(res: Response) {
    const body = res.json();
    console.log('Extract data: ' + JSON.stringify(body));
    const creds = new UserCredentials(body.auth_userid, body.auth_token);
    return creds || {};
  }


  showRenew(id: number) {
    if (LimeProxiesService.checkExpired()) {
      this.messageToDisplay.next(new Message('Your session has expired', false));
      this.router.navigateByUrl('/login');
    }

    const options = new RequestOptions({headers: LimeProxiesService.authHeaders});

    const api_endpoint = this.limeproxiesUrl.concat(`product/${id}/renew`);

    return this.http.put(api_endpoint, null, options)
      .map(this.extractData)
      .do(data => {
        analytics.track('validate sms CODE', this.userData);
      })
      .catch(error => this.checkStatusCodeOnError(error));
  }
}
