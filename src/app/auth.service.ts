import {Injectable} from '@angular/core';
import {Auth} from 'aws-amplify';
import {CognitoUser, ISignUpResult} from 'amazon-cognito-identity-js';
import {from, Observable} from 'rxjs';
import {mergeMap, tap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() {
  }

  login(email, password): Observable<CognitoUser> {
    return from(Auth.signIn(email, password)).pipe(
      tap(user => localStorage.setItem('currentUser', JSON.stringify(user))));
  }


  logout(): Observable<CognitoUser> {
    return from(Auth.signOut()).pipe(tap(() => localStorage.removeItem('currentUser')));
  }

  signup(email, password): Observable<ISignUpResult> {
    return from(Auth.signUp({
      username: email,
      password: password,
      attributes: {
        email: email
      }
    }));
  }

  confirmSignUp(username, code) {
    return from(Auth.confirmSignUp(username, code));
  }

  resendCodeForSignUp(username){
    return from(Auth.resendSignUp(username));
  }

  isLoggedIn(): boolean {
    return localStorage.getItem('currentUser') != null;
  }

}
