import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { UsersComponent } from './users.component';

export const routes = [
  { path: '', component: UsersComponent, pathMatch: 'full' }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  ],
  declarations: [UsersComponent]
})
export class UsersModule {
  static routes = routes;
}
