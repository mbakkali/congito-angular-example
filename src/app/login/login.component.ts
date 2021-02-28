import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CustomValidators} from '../custom-validators';
import {AmplifyService} from 'aws-amplify-angular';
import {Auth} from 'aws-amplify';
import {Router} from '@angular/router';
import {CognitoUser} from 'amazon-cognito-identity-js';
import {AuthService} from '../auth.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  error: string;
  isLoading: boolean;

  constructor(private fb: FormBuilder,
              private amplifyService: AmplifyService,
              private router : Router,
              private authService : AuthService
  ) {

  }

  ngOnInit(): void {
    this.form = this.fb.group({
      tenant: [
        null],
      email: [
        null,
        Validators.compose([Validators.email, Validators.required])
      ],
      password: [
        null,
        Validators.compose([
          Validators.required,
          // check whether the entered password has a number
          CustomValidators.patternValidator(/\d/, {
            hasNumber: true
          }),
          // check whether the entered password has upper case letter
          CustomValidators.patternValidator(/[A-Z]/, {
            hasCapitalCase: true
          }),
          // check whether the entered password has a lower case letter
          CustomValidators.patternValidator(/[a-z]/, {
            hasSmallCase: true
          }),
          // check whether the entered password has a special character
          CustomValidators.patternValidator(
            /[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/,
            {
              hasSpecialCharacters: true
            }
          ),
          Validators.minLength(8)
        ])
      ]
    });
  }



  submit() {
    this.error = null;
    this.isLoading = true;
    this.authService.login(
      this.form.controls.email.value,
      this.form.controls.password.value).subscribe( value => {
      this.isLoading = false;
      this.router.navigateByUrl('home')
    },reason => {
      this.isLoading = false;
        this.error = reason.code + ' - ' + reason.message
        console.error(reason)
    })
  }


  forgotPassword() {

  }
}
