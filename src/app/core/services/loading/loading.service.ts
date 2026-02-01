import { computed, Injectable, signal } from '@angular/core';

/**
 * Global loading state service based on reference counting.
 *
 * Uses a counter to support multiple concurrent operations.
 * The `loading` signal becomes true when at least one operation is active.
 */
@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  private readonly _counter = signal<number>(0);
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
