import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import firebase from 'firebase/compat/app';
import { map, Observable, pipe } from 'rxjs';
import { Users } from 'src/app/interfaces/interfaces';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styles: [
  ]
})
export class HomePageComponent implements OnInit {

  user!: Observable<any>
  currentUser!: any

  constructor(public auth: AngularFireAuth, private userService : UserService, private firestore: AngularFirestore ) {
    
    
  }

  ngOnInit(): void {
    //Check of the user logged 
    this.auth.authState.subscribe(user => {
      //If user is logged
      if(user){
        let emailLower = user?.email?.toLowerCase();
        //Query to obtain the user on the database using the email
        this.user = this.firestore.collection('users', ref => ref.where('email', '==', emailLower)).valueChanges();
        this.user.subscribe(user => {
          //Asign the user to the currentUser variable
          this.currentUser = user[0]
          
        })
      }
    })
    
  }

  logout(){
    this.auth.signOut();
  }


}
