import { LoginComponent } from './login/login.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { NgxAuthRoutingModule } from './auth-routing.module';
import { NbAuthModule } from '@nebular/auth';
import {
  NbAlertModule,
  NbButtonModule,
  NbCheckboxModule,
  NbInputModule
} from '@nebular/theme';
import { RegisterComponent } from './register/register.component';
import { InternationalPhoneNumberModule } from 'ngx-international-phone-number';
import { VerifEmailComponent } from './verif-email/verif-email.component';
import { ResendVerifyCodeComponent } from './resend-verify-code/resend-verify-code.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    NbAlertModule,
    NbInputModule,
    NbButtonModule,
    NbCheckboxModule,
    NgxAuthRoutingModule,
    FormsModule,
    NbAuthModule,
    InternationalPhoneNumberModule
  ],
  declarations: [
    LoginComponent,
    RegisterComponent,
    VerifEmailComponent,
    ResendVerifyCodeComponent
  ],
})
export class NgxAuthModule {
}