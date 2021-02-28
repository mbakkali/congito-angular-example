import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CustomValidators} from '../custom-validators';
import {ISignUpResult} from 'amazon-cognito-identity-js';
import {Router} from '@angular/router';
import {AuthService} from '../auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  error: string;
  showConfirmPage: boolean;

  ngOnInit(): void {
  }

  public formRegister: FormGroup;

  constructor(private fb: FormBuilder, private router: Router, private authService: AuthService) {
    this.formRegister = this.createSignupForm();
  }

  createSignupForm(): FormGroup {
    return this.fb.group(
      {
        email: [
          null,
          Validators.required
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
        ],
        confirmPassword: [null, Validators.compose([Validators.required])]
      },
      {
        // check whether our password and confirm password match
        validator: CustomValidators.passwordMatchValidator
      }
    );
  }

  submit() {
    // do signup or something
    this.signUp();
  }


  signUp() {
    this.error = null;
    this.authService.signup(
      this.formRegister.controls.email.value,
      this.formRegister.controls.password.value).subscribe((result: ISignUpResult) => {
      if (!result.userConfirmed) {
        this.showConfirmPage = true;
      } else {
        this.router.navigateByUrl('login');
      }
    }, reason => {
      this.error = reason.code + ' - ' + reason.message;
      console.error(reason);
    });
  }
}
