import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { FlashMessagesModule } from 'angular2-flash-messages';

import { routing } from './app.routing';

// Components
import { AppComponent } from './app.component';
import { AppState, InteralStateType } from './app.service';

import { AppConfig } from './app.config';
import { ErrorComponent } from './error/error.component';

// Authentication
import { AuthService } from './auth/auth.service';
import { AuthModule } from './auth/auth.module';
import { AuthGuard } from './auth/auth.guard';

@NgModule({
  declarations: [
    AppComponent,
    ErrorComponent,
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routing, { useHash: false }),
    HttpModule,
    FormsModule,
    AuthModule,
    FlashMessagesModule.forRoot(),
  ],
  providers: [
    AppState,
    AppConfig,
    AuthService,
    AuthGuard,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
