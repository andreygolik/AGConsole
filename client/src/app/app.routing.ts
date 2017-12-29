import { Routes } from '@angular/router';
import { ErrorComponent } from './error/error.component';

import { AuthGuard } from './auth/auth.guard';

export const routing: Routes = [
  // { path: '', redirectTo: 'somewhere', pathMatch: 'full' },
  { path: '', loadChildren: './layout/layout.module#LayoutModule', canActivate: [AuthGuard] },
  { path: 'error', component: ErrorComponent },
  { path: '**',    component: ErrorComponent },
];
