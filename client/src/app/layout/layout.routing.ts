import { RouterModule } from '@angular/router';
import { LayoutComponent } from './layout.component';

export const routing = RouterModule.forChild([
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },

      { path: 'home', loadChildren: '../pages/home/home.module#HomeModule' },
      { path: 'users', loadChildren: '../pages/users/users.module#UsersModule' },
      { path: 'settings', loadChildren: '../pages/settings/settings.module#SettingsModule' },
    ]}
]);
