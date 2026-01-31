import { HttpErrorResponse, HttpRequest } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { catchError, defer, of, throwError } from 'rxjs';
import { describe, it, expect, beforeEach, vi, type Mock } from 'vitest';

import { AppFacadeService } from '../services/app.facade.service';
import { errorInterceptor } from './error-interceptor';

describe('errorInterceptor', () => {
  let appFacadeMock: {
    loadingService: { reset: Mock };
    errorService: { show: Mock };
  };

  beforeEach(() => {
    appFacadeMock = {
      loadingService: {
        reset: vi.fn(),
      },
      errorService: {
        show: vi.fn(),
      },
    };

    TestBed.configureTestingModule({
      providers: [{ provide: AppFacadeService, useValue: appFacadeMock }],
    });
  });

  it('should retry once after 1s for server errors (>=500) and succeed without showing error', async () => {
    vi.useFakeTimers();

    const req = new HttpRequest('GET', '/test');

    let attempts = 0;
    const next: Mock = vi.fn().mockReturnValue(
      defer(() => {
        attempts += 1;
        if (attempts === 1) {
          return throwError(
            () => new HttpErrorResponse({ status: 500, statusText: 'Server Error', error: 'boom' }),
          );
        }
        return of('OK');
      }),
    );

    const values: unknown[] = [];
    let completed = false;
    const errors: unknown[] = [];

    TestBed.runInInjectionContext(() => {
      errorInterceptor(req, next).subscribe({
        next: (v) => values.push(v),
        error: (e) => errors.push(e),
        complete: () => {
          completed = true;
        },
      });
    });

    expect(next).toHaveBeenCalledTimes(1);

    await vi.runAllTimersAsync();

    await Promise.resolve();

    expect(attempts).toBe(2);
    expect(values).toEqual(['OK']);
    expect(completed).toBe(true);
    expect(errors).toEqual([]);

    expect(appFacadeMock.loadingService.reset).not.toHaveBeenCalled();
    expect(appFacadeMock.errorService.show).not.toHaveBeenCalled();

    vi.useRealTimers();
  });

  it('should not retry for client errors (<500) and should reset loading + show error and rethrow', async () => {
    const req = new HttpRequest('GET', '/test');

    const err = new HttpErrorResponse({ status: 400, statusText: 'Bad Request', error: 'bad' });

    const next: Mock = vi.fn().mockReturnValue(throwError(() => err));

    const errors: unknown[] = [];

    TestBed.runInInjectionContext(() => {
      errorInterceptor(req, next)
        .pipe(
          catchError((e) => {
            errors.push(e);
            return of('recovered');
          }),
        )
        .subscribe();
    });

    await Promise.resolve();

    expect(next).toHaveBeenCalledTimes(1);
    expect(appFacadeMock.loadingService.reset).toHaveBeenCalledTimes(1);
    expect(appFacadeMock.errorService.show).toHaveBeenCalledTimes(1);
    expect(appFacadeMock.errorService.show).toHaveBeenCalledWith({ message: 'bad', status: 400 });
    expect(errors).toEqual([err]);
  });

  it('should retry once for status 0, then reset + show error if it still fails', async () => {
    vi.useFakeTimers();

    const req = new HttpRequest('GET', '/test');

    const err = new HttpErrorResponse({ status: 0, statusText: 'Unknown Error', error: 'offline' });

    let attempts = 0;
    const next: Mock = vi.fn().mockReturnValue(
      defer(() => {
        attempts += 1;
        return throwError(() => err);
      }),
    );

    const errors: unknown[] = [];

    TestBed.runInInjectionContext(() => {
      errorInterceptor(req, next)
        .pipe(
          catchError((e) => {
            errors.push(e);
            return of('recovered');
          }),
        )
        .subscribe();
    });

    expect(next).toHaveBeenCalledTimes(1);

    await vi.runAllTimersAsync();

    await Promise.resolve();

    expect(attempts).toBe(2);

    expect(appFacadeMock.loadingService.reset).toHaveBeenCalledTimes(1);
    expect(appFacadeMock.errorService.show).toHaveBeenCalledTimes(1);
    expect(appFacadeMock.errorService.show).toHaveBeenCalledWith({ message: 'offline', status: 0 });
    expect(errors).toEqual([err]);

    vi.useRealTimers();
  });
});
