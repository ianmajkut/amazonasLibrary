import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-send-email',
  templateUrl: './send-email.component.html',
  styles: [
  ]
})
export class SendEmailComponent implements OnInit {

  public user: Observable<any> = this.userService.auth.user

  constructor(private userService : UserService) { }

  ngOnInit(): void {
  }

  onSendEmail(){
    this.userService.sendVerificationEmail()
  }

}
