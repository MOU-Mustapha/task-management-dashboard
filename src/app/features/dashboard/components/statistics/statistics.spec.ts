import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { describe, it, expect, beforeEach } from 'vitest';

import { Statistic } from '../../models/statistics.model';
import { Statistics } from './statistics';

describe('Statistics', () => {
  let component: Statistics;
  let fixture: ComponentFixture<Statistics>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        Statistics,
        TranslateModule.forRoot({
          fallbackLang: 'en',
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Statistics);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    component.statistics = [];
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('should render one statistics card per statistic item', () => {
    const stats: Statistic[] = [
      {
        id: 'stat-001',
        title: 'Total Tasks',
        icon: '📌',
        value: 10,
        change: '2',
        changeLabel: 'from last week',
        changeType: 'positive',
        color: 'green',
      },
      {
        id: 'stat-002',
        title: 'Completed Tasks',
        icon: '✅',
        value: 7,
        change: '1',
        changeLabel: 'from last week',
        changeType: 'positive',
        color: 'green',
      },
      {
        id: 'stat-003',
        title: 'In Progress Tasks',
        icon: '⏳',
        value: 2,
        change: '0',
        changeLabel: 'from last week',
        changeType: 'neutral',
        color: 'gray',
      },
    ];

    component.statistics = stats;
    fixture.detectChanges();

    const cards = fixture.debugElement.nativeElement.querySelectorAll('app-statistics-card');
    expect(cards.length).toBe(3);
  });

  it('should render the row wrapper container', () => {
    component.statistics = [];
    fixture.detectChanges();

    const row = fixture.debugElement.nativeElement.querySelector('.row.row-gap-4');
    expect(row).toBeTruthy();
  });

  it('should render nothing when statistics is an empty array', () => {
    component.statistics = [];
    fixture.detectChanges();

    const cards = fixture.debugElement.nativeElement.querySelectorAll('app-statistics-card');
    expect(cards.length).toBe(0);
  });
});
