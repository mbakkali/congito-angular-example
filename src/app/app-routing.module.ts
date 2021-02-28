import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from './login/login.component';
import {RegisterComponent} from './register/register.component';
import {HomeComponent} from './home/home.component';
import {ConfirmEmailComponent} from './confirm-email/confirm-email.component';
import {ResetPasswordComponent} from './reset-password/reset-password.component';


const routes: Routes = [
  {path: 'home', component: HomeComponent},
  {path: 'reset-password', component: ResetPasswordComponent},
  {path: 'confirm-email', component: ConfirmEmailComponent},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: '**', redirectTo: 'login'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
