import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private URL = 'http://localhost:3000/api'

  constructor( private http: HttpClient, private router: Router) { }

  signUp(user: any){
    return this.http.post<any>(this.URL + '/register', user);
  }

  QRSignIn(user:any){
    console.log(user);
    return this.http.post<any>(this.URL + '/fecha', user);
  }

  signIn(user: any){
    return this.http.post<any>(this.URL + '/sigin', user);
  }
  loggedIn(){
    return !!localStorage.getItem('token');
  }
  adminIn(){
    return !!localStorage.getItem('isAdmin');
  }
  getToken(){
    return localStorage.getItem('token');
  }
  logOut(){
    localStorage.removeItem('token');
    localStorage.removeItem('QRCODE');
    this.router.navigate(['/login']);
  }
  isAdmin(){
    return !!localStorage.getItem('admin');
  }
  QRCodeGen(){
    return localStorage.getItem('QRCODE');
  }
 
}
