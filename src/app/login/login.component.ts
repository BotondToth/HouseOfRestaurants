import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../service/login/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  constructor(private router: Router, private loginService: LoginService) { }
  username: string;
  password: string;
  showSpinner: any;

  ngOnInit() {}

  login(): void {
    this.loginService.postLoginAttempt(this.username, this.password).subscribe(res => {
      // @ts-ignore
      if (res.statusCode === 200) {
        this.router.navigate(['foods']);
      } else {
        alert('Invalid credentials');
      }
    });
  }

}
