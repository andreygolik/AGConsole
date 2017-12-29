import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AppConfig } from '../app.config';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.template.html',
})
export class LayoutComponent {
  router: Router;
  config: any;

  constructor(router: Router, config: AppConfig) {
    this.router = router;
    this.config = config.getConfig();
  }
}
