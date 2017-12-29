import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { routing } from './auth.routing';
import { LoginComponent } from './login/login.component';
import { ChangePasswordComponent } from './changePassword/changePassword.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    routing
  ],
  declarations: [
    LoginComponent,
    ChangePasswordComponent,
  ]
})
export class AuthModule { }
