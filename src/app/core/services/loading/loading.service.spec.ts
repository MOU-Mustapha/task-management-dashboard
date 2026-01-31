import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';

import { LoadingService } from './loading.service';

describe('LoadingService', () => {
  let service: LoadingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LoadingService],
    });

    service = TestBed.inject(LoadingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have loading false by default', () => {
    expect(service.loading()).toBe(false);
  });

  it('start should set loading to true', () => {
    service.start();

    expect(service.loading()).toBe(true);
  });

  it('stop should set loading to false when counter returns to 0', () => {
    service.start();
    service.stop();

    expect(service.loading()).toBe(false);
  });

  it('stop should not decrement counter below 0', () => {
    service.stop();

    expect(service.loading()).toBe(false);
  });

  it('should keep loading true while counter is greater than 0', () => {
    service.start();
    service.start();

    expect(service.loading()).toBe(true);

    service.stop();
    expect(service.loading()).toBe(true);

    service.stop();
    expect(service.loading()).toBe(false);
  });

  it('reset should set loading to false even if counter is greater than 0', () => {
    service.start();
    service.start();

    expect(service.loading()).toBe(true);

    service.reset();

    expect(service.loading()).toBe(false);
  });
});
