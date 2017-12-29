import { Component, OnInit } from '@angular/core';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';

import { User } from '../user.model';
import { AuthService } from '../auth.service';
import { AppConfig } from '../../app.config';

@Component({
  selector: 'app-change-password',
  templateUrl: './changePassword.template.html',
})
export class ChangePasswordComponent implements OnInit {
  public config: any;
  public form: FormGroup;
  public oldPassword: AbstractControl;
  public password: AbstractControl;
  public repeatPassword: AbstractControl;
  public passwords: FormGroup;
  public submitted: Boolean = false;
  public error: string;

  constructor(
    private authService: AuthService,
    private router: Router,
    private appConfig: AppConfig,
    private flashMessage: FlashMessagesService,
    fb: FormBuilder,
  ) {
    this.config = appConfig.getConfig();
    this.form = fb.group({
      'oldPassword': ['', Validators.compose([Validators.required, Validators.minLength(1)])],
      'passwords': fb.group({
        'password': ['', Validators.compose([Validators.required, Validators.minLength(7)])],
        'repeatPassword': ['', Validators.required]
      }, {validator: authService.validatePasswords('password', 'repeatPassword')})
    });

    this.oldPassword = this.form.controls['oldPassword'];
    this.passwords = <FormGroup> this.form.controls['passwords'];
    this.password = this.passwords.controls['password'];
    this.repeatPassword = this.passwords.controls['repeatPassword'];
  }

  public onSubmit(values: Object): void {
    this.submitted = true;
    if (this.form.valid) {
      const oldPassword = this.form.value.oldPassword;
      const newPassword = this.form.value.passwords.password;

      this.authService.changePassword(oldPassword, newPassword)
        .subscribe(
          data => {
            // console.log(data);
            this.flashMessage.show(
              'Password successfully changed! Please login with new password.',
              { cssClass: 'alert-success', timeout: 5000 });
            this.router.navigate(['/login']);
          },
          error => {
            this.error = error.error;
            console.log(error);
          }
        );
      this.form.reset();
    }
  }

  ngOnInit() {
    const savedOldPassword = this.authService.getSavedOldPassword();
    if (savedOldPassword) {
      this.oldPassword.setValue(savedOldPassword);
      document.getElementById('oldPassword').setAttribute('disabled', 'disabled');
    } else {
      document.getElementById('oldPassword').removeAttribute('disabled');
    }
  }
}
