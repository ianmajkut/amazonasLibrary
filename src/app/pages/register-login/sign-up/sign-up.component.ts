import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { UserService } from 'src/app/services/user.service';
import { Users } from 'src/app/interfaces/interfaces';
import { SignUpService } from 'src/app/services/sign-up.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {

  emailPattern: string = "^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$"
  //Min length 7 and max length 8
  dniPattern: string = "^[0-9]{7,8}"

  textError: string = ''
  dataIsCorrect: boolean = true

  myForm: FormGroup = this.fb.group({
    name: ['nombre', [Validators.required, Validators.minLength(2)]],
    lastname: ['apel', [Validators.required, Validators.minLength(2)]],
    // The last validator is a asyncValidator  
    username: ['', [Validators.required, Validators.minLength(5)],[this.signUpService.checkUser.bind(this.signUpService)]],
    password: ['123456', [Validators.required, Validators.minLength(6)]],
    dni: ['1234567', [Validators.required, Validators.pattern(this.dniPattern)]],
    email: ['assa@gmail.com', [Validators.required, Validators.pattern(this.emailPattern)]],
    phoneNum: ['123', ],
    location: ['asdasd', [Validators.required]],
  })

  //Getter to access the username field and check the status
  get username() {
    return this.myForm.get('username')
  }

  constructor(private fb: FormBuilder, private userService: UserService, private firestore: AngularFirestore, private signUpService: SignUpService, private router: Router) { }

  ngOnInit(): void {
  }

  register(){
    const {name, lastname, username, password, dni, email, phoneNum, location} = this.myForm.value
    //Adding the fields to the user object but NOT the password
    const user: Users = {
      name, 
      lastname,
      username,
      dni,
      email,
      phoneNum,
      location
    }
    //Pass the user object and password to the userService.register() method
    this.userService.register(user, password).then(()=>{
      this.myForm.reset();
      this.router.navigateByUrl('/auth/verification');
    }, err => {
      this.dataIsCorrect = false
      this.textError = err.message
    });
    console.log(this.myForm);
  }

}

