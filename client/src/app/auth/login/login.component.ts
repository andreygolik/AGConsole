import { Component, OnInit } from '@angular/core';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { User } from '../user.model';
import { AuthService } from '../auth.service';
import { AppConfig } from '../../app.config';

@Component({
  selector: 'app-auth-login',
  templateUrl: './login.template.html',
})
export class LoginComponent implements OnInit {
  public config: any;
  public form: FormGroup;
  public login: AbstractControl;
  public password: AbstractControl;
  public submitted: Boolean = false;
  public error: string;

  constructor(
    private authService: AuthService,
    private router: Router,
    private appConfig: AppConfig,
    fb: FormBuilder,
  ) {
    this.config = appConfig.getConfig();
    this.form = fb.group({
        'login': ['', Validators.compose([Validators.required, Validators.minLength(1)])],
        'password': ['', Validators.compose([Validators.required, Validators.minLength(3)])]
    });

    this.login = this.form.controls['login'];
    this.password = this.form.controls['password'];
  }

  public onSubmit(values: Object): void {
    this.submitted = true;
    if (this.form.valid) {
      const user = new User(this.form.value.login, this.form.value.password);
      this.authService.signin(user)
        .subscribe(
          data => {
            // console.log(data);
            if (data.forcePasswordChange) {
              console.log('password change required');
              this.authService.savePasswordChangeParams(data.token, this.form.value.password);
              this.router.navigateByUrl('/change-password');
            } else {
              localStorage.setItem('token', data.token);
              localStorage.setItem('userId', data.user._id);
              localStorage.setItem('login', data.user.login);
              this.router.navigateByUrl('/');
            }
          },
          error => {
            this.error = error.error;

            console.log(error);
            const form = document.getElementById('login-form');

            form.classList.add('auth-error');

            this.password.reset();
          }
        );
      // this.form.reset();
    }
  }

  private resetPassword(): void {
    alert('To reset your password please contact support.');
  }

  ngOnInit() {
    // reset login status
    this.authService.logout();
  }
}
