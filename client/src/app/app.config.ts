import { Injectable } from '@angular/core';

declare let jQuery: any;

@Injectable()
export class AppConfig {
  config = {
    debug: true,

    name: 'agconsole',
    title: 'AGConsole',
    version: '1.0.0',

    apiServer: 'http://localhost:3000',

    /**
     * In-app constants
     */
    settings: {
    },

    /**
     * Application state. May be changed when using.
     * Synced to Local Storage
     */
    state: {
    }
  };

  getConfig(): Object {
    return this.config;
  }
}
