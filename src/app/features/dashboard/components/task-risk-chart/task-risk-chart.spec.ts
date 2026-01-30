import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskRiskChart } from './task-risk-chart';

describe('TaskRiskChart', () => {
  let component: TaskRiskChart;
  let fixture: ComponentFixture<TaskRiskChart>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskRiskChart],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskRiskChart);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
