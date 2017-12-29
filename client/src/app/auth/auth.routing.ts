import { RouterModule } from '@angular/router';

import { AuthGuard } from './auth.guard';
import { LoginComponent } from './login/login.component';
import { ChangePasswordComponent } from './changePassword/changePassword.component';

export const routing = RouterModule.forChild([
  { path: 'logout', redirectTo: 'login' },
  { path: 'login', component: LoginComponent },
  { path: 'change-password', component: ChangePasswordComponent},
]);
