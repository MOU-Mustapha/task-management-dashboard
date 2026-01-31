import { TestBed } from '@angular/core/testing';
import { DialogService } from 'primeng/dynamicdialog';
import { TranslateService } from '@ngx-translate/core';
import { Observable, Subject } from 'rxjs';
import { describe, it, expect, beforeEach, vi, type Mock } from 'vitest';

import { Task, Assignee } from '../models/task.model';
import { TaskDialogService } from './task-dialog.service';
import { TaskModal } from '../components/task-modal/task-modal';

describe('TaskDialogService', () => {
  let service: TaskDialogService;
  let dialogServiceMock: { open: Mock };
  let translateServiceMock: { instant: Mock };

  const mockAssignee: Assignee = {
    id: 'a1',
    name: 'John Doe',
    avatar: '',
    email: 'john@example.com',
  };

  const mockTask: Task = {
    id: '1',
    title: 'Test Task',
    description: 'Test Description',
    status: 'todo',
    priority: 'medium',
    dueDate: '2025-01-01',
    completedAt: '',
    assignee: mockAssignee,
    tags: ['bug'],
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
  };

  beforeEach(() => {
    dialogServiceMock = {
      open: vi.fn(),
    };

    translateServiceMock = {
      instant: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        TaskDialogService,
        { provide: DialogService, useValue: dialogServiceMock },
        { provide: TranslateService, useValue: translateServiceMock },
      ],
    });

    service = TestBed.inject(TaskDialogService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('should open dialog with "CreateTask" header when no task is provided', () => {
    const closeSubject = new Subject<Task | undefined>();
    dialogServiceMock.open.mockReturnValue({
      onClose: closeSubject.asObservable(),
    });
    translateServiceMock.instant.mockImplementation((key) => key);

    const result$ = service.open();

    expect(dialogServiceMock.open).toHaveBeenCalledWith(TaskModal, {
      header: 'CreateTask',
      width: '70%',
      height: 'fit-content',
      draggable: false,
      data: { task: null },
      closable: false,
      modal: true,
      focusOnShow: false,
      breakpoints: {
        '1024px': '70%',
        '768px': '90%',
        '560px': '95%',
      },
    });

    expect(result$).toBeInstanceOf(Observable);
  });

  it('should open dialog with "EditTask" header when a task is provided', () => {
    const closeSubject = new Subject<Task | undefined>();
    dialogServiceMock.open.mockReturnValue({
      onClose: closeSubject.asObservable(),
    });
    translateServiceMock.instant.mockImplementation((key) => key);

    service.open(mockTask);

    expect(dialogServiceMock.open).toHaveBeenCalledWith(TaskModal, {
      header: 'EditTask',
      width: '70%',
      height: 'fit-content',
      draggable: false,
      data: { task: mockTask },
      closable: false,
      modal: true,
      focusOnShow: false,
      breakpoints: {
        '1024px': '70%',
        '768px': '90%',
        '560px': '95%',
      },
    });
  });

  it('should emit result when dialog closes', () => {
    const closeSubject = new Subject<Task | undefined>();
    dialogServiceMock.open.mockReturnValue({
      onClose: closeSubject.asObservable(),
    });
    translateServiceMock.instant.mockImplementation((key) => key);

    const result$ = service.open();
    const emitted: (Task | undefined)[] = [];
    result$.subscribe((value) => emitted.push(value));

    closeSubject.next(mockTask);
    closeSubject.complete();

    expect(emitted).toEqual([mockTask]);
  });

  it('should emit undefined when dialog closes without a task', () => {
    const closeSubject = new Subject<Task | undefined>();
    dialogServiceMock.open.mockReturnValue({
      onClose: closeSubject.asObservable(),
    });
    translateServiceMock.instant.mockImplementation((key) => key);

    const result$ = service.open();
    const emitted: (Task | undefined)[] = [];
    result$.subscribe((value) => emitted.push(value));

    closeSubject.next(undefined);
    closeSubject.complete();

    expect(emitted).toEqual([undefined]);
  });
});
