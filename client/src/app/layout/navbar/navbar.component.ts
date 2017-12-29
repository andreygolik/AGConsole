import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AppConfig } from '../../app.config';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.template.html',
})
export class NavbarComponent implements OnInit {
  config: any;
  login: string;
  error: string;
  private isAdmin: Boolean = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    config: AppConfig,
  ) {
    this.config = config.getConfig();
    this.login = localStorage.getItem('login');
  }

  onLogout() {
    this.router.navigateByUrl('/login');
  }

  onChangePassword() {
    this.router.navigateByUrl('/change-password');
  }

  ngOnInit() {
    // Check JWT Token Expiration
    this.authService.checkToken()
      .subscribe(
        data => {
          if (data.success === true && data.hasOwnProperty('payload')) {
            // Expiration
            let expiresIn = data.payload.expiresIn;
            expiresIn -= 60000; // one minute before
            // console.log(`JWT token expires in ${expiresIn}ms`);

            setTimeout(() => {
              this.onLogout();
            }, expiresIn);

            // Role
            this.authService.setRole(data.payload.role);
            this.isAdmin = this.authService.isAdmin;
          }
        },
        error => {
          this.error = error.error;
          console.error(this.error);
          console.error('Can not verify JWT token. Logging out...');
          this.router.navigate(['/login']);
        }
      );
  }

  linkClicked() {
    // Collapse Navbar after click on link
    ($('.navbar-collapse') as any).collapse('hide');
  }
}
