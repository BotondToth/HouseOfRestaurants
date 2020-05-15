import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {RegisterService} from '../service/register/register.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  email: string;
  password: string;
  passwordAgain: string;
  showSpinner: any;
  birthPlace: string;
  birthDate: Date;
  constructor(private router: Router, private registerService: RegisterService) { }

  ngOnInit(): void {
  }

  validateInputs(): boolean {

    return false;
  }

  register(): void {
    const user = {
      username: this.email,
      password: this.password,
      birthPlace: this.birthPlace,
      birthDate: this.birthDate
    };
    this.registerService.postRegisterAttempt(user).subscribe(res => {
      // @ts-ignore
      if (res.statusCode === 200) {
        this.router.navigate(['login']);
      } else {
        alert('Registration failed');
      }
    });
  }

}
