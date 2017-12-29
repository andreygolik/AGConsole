import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { routing } from './layout.routing';
import { LayoutComponent } from './layout.component';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';

@NgModule({
  imports: [
    CommonModule,
    routing,
  ],
  declarations: [
    LayoutComponent,
    NavbarComponent,
    FooterComponent,
  ]
})
export class LayoutModule { }
