import { Subscription } from 'rxjs';
import { NB_AUTH_OPTIONS, getDeepFromObject } from '@nebular/auth';
import { Router } from '@angular/router';
import { AuthService } from './../auth.service';
import { Component, OnInit, ChangeDetectorRef, Inject, OnDestroy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { trigger, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'ngx-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
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
export class LoginComponent implements OnInit, OnDestroy {

  user: any = {};
  loginForm: FormGroup;
  loading = false;
  error = '';
  loginError: string;
  emailNotFound;
  emailNotVerified;

  loginSub: Subscription = new Subscription();
  checkEmailSub: Subscription = new Subscription();

  constructor(private authService: AuthService, private router: Router, @Inject(NB_AUTH_OPTIONS) protected options = {},
    protected cd: ChangeDetectorRef, ) {
  }

  ngOnInit() {
    if (localStorage.getItem('user') != null) {
      this.router.navigate(['/pages/characters/character-filter'])
    }

  }

  login() {
    this.loading = true;
    this.checkEmailSub = this.authService.checkEmail(this.user.email).subscribe(res => {
      this.loading = false;
      if (res['message'] === 'user not Found') {
        this.emailNotFound = "Email Not Found!";
        setTimeout(() => {
          this.emailNotFound = false;
          this.loading = false;
        }, 1500);
      } else if (res['message'] === 'Email not verified') {
        this.emailNotVerified = "Email not verified!";
        setTimeout(() => {
          this.emailNotVerified = false;
          this.loading = false;
          this.router.navigate(['auth/Verify'])
        }, 1500);
      } else {
        this.loginSub = this.authService.login(this.user.email, this.user.password).subscribe((data: any) => {
          if (this.authService.isLoggedIn) {
            this.router.navigate(['/pages/characters/character-filter']);
          }

        },
          error => {
            if (JSON.stringify(error).includes('400')) {
              this.emailNotFound = "Invalid email or password!"
              setTimeout(() => {
                this.emailNotFound = false;
                this.loading = false;
              }, 1500);
            } else {
              this.error = error
              this.loading = false;
            }


          }

        );
      }
    },
      error => {
        this.error = error
        this.loading = false;
      })

  }

  getConfigValue(key: string): any {
    return getDeepFromObject(this.options, key, null);
  }

  ngOnDestroy(): void {
    if (this.loginSub) {
      this.loginSub.unsubscribe();
    }
    if (this.checkEmailSub) {
      this.checkEmailSub.unsubscribe();
    }
  }
}
