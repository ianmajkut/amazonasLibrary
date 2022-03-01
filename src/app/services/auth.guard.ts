import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ActivatedRouteSnapshot, CanActivate, CanLoad, Route, Router, RouterStateSnapshot, UrlSegment, UrlTree } from '@angular/router';

import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanLoad {

  constructor(private router: Router, private auth: AngularFireAuth){}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return new Promise((resolve, reject)=>{
      this.auth.authState.subscribe(user=>{
        if(user){
          resolve(true);
        }else{
          console.log('canActivate Guard: user is not logged in');
          this.router.navigate(['/auth']);
          resolve(false);
        }
      })
    })
  }
  canLoad(
    route: Route,
    segments: UrlSegment[]): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      return new Promise((resolve, reject)=>{
        this.auth.authState.subscribe(user=>{
          if(user){
            resolve(true);
          }else{
            console.log('canLoad Guard: user is not logged in');
            this.router.navigate(['/auth']);
            resolve(false);
          }
        })
      })
  }
}
