import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {httpOptionHeader} from '../httpOptionExporter';

@Injectable({
  providedIn: 'root'
})
  export class RegisterService {

  constructor(private http: HttpClient) { }

  postRegisterAttempt(user: { birthPlace: string; password: string; birthDate: Date; username: string }) {
    // @ts-ignore
    return this.http.post('http://localhost:3000/register', user, httpOptionHeader);
  }
}
