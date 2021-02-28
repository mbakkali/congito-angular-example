import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {CustomValidators} from '../custom-validators';
import {Auth} from 'aws-amplify';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

  public resetForm: FormGroup;
  public emailForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router) {
    this.resetForm = this.createSignupForm();
    this.emailForm = this.fb.group({email: [null, Validators.compose([Validators.email, Validators.required])]});
  }


  status: string = 'TO_SEND';
  sentCodeError: string;

  ngOnInit(): void {
  }

  sendCode() {
    // Send confirmation code to user's email
    this.sentCodeError = null;
    Auth.forgotPassword(this.emailForm.controls.email.value)
      .then(data => {
        console.log(data);
        this.status = 'SENT_CODE';
      })
      .catch(err => {
        this.sentCodeError = err.code + ' - ' + err.message;
        console.log(err);
      });
  }

  resetPassword() {
    Auth.forgotPasswordSubmit(this.emailForm.controls.email.value, this.resetForm.controls.code.value, this.resetForm.controls.password.value)
      .then(data => {
        console.log(data);
        this.status = 'CODE_IS_CORRECT';
        setTimeout(() => this.router.navigateByUrl('/login'),5000)
      })
      .catch(err => {
        console.log(err);
        this.status = 'CODE_IS_WRONG';
        setTimeout(() => this.status = 'SENT_CODE',5000)

      });
  }

  checkCode() {

  }

  createSignupForm(): FormGroup {
    return this.fb.group(
      {
        code: [null, Validators.required],
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


}
