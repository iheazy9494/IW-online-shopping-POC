import { Subscription, BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from './../auth.service';
import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { NB_AUTH_OPTIONS, getDeepFromObject } from '@nebular/auth';
import { trigger, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'ngx-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  animations: [
    trigger(
      'enterAnimation', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('500ms', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        style({ opacity: 1 }),
        animate('500ms', style({ opacity: 0 }))
      ])
    ]
    )
  ]
})
export class RegisterComponent implements OnInit, OnDestroy {
  user: any = {};
  emailNotVerified;
  loading = false;
  resgisterSub: Subscription = new Subscription();
  checkEmailSub: Subscription = new Subscription();
  error: string;
  constructor(
    @Inject(NB_AUTH_OPTIONS) protected options = {},
    private authService: AuthService,
    private router: Router) { }

  ngOnInit() {
  }

  register() {
    this.loading = true;
    this.checkEmailSub = this.authService.checkEmail(this.user.email).subscribe(res => {
      if (res['message'] === 'Email not verified') {
        this.emailNotVerified = "Email not verified!";
        setTimeout(() => {
          this.emailNotVerified = false;
          this.loading = false;
          this.router.navigate(['auth/Verify'])
        }, 1500);
      } else {
        this.resgisterSub = this.authService.resgister(this.user.email, this.user.password, this.user.phone).subscribe(res => {
          localStorage.setItem('Remail', this.user.email);
          if (res['message']) {
            this.emailNotVerified = res['message'] + "!";
            setTimeout(() => {
              this.emailNotVerified = false;
              this.loading = false;
            }, 1500);
          }
          if (res['message'] === "Verify your Account") {
            this.router.navigate(['auth/Verify'])
          }
        }, error => {
          this.error = error;
          this.loading = false;
        })
      }

    }, error => {
      this.error = error;
      this.loading = false;
    })

  }
  getConfigValue(key: string): any {
    return getDeepFromObject(this.options, key, null);
  }
  ngOnDestroy(): void {
    this.resgisterSub.unsubscribe();
    if (this.checkEmailSub) {
      this.checkEmailSub.unsubscribe();
    }
  }


}
