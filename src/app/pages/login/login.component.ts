import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  myForm: FormGroup = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required],

  })

  constructor(private fb: FormBuilder, private router: Router) { }

  ngOnInit(): void {
  }

  login(){
    console.log(this.myForm.value); 
  }

  signUp(){
    this.router.navigateByUrl('/auth/signup');
  }

}
