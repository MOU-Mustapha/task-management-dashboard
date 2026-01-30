import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskCompletionChart } from './task-completion-chart';

describe('TaskCompletionChart', () => {
  let component: TaskCompletionChart;
  let fixture: ComponentFixture<TaskCompletionChart>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskCompletionChart],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskCompletionChart);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
