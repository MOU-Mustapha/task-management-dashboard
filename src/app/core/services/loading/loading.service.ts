import { computed, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  private _counter = signal<number>(0);
  readonly loading = computed(() => this._counter() > 0);

  start() {
    this._counter.update((val) => val + 1);
  }
  stop() {
    this._counter.update((val) => Math.max(0, val - 1));
  }
  reset() {
    this._counter.set(0);
  }
}
