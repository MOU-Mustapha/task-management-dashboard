import { Component, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { describe, it, expect, beforeEach, vi } from 'vitest';

import type { Task } from '../../models/task.model';
import { TasksFacade } from '../../services/tasks.facade';
import { TasksPage } from './tasks-page';

@Component({
  selector: 'app-task-filter',
  standalone: true,
  template: '',
})
class TaskFilterStub {}

@Component({
  selector: 'app-task-board',
  standalone: true,
  template: '',
})
class TaskBoardStub {
  @Input({ required: true }) todo!: Task[];
  @Input({ required: true }) inProgress!: Task[];
  @Input({ required: true }) done!: Task[];
}

describe('TasksPage', () => {
  let fixture: ComponentFixture<TasksPage>;

  let facadeMock: {
    todo: ReturnType<typeof vi.fn>;
    inProgress: ReturnType<typeof vi.fn>;
    done: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    facadeMock = {
      todo: vi.fn(() => []),
      inProgress: vi.fn(() => []),
      done: vi.fn(() => []),
    };

    await TestBed.configureTestingModule({
      imports: [TasksPage],
      providers: [{ provide: TasksFacade, useValue: facadeMock }],
    })
      .overrideComponent(TasksPage, {
        set: {
          imports: [TaskFilterStub, TaskBoardStub],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(TasksPage);
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render task filter and task board', () => {
    fixture.detectChanges();

    expect(fixture.debugElement.query(By.css('app-task-filter'))).toBeTruthy();
    expect(fixture.debugElement.query(By.css('app-task-board'))).toBeTruthy();
  });

  it('should bind board inputs from facade', () => {
    const todo: Task[] = [
      {
        id: 't1',
        title: 'Todo',
        description: 'd',
        status: 'todo',
        priority: 'low',
        dueDate: '2026-01-01',
        completedAt: '',
        assignee: { id: 'a1', name: 'A', avatar: '', email: 'a@a.com' },
        tags: [],
        createdAt: '2026-01-01',
        updatedAt: '2026-01-01',
      },
    ];

    const inProgress: Task[] = [
      {
        id: 't2',
        title: 'In progress',
        description: 'd',
        status: 'in_progress',
        priority: 'medium',
        dueDate: '2026-01-01',
        completedAt: '',
        assignee: { id: 'a1', name: 'A', avatar: '', email: 'a@a.com' },
        tags: [],
        createdAt: '2026-01-01',
        updatedAt: '2026-01-01',
      },
    ];

    const done: Task[] = [
      {
        id: 't3',
        title: 'Done',
        description: 'd',
        status: 'done',
        priority: 'high',
        dueDate: '2026-01-01',
        completedAt: '2026-01-02',
        assignee: { id: 'a1', name: 'A', avatar: '', email: 'a@a.com' },
        tags: [],
        createdAt: '2026-01-01',
        updatedAt: '2026-01-01',
      },
    ];

    facadeMock.todo.mockReturnValue(todo);
    facadeMock.inProgress.mockReturnValue(inProgress);
    facadeMock.done.mockReturnValue(done);

    fixture.detectChanges();

    const boardEl = fixture.debugElement.query(By.css('app-task-board'));
    const board = boardEl.componentInstance as TaskBoardStub;

    expect(board.todo).toEqual(todo);
    expect(board.inProgress).toEqual(inProgress);
    expect(board.done).toEqual(done);
  });
});
