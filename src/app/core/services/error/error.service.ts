import { Injectable, signal } from '@angular/core';
import { GlobalError } from '../../../models/error.model';

@Injectable({
  providedIn: 'root',
})
export class ErrorService {
  private _active = signal<boolean>(false);
  private _error = signal<GlobalError | null>(null);
  readonly error = this._error.asReadonly();
  readonly active = this._active.asReadonly();
  show(error: GlobalError) {
    if (this._active()) return;
    this._active.set(true);
    this._error.set(error);
  }
  clear() {
    this._active.set(false);
    this._error.set(null);
  }
}
