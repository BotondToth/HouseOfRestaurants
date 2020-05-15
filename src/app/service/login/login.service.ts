import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {httpOptionHeader} from '../httpOptionExporter';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient) { }

  postLoginAttempt = (email, password) => {
      // @ts-ignore
    return this.http.post('http://localhost:3000/authenticate', { username: email, password }, httpOptionHeader);
  }

  logOut = () => {
    console.log('logging out')
    // @ts-ignore
    return this.http.get('http://localhost:3000/logout', httpOptionHeader);
  }

}
