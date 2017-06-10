import {Component} from '@angular/core';
import {LimeProxiesService} from '../services/limeproxies.service';
import {FormBuilder, FormGroup, Validators, FormArray} from '@angular/forms';
import {Http} from '@angular/http';
import {countryWithPhone} from '../services/countryList.service';
import {MyValidators} from '../custom-validators/custom.validator';

@Component({
  selector: 'quiz-modal',
  templateUrl: '../templates/quiz.template.html',
  styleUrls: ['../styles/quiz.css']
})
export class QuizDialog {
  public quizForm: FormGroup;
  public ip = 1;
  public proxy_ip = '';
  public proxy_type = '';
  public proxy_port = '';
  public proxy_auth = '';
  private countryWithPhone = countryWithPhone;
  public nextDisabled = false;

  constructor(public limeProxiesService: LimeProxiesService, public fb: FormBuilder, public http: Http) {
    this.http.get('https://ipinfo.io/json').map(res => res.json()).do(res => console.log(res)).subscribe(res => {
      const control = <FormArray>this.quizForm.controls['ips'];
      control.removeAt(0);
      control.push(this.fb.control(res.ip));

    });
    this.quizForm = fb.group({
      type: '',
      phone: ['', Validators.required],
      product: ['', Validators.required],
      phone_cc: ['', Validators.required],
      phone_code: ['', MyValidators.pattern(/^\d{4}$/)],
      ips: this.fb.array([
        ''
      ])
    });
  }

  addIp($event) {
    if (this.ip < 3) {
      this.ip++;
      const control = <FormArray>this.quizForm.controls['ips'];
      control.push(this.fb.control(''));
    }
    $event.target.style.display = 'none';
  }

  nextPageOne() {
    if (!this.nextDisabled) {
      this.nextDisabled = true;
      this.limeProxiesService.wizardStepOne(this.quizForm.get('type').value).subscribe((data) => {
        this.nextDisabled = false;
        if (data['_user_message_type'] == 'success' || data['_user_message_type'] == 'info') {
          this.nextPage();
        }
      }, (error) => {
        console.log(error);
      });
    }
  }

  nextPageTwo() {
    if (!this.nextDisabled) {
      this.nextDisabled = true;
      this.limeProxiesService.wizardStepTwo(this.quizForm.get('ips').value).subscribe((data) => {
        this.limeProxiesService.showMessage(data);
        this.nextDisabled = false;
        if (data['_user_message_type'] == 'success' || data['_user_message_type'] == 'info') {
          this.nextPage();
        }
      }, (error) => {
        console.log(error);
      });
    }
  }

  nextPageTree() {
    if (!this.nextDisabled) {
      this.nextDisabled = true;
      this.limeProxiesService.updateUserProfile({phone: this.quizForm.get('phone_cc').value.code.replace(' ', '') + this.quizForm.get('phone').value, country: this.quizForm.get('phone_cc').value.name}).subscribe((data) => {
        this.limeProxiesService.showMessage(data);
        this.nextDisabled = false;
        if (data['_user_message_type'] == 'success' || data['_user_message_type'] == 'info') {
          this.nextPage();
        }
      }, (error) => {
        console.log(error);
      });
    }
  }

  nextPageFour() {
    if (!this.nextDisabled) {
      this.nextDisabled = true;
      this.limeProxiesService.validateCODE(this.quizForm.get('phone_code').value).subscribe((data) => {
        this.limeProxiesService.showMessage(data);
        this.nextDisabled = false;
        if (data['_user_message_type'] == 'success' || data['_user_message_type'] == 'info') {
          this.nextPage();
        }
      }, (error) => {
        console.log(error);
      });
    }
  }

  nextPage() {
    this.limeProxiesService.quizPage++;
  }

  closePage() {
    this.limeProxiesService.showQuizPage = false;
  }

  closeFinalPage() {
    this.limeProxiesService.showQuizPage = false;
    location.reload();
  }

  prevPage() {
    this.limeProxiesService.quizPage--;
  }

  completePage() {
    if (!this.nextDisabled) {
      this.nextDisabled = true;
      this.limeProxiesService.sendWizardProduct(this.quizForm.get('product').value).subscribe((data) => {
        this.limeProxiesService.showMessage(data);
        this.nextDisabled = false;
        if (data['_user_message_type'] == 'success' || data['_user_message_type'] == 'info') {
          this.proxy_type = data.proxy_type;
          this.proxy_ip = data.proxy_ip;
          this.proxy_port = data.proxy_port;
          this.proxy_auth = data.proxy_auth;
          this.nextPage();
        }
      }, (error) => {
        console.log(error);
      });
    }
  }
}
