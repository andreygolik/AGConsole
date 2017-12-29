import { Injectable } from '@angular/core';

export interface InteralStateType {
  [key: string]: any;
}

@Injectable()
export class AppState {
  _state: InteralStateType = { };

  constructor() { }

  // already return a clone of the current state
  get state() {
    return this._state = this._clone(this._state);
  }
  // never allow mutation
  set state(value) {
    throw new Error('do not mutate the `.state` directly');
  }

  get(prop?: any) {
    // use our state getter for the clone
    const state = this.state;

    if (prop === undefined) {
      return state;
    }

    return state.hasOwnProperty(prop) ? state[prop] : undefined;
  }

  set(prop: string, value: any) {
    // internally mutate our state
    return this._state[prop] = value;
  }

  remove(prop: string) {
    if (this.state.hasOwnProperty(prop)) {
      delete this.state[prop];
      return true;
    } else {
      return undefined;
    }
  }

  pop(prop: string) {
    if (this.state.hasOwnProperty(prop)) {
      const value = this.state[prop];
      delete this.state[prop];
      return value;
    } else {
      return undefined;
    }
  }

  private _clone(object: InteralStateType) {
    // simple object clone
    return JSON.parse(JSON.stringify( object ));
  }
}
