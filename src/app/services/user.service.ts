import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Users } from '../interfaces/interfaces';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  

  constructor(private firestore: AngularFirestore, public auth: AngularFireAuth) { 
  }
  
  
  
  async register(user: any, password: string){
    try{
      //Take the mail and password of the user and create a new user in firebase
      await this.auth.createUserWithEmailAndPassword(user.email, password);
      //Call method sendVerificationEmail() to send a verification email to the user
      await this.sendVerificationEmail();
      //Take the user and add it to the database collection 'users'
      return await this.firestore.collection('users').add(user);
    }
    catch(err){
      throw(err);
    }
    
  }

  async sendVerificationEmail(){
    try{
      return await (await this.auth.currentUser)?.sendEmailVerification()
    }
    catch(error){
      throw error
    }
  }

  //Login with email and password
  async login(email: string, password: string){
    try{
      return await this.auth.signInWithEmailAndPassword(email, password);
    }
    catch(error){
      throw error
    }
  }

  // getUsers() : Observable<any>{
  //   return this.firestore.collection('users').snapshotChanges();
  // }

}
