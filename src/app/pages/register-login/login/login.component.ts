import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  
  textError: string = ''
  dataIsCorrect: boolean = true

  emailPattern: string = "^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$"

  myForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.pattern(this.emailPattern)]],
    password: ['', Validators.required],

  })

  constructor(private fb: FormBuilder, private router: Router, private userService: UserService) { }

  ngOnInit(): void {
  }

  async login(){
    const {email, password} = this.myForm.value
    try{
      //Pass the email and password to the userService.login() method
     const user = await this.userService.login(email, password)
     //If the user is not null and the status is verified, navigate to the home page
     if(user && user.user?.emailVerified){
      this.router.navigateByUrl('/home')
     }//If the user ex
     else if(user){
      this.router.navigateByUrl('/auth/verification')
     }
    }
    catch(error: any){
      this.dataIsCorrect = false
      this.textError = error.message
    }
    
  }

  signUp(){
    this.router.navigateByUrl('/auth/signup');
  }

}
