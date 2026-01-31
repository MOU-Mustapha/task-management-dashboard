import { TestBed } from '@angular/core/testing';
import { DialogService } from 'primeng/dynamicdialog';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { describe, it, expect, beforeEach, vi, type Mock } from 'vitest';

import { ErrorService } from './error.service';
import { GlobalError } from '../../../shared/components/global-error/global-error';
import { GlobalErrorObject } from '../../../shared/models/error.model';

describe('ErrorService', () => {
  let service: ErrorService;
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
        ErrorService,
        { provide: DialogService, useValue: dialogServiceMock },
        { provide: TranslateService, useValue: translateServiceMock },
      ],
    });

    service = TestBed.inject(ErrorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should keep the provided message when it is a non-empty string', () => {
    const onClose = new Subject<GlobalErrorObject | undefined>();
    dialogServiceMock.open.mockReturnValue({ onClose });

    translateServiceMock.instant.mockReturnValue('General error');

    const error: GlobalErrorObject = { message: 'Backend error', status: 500 };

    service.show(error);

    expect(translateServiceMock.instant).not.toHaveBeenCalled();
    expect(dialogServiceMock.open).toHaveBeenCalledTimes(1);

    const [, config] = dialogServiceMock.open.mock.calls[0];
    expect(config.data.error).toEqual({ message: 'Backend error', status: 500 });
  });

  it('should fallback to translated message when message is empty', () => {
    const onClose = new Subject<GlobalErrorObject | undefined>();
    dialogServiceMock.open.mockReturnValue({ onClose });

    translateServiceMock.instant.mockReturnValue('General error');

    const error: GlobalErrorObject = { message: '' };

    service.show(error);

    expect(translateServiceMock.instant).toHaveBeenCalledWith('GeneralErrorMsg');

    const [, config] = dialogServiceMock.open.mock.calls[0];
    expect(config.data.error.message).toBe('General error');
  });

  it('should fallback to translated message when message is not a string', () => {
    const onClose = new Subject<GlobalErrorObject | undefined>();
    dialogServiceMock.open.mockReturnValue({ onClose });

    translateServiceMock.instant.mockReturnValue('General error');

    const error = { message: 123 } as unknown as GlobalErrorObject;

    service.show(error);

    expect(translateServiceMock.instant).toHaveBeenCalledWith('GeneralErrorMsg');

    const [, config] = dialogServiceMock.open.mock.calls[0];
    expect(config.data.error.message).toBe('General error');
  });

  it('should open GlobalError dialog with expected configuration', () => {
    const onClose = new Subject<GlobalErrorObject | undefined>();
    dialogServiceMock.open.mockReturnValue({ onClose });

    const error: GlobalErrorObject = { message: 'Test error', status: 400 };

    service.show(error);

    expect(dialogServiceMock.open).toHaveBeenCalledTimes(1);

    const [component, config] = dialogServiceMock.open.mock.calls[0];

    expect(component).toBe(GlobalError);
    expect(config.header).toBe('Error');
    expect(config.width).toBe('30%');
    expect(config.height).toBe('fit-content');
    expect(config.draggable).toBe(false);
    expect(config.closable).toBe(true);
    expect(config.modal).toBe(true);
    expect(config.data).toEqual({ error });
    expect(config.breakpoints).toEqual({
      '1300px': '40%',
      '1024px': '70%',
      '768px': '90%',
      '560px': '95%',
    });
  });

  it('should return an observable that emits and completes on dialog close', async () => {
    const onClose = new Subject<GlobalErrorObject | undefined>();
    dialogServiceMock.open.mockReturnValue({ onClose });

    const error: GlobalErrorObject = { message: 'Test error' };

    const results: Array<GlobalErrorObject | undefined> = [];
    let completed = false;

    service.show(error).subscribe({
      next: (value) => results.push(value),
      complete: () => {
        completed = true;
      },
    });

    onClose.next({ message: 'Closed', status: 200 });
    onClose.complete();

    await Promise.resolve();

    expect(results).toEqual([{ message: 'Closed', status: 200 }]);
    expect(completed).toBe(true);
  });
});
