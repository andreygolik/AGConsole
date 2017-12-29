import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import 'rxjs/Rx';
import { Observable } from 'rxjs/Observable';
import { FormGroup } from '@angular/forms';

import { User } from './user.model';
import { AppState } from '../app.service';
import { AppConfig } from '../app.config';

@Injectable()
export class AuthService {
  apiServer: String;
  config: any;

  public role: String;
  public isAdmin: Boolean = false;
  private passwordCahngeParams: Object = {};

  constructor(
    private http: Http,
    private appState: AppState,
    config: AppConfig
  ) {
    this.config = config.getConfig();
    this.apiServer = this.config.apiServer;
  }

  signin(user: User) {
    const body = JSON.stringify(user);
    const headers = new Headers({'Content-Type': 'application/json'});
    return this.http.post(`${this.apiServer}/api/auth/login`, body, {headers: headers})
      .map((response: Response) => response.json())
      .catch((error: Response) => {
        return Observable.throw(error.json());
      });
  }

  checkToken() {
    const headers = new Headers({'Content-Type': 'application/json'});
    headers.append('Authorization', this.getToken());
    return this.http.get(`${this.apiServer}/api/auth/check-token`, {headers: headers})
      .map((response: Response) => response.json())
      .catch((error: Response) => {
        return Observable.throw(error.json());
      });
  }

  logout() {
    localStorage.clear();
  }

  isLoggedIn() {
    return localStorage.getItem('token') != null;
  }

  getLogin() {
    return localStorage.getItem('login');
  }

  getUser() {
    return localStorage.getItem('userId');
  }

  getToken() {
    return localStorage.getItem('token');
  }

  setRole(role: String): void {
    this.role = role;
    this.isAdmin = (role === 'ADMIN');
  }

  getRole(): String {
    return this.role;
  }

  validatePasswords(firstField, secondField) {
    return (c: FormGroup) => {
      return (c.controls && c.controls[firstField].value === c.controls[secondField].value)
        ? null
        : { passwordsEqual: { valid: false} };
    };
  }

  savePasswordChangeParams(token: String, password: String) {
    this.passwordCahngeParams = (token && password) ? { token, password } : {};
  }

  getSavedOldPassword() {
    return this.passwordCahngeParams['password'];
  }

  changePassword(oldPassword: String, newPassword: String) {
    const body = JSON.stringify({ oldPassword, newPassword });
    const headers = new Headers({'Content-Type': 'application/json'});
    let token = this.getToken();
    if (!token) {
      token = this.passwordCahngeParams['token'];
    }
    headers.append('Authorization', token);
    return this.http.post(`${this.apiServer}/api/auth/change-password`, body, {headers: headers})
      .map((response: Response) => {
        this.passwordCahngeParams = {};
        response.json();
      })
      .catch((error: Response) => {
        return Observable.throw(error.json());
      });
  }
}
