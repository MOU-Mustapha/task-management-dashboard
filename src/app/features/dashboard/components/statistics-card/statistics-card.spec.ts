import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { describe, it, expect, beforeEach } from 'vitest';

import { Statistic } from '../../models/statistics.model';
import { StatisticsCard } from './statistics-card';

describe('StatisticsCard', () => {
  let component: StatisticsCard;
  let fixture: ComponentFixture<StatisticsCard>;

  const baseStat: Statistic = {
    id: 'stat-001',
    title: 'Total Tasks',
    icon: '📌',
    value: 10,
    change: '2',
    changeLabel: 'from last week',
    changeType: 'positive',
    color: 'green',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        StatisticsCard,
        TranslateModule.forRoot({
          fallbackLang: 'en',
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(StatisticsCard);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    component.statistic = { ...baseStat };
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  describe('formattedChange', () => {
    it('should return empty string when change is "0"', () => {
      component.statistic = { ...baseStat, change: '0' };
      fixture.detectChanges();

      expect(component.formattedChange).toBe('');
    });

    it('should return empty string when change is "0.0"', () => {
      component.statistic = { ...baseStat, change: '0.0' };
      fixture.detectChanges();

      expect(component.formattedChange).toBe('');
    });

    it('should return change when it is not zero', () => {
      component.statistic = { ...baseStat, change: '5' };
      fixture.detectChanges();

      expect(component.formattedChange).toBe('5');
    });
  });

  describe('Template Rendering', () => {
    it('should render icon, title and value', () => {
      component.statistic = { ...baseStat };
      fixture.detectChanges();

      const native = fixture.debugElement.nativeElement as HTMLElement;

      const icon = native.querySelector('.icon');
      expect(icon?.textContent?.trim()).toBe('📌');

      const title = native.querySelector('.title');
      expect(title?.textContent?.trim()).toBe('Total Tasks');

      const value = native.querySelector('.body span');
      expect(value?.textContent?.trim()).toBe('10');
    });

    it('should bind footer text color using statistic.color', () => {
      component.statistic = { ...baseStat, color: 'rgb(255, 0, 0)' };
      fixture.detectChanges();

      const native = fixture.debugElement.nativeElement as HTMLElement;
      const footerSpan = native.querySelector('.footer span') as HTMLElement;

      expect(footerSpan.style.color).toBe('rgb(255, 0, 0)');
    });

    it('should render formattedChange and changeLabel in footer', () => {
      component.statistic = { ...baseStat, change: '2', changeLabel: 'from last week' };
      fixture.detectChanges();

      const native = fixture.debugElement.nativeElement as HTMLElement;
      const footerSpan = native.querySelector('.footer span');

      expect(footerSpan?.textContent).toContain('2');
      expect(footerSpan?.textContent).toContain('from last week');
    });

    it('should not render numeric change text when formattedChange is empty', () => {
      component.statistic = { ...baseStat, change: '0', changeLabel: 'from last week' };
      fixture.detectChanges();

      const native = fixture.debugElement.nativeElement as HTMLElement;
      const footerSpan = native.querySelector('.footer span');

      expect(footerSpan?.textContent?.trim()).toBe('from last week');
    });
  });
});
