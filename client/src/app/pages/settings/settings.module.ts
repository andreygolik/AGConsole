import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { SettingsComponent } from './settings.component';

export const routes = [
  { path: '', component: SettingsComponent, pathMatch: 'full' }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  ],
  declarations: [SettingsComponent]
})
export class SettingsModule {
  static routes = routes;
}
