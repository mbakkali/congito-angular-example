import {Component, Input, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '../auth.service';

@Component({
  selector: 'app-confirm-email',
  templateUrl: './confirm-email.component.html',
  styleUrls: ['./confirm-email.component.css']
})
export class ConfirmEmailComponent implements OnInit {

  @Input() currentUsername : string;
  errorValidatingCode: string;
  successValidatingCode: string;
  code: string;
  resentCode: string;

  constructor(private router : Router, private authService : AuthService) { }

  ngOnInit(): void {
  }

  confirmEmailWithCode(){
    this.errorValidatingCode = null;
    this.successValidatingCode = null;
    this.authService.confirmSignUp(this.currentUsername,this.code).subscribe(value => {
      console.log('Confirmed email adress with success', value)
      this.successValidatingCode = 'Success ... redirecting'
      setTimeout(() => this.router.navigateByUrl('login'),5000);
    },error => {
      console.error(error);
      this.errorValidatingCode = 'Error validating code ' + error.message;
    })
  }

  resendCode(){
    this.resentCode = null;
    this.authService.resendCodeForSignUp(this.currentUsername).subscribe(value => {
      this.resentCode = 'A code was sent to your email ' + this.currentUsername;
      console.log('Resent email confirmation with success', value)
    },error => {
      this.resentCode = error.message;
      console.error(error)
    })
  }

  backToLogin() {
    this.router.navigateByUrl('login');
  }
}
