import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskWeeklyChangeChart } from './task-weekly-change-chart';

describe('TaskWeeklyChangeChart', () => {
  let component: TaskWeeklyChangeChart;
  let fixture: ComponentFixture<TaskWeeklyChangeChart>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskWeeklyChangeChart],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskWeeklyChangeChart);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
