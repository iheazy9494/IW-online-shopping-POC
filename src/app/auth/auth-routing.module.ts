import { VerifEmailComponent } from './verif-email/verif-email.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NbAuthComponent, NbLoginComponent } from '@nebular/auth';
import { ResendVerifyCodeComponent } from './resend-verify-code/resend-verify-code.component';

export const routes: Routes = [
  {
    path: '',
    component: NbAuthComponent,
    children: [
      {
        path: 'login',
        component: LoginComponent,
      },
      {
        path: 'register',
        component: RegisterComponent,
      },
      {
        path: 'Verify',
        component: VerifEmailComponent,
      },
      {
        path: 'resendVerifyCode',
        component: ResendVerifyCodeComponent
      }
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NgxAuthRoutingModule {
}