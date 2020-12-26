import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from './../auth.service';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'ngx-verif-email',
  templateUrl: './verif-email.component.html',
  styleUrls: ['./verif-email.component.scss']
})
export class VerifEmailComponent implements OnInit, OnDestroy {
  code;
  verifyEmailSub: Subscription = new Subscription();
  error: string;
  constructor(private authService: AuthService, private router: Router) { }
  registedMail;
  messageResponse;

  ngOnInit() {
    this.registedMail = localStorage.getItem('Remail');

  }

  onVerifyEmail() {
    this.verifyEmailSub = this.authService.verifyEmail(this.code, this.registedMail).subscribe(res => {
      if (res['message'] === "verification Done.") {
        this.messageResponse = res['message'];
        setTimeout(() => {
          this.router.navigate(['auth/login'])
        }, 3000);
        localStorage.removeItem('Remail')
      }
    },
      error => {
        this.error = error
      })
  }


  ngOnDestroy(): void {
    if (this.verifyEmailSub) {
      this.verifyEmailSub.unsubscribe()
    }
  }
}
