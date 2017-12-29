import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-root',
  encapsulation: ViewEncapsulation.None,
  styleUrls: [ './scss/application.scss' ],
  template: `
    <div class="flash-messages-container">
      <flash-messages></flash-messages>
    </div>
    <router-outlet></router-outlet>`
})
export class AppComponent {
  constructor() { }
}
