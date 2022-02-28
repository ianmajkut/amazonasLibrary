import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { Users } from 'src/app/interfaces/interfaces';
import { SignUpService } from 'src/app/services/sign-up.service';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styles: [
  ]
})
export class ProfileComponent implements OnInit {

  userEmailParam!: string 
  user! : Observable<any> 
  myUser!: any

  emailPattern: string = "^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$"
  //Min length 7 and max length 8
  dniPattern: string = "^[0-9]{7,8}"

  constructor(private activeRoute: ActivatedRoute, public auth: AngularFireAuth, private firestore: AngularFirestore, private fb: FormBuilder, private signUpService : SignUpService ) { 
    //Getting the email passed by the url
    this.userEmailParam = this.activeRoute.snapshot.params['userEmail']
    
    //Check of the user logged 
    this.auth.authState.subscribe(user => {
      //If user is logged
      if(user){
        let emailLower = user?.email?.toLowerCase();
        //Query to obtain the user on the database using the email
        this.user = this.firestore.collection('users', ref => ref.where('email', '==', emailLower)).valueChanges();
        this.user.subscribe(user => {
          //Asign the user to the currentUser variable
          this.myUser = user[0]
          //PatchValue allows to change the value of the form with the values of the user
          this.myForm.patchValue(this.myUser)
          
        })

      }
    })
  }


  myForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    lastname: ['', [Validators.required, Validators.minLength(2)]],
    // The last validator is a asyncValidator  
    username: ['', [Validators.required, Validators.minLength(5)],[this.signUpService.checkUser.bind(this.signUpService)]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    dni: ['', [Validators.required, Validators.pattern(this.dniPattern)]],
    email: ['', [Validators.required, Validators.pattern(this.emailPattern)]],
    phoneNum: ['', ],
    location: ['', [Validators.required]],
  })

  ngOnInit(): void {
    
  }

}
