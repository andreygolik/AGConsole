import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.template.html',
})
export class SettingsComponent implements OnInit {

  constructor(
    private router: Router,
    private authService: AuthService,
  ) { }

  ngOnInit() {
    if (!this.authService.isAdmin) {
      this.router.navigate(['/']);
    }
  }
}
