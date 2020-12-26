import { User } from './../@core/data/users';
import { catchError, map } from 'rxjs/operators';
import { Subject, throwError, BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../environments/environment'
@Injectable({
  providedIn: 'root'
})

export class AuthService implements OnInit {

  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;

  errorData: {};
  constructor(private http: HttpClient, private router: Router) {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('user')));
    this.currentUser = this.currentUserSubject.asObservable();
  }
  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }
  ngOnInit() { }

  login(email, password) {
    let params = new URLSearchParams();
    params.append('username', email);
    params.append('password', password);
    params.append('grant_type', 'password');

    let headers =
      new HttpHeaders({
        'Content-type': 'application/x-www-form-urlencoded; charset=utf-8',
        'Authorization': 'Basic ' + btoa("web:web123")
      });

    let options = {
      headers: headers
    }
    return this.http.post(environment.apiUrl + ':5050/oauth/token', params.toString(), options).pipe(map(user => {
      this.saveToken(user);
    }),
      // catchError(this.handleError)
    );

  }

  resgister(email, password, phone) {
    return this.http.post(environment.apiUrl + ':5050/account/signup', { username: email, password: password, phone: phone }).pipe(
      catchError(this.handleError)
    );
  }
  saveToken(user) {
    var expireDate = new Date().getTime() + (1000 * user.expires_in);
    localStorage.setItem('user', JSON.stringify({ token: user.access_token, expires_in: expireDate }));
    this.currentUserSubject.next(user);
    return user;
  }
  getToken() {
    return localStorage.getItem('user');
  }
  isLoggedIn() {
    const usertoken = this.getToken();
    if (usertoken != null) {
      return true
    }
    return false;
  }
  checkEmail(email: string) {
    return this.http.post(environment.apiUrl + ':5050/account/checkEmail', { "username": email }).pipe(
      catchError(this.handleError)
    );
  }
  verifyEmail(otp, email) {
    return this.http.post(environment.apiUrl + ':5050/account/mailverification', { "otp": otp, "credential": email }).pipe(
      catchError(this.handleError)
    );
  }
  resendCode(email) {
    return this.http.post(environment.apiUrl + ':5050/account/resendCode', { "username": email }).pipe(
      catchError(this.handleError)
    );
  }
  logout() {
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
    this.router.navigate(['/auth/login'])
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(`Backend returned code ${error.status}, ` + `body was: ${error.error}`);
    }
    return throwError('Something bad happened. Please try again later.');
  }
}
