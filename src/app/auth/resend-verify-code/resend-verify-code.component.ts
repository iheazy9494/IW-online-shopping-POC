import { Router } from '@angular/router';
import { NB_AUTH_OPTIONS, getDeepFromObject } from '@nebular/auth';
import { AuthService } from './../auth.service';
import { Component, OnInit, Inject } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';

@Component({
  selector: 'ngx-resend-verify-code',
  templateUrl: './resend-verify-code.component.html',
  styleUrls: ['./resend-verify-code.component.scss']
})
export class ResendVerifyCodeComponent implements OnInit {

  Remail;
  messageResponse;
  messageResponseFail
  loading = false;
  error: string;
  checkEmailSub: Subscription = new Subscription();
  resendCodelSub: Subscription = new Subscription();

  constructor(private authService: AuthService, @Inject(NB_AUTH_OPTIONS) protected options = {}, private router: Router) { }

  ngOnInit() {
  }
  onResendCode() {
    this.loading = true;
    this.checkEmailSub = this.authService.checkEmail(this.Remail).subscribe(res => {

      if (res['message'] === 'Email verified' || res['message'] === 'user not Found') {
        this.messageResponseFail = res['message'];
        setTimeout(() => {
          this.messageResponseFail = false
        }, 1500);
        this.loading = false;
      } else {
        this.resendCodelSub = this.authService.resendCode(this.Remail).subscribe(res => {
          this.messageResponse = res['mesage'];
          setTimeout(() => {
            localStorage.setItem('Remail', this.Remail);
            this.router.navigate(['auth/Verify']);
            this.messageResponse = false
          }, 2000);
          this.loading = false;
        }, error => {
          this.loading = false;
          this.error = error;
        })
      }
    }, error => {
      this.loading = false;
      this.error = error;
    })

  }
  getConfigValue(key: string): any {
    return getDeepFromObject(this.options, key, null);
  }
  ngOnDestroy(): void {
    if (this.checkEmailSub) {
      this.checkEmailSub.unsubscribe()
    }
    if (this.resendCodelSub) {
      this.resendCodelSub.unsubscribe()
    }
  }
}
