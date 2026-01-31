import { TestBed } from '@angular/core/testing';
import { DialogService } from 'primeng/dynamicdialog';
import { TranslateService } from '@ngx-translate/core';
import { describe, it, expect, beforeEach, vi, type Mock } from 'vitest';

import { AppFacadeService } from './app.facade.service';
import { LoadingService } from './loading/loading.service';
import { ErrorService } from './error/error.service';

describe('AppFacadeService', () => {
  let service: AppFacadeService;
  let dialogServiceMock: { open: Mock };
  let translateServiceMock: { instant: Mock };

  beforeEach(() => {
    dialogServiceMock = {
      open: vi.fn(),
    };

    translateServiceMock = {
      instant: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        AppFacadeService,
        LoadingService,
        ErrorService,
        { provide: DialogService, useValue: dialogServiceMock },
        { provide: TranslateService, useValue: translateServiceMock },
      ],
    });

    service = TestBed.inject(AppFacadeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return LoadingService instance from loadingService getter', () => {
    const loadingService = service.loadingService;

    expect(loadingService).toBeTruthy();
    expect(loadingService).toBeInstanceOf(LoadingService);
  });

  it('should return ErrorService instance from errorService getter', () => {
    const errorService = service.errorService;

    expect(errorService).toBeTruthy();
    expect(errorService).toBeInstanceOf(ErrorService);
  });

  it('should return the same LoadingService instance on multiple calls', () => {
    const loadingService1 = service.loadingService;
    const loadingService2 = service.loadingService;

    expect(loadingService1).toBe(loadingService2);
  });

  it('should return the same ErrorService instance on multiple calls', () => {
    const errorService1 = service.errorService;
    const errorService2 = service.errorService;

    expect(errorService1).toBe(errorService2);
  });
});
