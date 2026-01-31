import { HttpRequest } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { Subject } from 'rxjs';
import { describe, it, expect, beforeEach, vi, type Mock } from 'vitest';

import { AppFacadeService } from '../services/app.facade.service';
import { loadingInterceptor } from './loading-interceptor';

describe('loadingInterceptor', () => {
  let appFacadeMock: {
    loadingService: { start: Mock; stop: Mock };
  };

  beforeEach(() => {
    appFacadeMock = {
      loadingService: {
        start: vi.fn(),
        stop: vi.fn(),
      },
    };

    TestBed.configureTestingModule({
      providers: [{ provide: AppFacadeService, useValue: appFacadeMock }],
    });
  });

  it('should call loadingService.start immediately and stop on completion', () => {
    const req = new HttpRequest('GET', '/test');

    const nextSubject = new Subject<unknown>();
    const next: Mock = vi.fn().mockReturnValue(nextSubject.asObservable());

    const values: unknown[] = [];
    let completed = false;

    TestBed.runInInjectionContext(() => {
      loadingInterceptor(req, next).subscribe({
        next: (v) => values.push(v),
        complete: () => {
          completed = true;
        },
      });
    });

    expect(appFacadeMock.loadingService.start).toHaveBeenCalledTimes(1);
    expect(appFacadeMock.loadingService.stop).not.toHaveBeenCalled();

    nextSubject.next('OK');
    expect(values).toEqual(['OK']);

    nextSubject.complete();
    expect(completed).toBe(true);
    expect(appFacadeMock.loadingService.stop).toHaveBeenCalledTimes(1);
  });

  it('should call loadingService.stop on error', () => {
    const req = new HttpRequest('GET', '/test');

    const nextSubject = new Subject<unknown>();
    const next: Mock = vi.fn().mockReturnValue(nextSubject.asObservable());

    const errors: unknown[] = [];

    TestBed.runInInjectionContext(() => {
      loadingInterceptor(req, next).subscribe({
        error: (e) => errors.push(e),
      });
    });

    expect(appFacadeMock.loadingService.start).toHaveBeenCalledTimes(1);
    expect(appFacadeMock.loadingService.stop).not.toHaveBeenCalled();

    const err = new Error('boom');
    nextSubject.error(err);

    expect(errors).toEqual([err]);
    expect(appFacadeMock.loadingService.stop).toHaveBeenCalledTimes(1);
  });
});
