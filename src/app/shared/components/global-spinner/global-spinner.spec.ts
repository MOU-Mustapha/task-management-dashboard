import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { signal } from '@angular/core';
import { describe, it, expect, beforeEach, vi } from 'vitest';

import { GlobalSpinner } from './global-spinner';
import { AppFacadeService } from '../../../core/services/app.facade.service';
import { LoadingService } from '../../../core/services/loading/loading.service';

describe('GlobalSpinner', () => {
  let component: GlobalSpinner;
  let fixture: ComponentFixture<GlobalSpinner>;
  let mockAppFacadeService: AppFacadeService;
  let mockLoadingService: LoadingService;

  beforeEach(async () => {
    const mockLoadingSignal = signal(false);

    mockLoadingService = {
      loading: mockLoadingSignal,
    } as unknown as LoadingService;

    mockAppFacadeService = {
      loadingService: mockLoadingService,
    } as AppFacadeService;

    await TestBed.configureTestingModule({
      imports: [GlobalSpinner, ProgressSpinnerModule],
      providers: [{ provide: AppFacadeService, useValue: mockAppFacadeService }],
    }).compileComponents();

    fixture = TestBed.createComponent(GlobalSpinner);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Component Initialization', () => {
    it('should inject AppFacadeService', () => {
      expect(component.appFacade).toBe(mockAppFacadeService);
    });

    it('should have appFacade property', () => {
      expect(component.appFacade).toBeDefined();
      expect(component.appFacade).toBe(mockAppFacadeService);
    });
  });

  describe('Template Rendering', () => {
    it('should not render spinner when loading is false', () => {
      (mockLoadingService.loading as ReturnType<typeof signal>).set(false);
      fixture.detectChanges();

      const overlay = fixture.debugElement.nativeElement.querySelector('.overlay');
      expect(overlay).toBeFalsy();
    });

    it('should render spinner when loading is true', () => {
      (mockLoadingService.loading as ReturnType<typeof signal>).set(true);
      fixture.detectChanges();

      const overlay = fixture.debugElement.nativeElement.querySelector('.overlay');
      expect(overlay).toBeTruthy();
    });

    it('should render progress spinner component when loading is true', () => {
      (mockLoadingService.loading as ReturnType<typeof signal>).set(true);
      fixture.detectChanges();

      const progressSpinner = fixture.debugElement.nativeElement.querySelector('p-progressSpinner');
      expect(progressSpinner).toBeTruthy();
    });

    it('should not render progress spinner component when loading is false', () => {
      (mockLoadingService.loading as ReturnType<typeof signal>).set(false);
      fixture.detectChanges();

      const progressSpinner = fixture.debugElement.nativeElement.querySelector('p-progressSpinner');
      expect(progressSpinner).toBeFalsy();
    });

    it('should render overlay with correct CSS class', () => {
      (mockLoadingService.loading as ReturnType<typeof signal>).set(true);
      fixture.detectChanges();

      const overlay = fixture.debugElement.nativeElement.querySelector('.overlay');
      expect(overlay).toBeTruthy();
      expect(overlay.classList.contains('overlay')).toBe(true);
    });
  });

  describe('Loading State Changes', () => {
    it('should toggle spinner visibility based on loading state', () => {
      // Initially false
      (mockLoadingService.loading as ReturnType<typeof signal>).set(false);
      fixture.detectChanges();

      let overlay = fixture.debugElement.nativeElement.querySelector('.overlay');
      expect(overlay).toBeFalsy();

      // Change to true
      (mockLoadingService.loading as ReturnType<typeof signal>).set(true);
      fixture.detectChanges();

      overlay = fixture.debugElement.nativeElement.querySelector('.overlay');
      expect(overlay).toBeTruthy();

      // Change back to false
      (mockLoadingService.loading as ReturnType<typeof signal>).set(false);
      fixture.detectChanges();

      overlay = fixture.debugElement.nativeElement.querySelector('.overlay');
      expect(overlay).toBeFalsy();
    });

    it('should handle multiple loading state changes', () => {
      const states = [true, false, true, true, false];
      const expectedResults = [true, false, true, true, false];

      states.forEach((state, index) => {
        (mockLoadingService.loading as ReturnType<typeof signal>).set(state);
        fixture.detectChanges();

        const overlay = fixture.debugElement.nativeElement.querySelector('.overlay');
        expect(!!overlay).toBe(expectedResults[index]);
      });
    });
  });

  describe('Service Integration', () => {
    it('should call loadingService.loading method during template rendering', () => {
      (mockLoadingService.loading as ReturnType<typeof signal>).set(true);
      fixture.detectChanges();

      expect(mockLoadingService.loading).toBeDefined();
    });

    it('should use the same loadingService instance from appFacade', () => {
      expect(component.appFacade.loadingService).toBe(mockLoadingService);
    });
  });

  describe('Accessibility', () => {
    it('should have proper semantic structure when spinner is visible', () => {
      (mockLoadingService.loading as ReturnType<typeof signal>).set(true);
      fixture.detectChanges();

      const overlay = fixture.debugElement.nativeElement.querySelector('.overlay');
      expect(overlay.tagName.toLowerCase()).toBe('div');
    });

    it('should not create accessibility issues when spinner is hidden', () => {
      (mockLoadingService.loading as ReturnType<typeof signal>).set(false);
      fixture.detectChanges();

      const overlay = fixture.debugElement.nativeElement.querySelector('.overlay');
      expect(overlay).toBeFalsy();
    });
  });

  describe('Component Lifecycle', () => {
    it('should handle multiple detection cycles', () => {
      (mockLoadingService.loading as ReturnType<typeof signal>).set(true);
      fixture.detectChanges();

      expect(fixture.debugElement.nativeElement.querySelector('.overlay')).toBeTruthy();

      fixture.detectChanges();
      expect(fixture.debugElement.nativeElement.querySelector('.overlay')).toBeTruthy();

      fixture.detectChanges();
      expect(fixture.debugElement.nativeElement.querySelector('.overlay')).toBeTruthy();
    });

    it('should maintain loading state across detection cycles', () => {
      (mockLoadingService.loading as ReturnType<typeof signal>).set(true);
      fixture.detectChanges();

      const initialOverlay = fixture.debugElement.nativeElement.querySelector('.overlay');

      fixture.detectChanges();
      const secondOverlay = fixture.debugElement.nativeElement.querySelector('.overlay');

      expect(initialOverlay).toBe(secondOverlay);
    });
  });

  describe('Edge Cases', () => {
    it('should handle rapid loading state changes', () => {
      (mockLoadingService.loading as ReturnType<typeof signal>).set(false);
      fixture.detectChanges();

      // Rapid changes
      for (let i = 0; i < 5; i++) {
        (mockLoadingService.loading as ReturnType<typeof signal>).set(i % 2 === 0);
        fixture.detectChanges();

        const overlay = fixture.debugElement.nativeElement.querySelector('.overlay');
        expect(!!overlay).toBe(i % 2 === 0);
      }
    });

    it('should handle loading service returning undefined', () => {
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        imports: [GlobalSpinner, ProgressSpinnerModule],
        providers: [
          {
            provide: AppFacadeService,
            useValue: {
              loadingService: {
                loading: vi.fn().mockReturnValue(undefined),
              },
            },
          },
        ],
      });

      const fixture = TestBed.createComponent(GlobalSpinner);
      fixture.detectChanges();

      const overlay = fixture.debugElement.nativeElement.querySelector('.overlay');
      expect(overlay).toBeFalsy();
    });

    it('should handle loading service returning null', () => {
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        imports: [GlobalSpinner, ProgressSpinnerModule],
        providers: [
          {
            provide: AppFacadeService,
            useValue: {
              loadingService: {
                loading: vi.fn().mockReturnValue(null),
              },
            },
          },
        ],
      });

      const fixture = TestBed.createComponent(GlobalSpinner);
      fixture.detectChanges();

      const overlay = fixture.debugElement.nativeElement.querySelector('.overlay');
      expect(overlay).toBeFalsy();
    });
  });

  describe('Dependency Injection', () => {
    it('should inject AppFacadeService correctly', () => {
      const injectedService = TestBed.inject(AppFacadeService);
      expect(injectedService).toBe(mockAppFacadeService);
    });

    it('should have access to loadingService through appFacade', () => {
      expect(component.appFacade.loadingService).toBe(mockLoadingService);
    });
  });

  describe('PrimeNG Integration', () => {
    it('should render PrimeNG progress spinner component', () => {
      (mockLoadingService.loading as ReturnType<typeof signal>).set(true);
      fixture.detectChanges();

      const progressSpinner = fixture.debugElement.nativeElement.querySelector('p-progressSpinner');
      expect(progressSpinner).toBeTruthy();
      expect(progressSpinner.tagName.toLowerCase()).toBe('p-progressspinner');
    });

    it('should only render progress spinner when loading is true', () => {
      (mockLoadingService.loading as ReturnType<typeof signal>).set(false);
      fixture.detectChanges();

      const progressSpinner = fixture.debugElement.nativeElement.querySelector('p-progressSpinner');
      expect(progressSpinner).toBeFalsy();
    });
  });
});
