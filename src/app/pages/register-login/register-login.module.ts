import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PagesRoutingModule } from './register-login-routing.module';
import { LoginComponent } from './login/login.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { MainPageComponent } from './main-page/main-page.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SendEmailComponent } from './send-email/send-email.component';
import { NgxSpinnerModule } from 'ngx-spinner';

@NgModule({
  declarations: [
    LoginComponent,
    SignUpComponent,
    MainPageComponent,
    SendEmailComponent
  ],
  imports: [
    CommonModule,
    PagesRoutingModule,
    ReactiveFormsModule,
    NgxSpinnerModule
  ]
})
export class RegisterLoginModule {}
