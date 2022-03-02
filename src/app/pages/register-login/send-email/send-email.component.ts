import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { NgxSpinnerService } from 'ngx-spinner';
import { delay, Observable } from 'rxjs';

import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-send-email',
  templateUrl: './send-email.component.html',
  styles: [
    `
      .btn-primary {
        background-color: #fd5200;
        border-color: #fd5200;
      }
      .btn-primary:hover {
        background-color: #af3800;
        border-color: #af3800;
        color: #fff;
      }
    `
  ]
})
export class SendEmailComponent implements OnInit {
  public user: Observable<any> = this.userService.auth.user;
  isEmailVerified!: boolean | undefined;

  constructor(
    private userService: UserService,
    private auth: AngularFireAuth,
    private spinner: NgxSpinnerService
  ) {
    this.spinner.show();
    delay(3000);
    this.spinner.hide();
  }

  //Check if user is verified to prevent sending verification email again
  ngOnInit(): void {
    this.auth.authState.subscribe((user) => {
      this.isEmailVerified = user?.emailVerified;
    });
  }

  onSendEmail() {
    this.userService.sendVerificationEmail();
  }
}
