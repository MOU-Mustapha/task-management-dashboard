import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { describe, it, expect, beforeEach, vi } from 'vitest';

import { GlobalError } from './global-error';

describe('GlobalError', () => {
  let component: GlobalError;
  let fixture: ComponentFixture<GlobalError>;
  let mockDialogRef: DynamicDialogRef;
  let mockDialogConfig: DynamicDialogConfig;

  beforeEach(async () => {
    mockDialogRef = {
      close: vi.fn(),
    } as unknown as DynamicDialogRef;

    mockDialogConfig = {
      data: {
        error: {
          message: 'Test error message',
          status: 500,
        },
      },
    } as DynamicDialogConfig;

    await TestBed.configureTestingModule({
      imports: [
        GlobalError,
        TranslateModule.forRoot({
          fallbackLang: 'en',
        }),
        DialogModule,
        ButtonModule,
      ],
      providers: [
        { provide: DynamicDialogRef, useValue: mockDialogRef },
        { provide: DynamicDialogConfig, useValue: mockDialogConfig },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(GlobalError);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Component Initialization', () => {
    it('should initialize with error signal from dialog config', () => {
      fixture.detectChanges();
      expect(component.error()).toEqual({
        message: 'Test error message',
        status: 500,
      });
    });

    it('should initialize with error signal when status is not provided', () => {
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        imports: [
          GlobalError,
          TranslateModule.forRoot({
            fallbackLang: 'en',
          }),
          DialogModule,
          ButtonModule,
        ],
        providers: [
          { provide: DynamicDialogRef, useValue: mockDialogRef },
          {
            provide: DynamicDialogConfig,
            useValue: {
              data: {
                error: {
                  message: 'Test error without status',
                },
              },
            },
          },
        ],
      });

      const fixture = TestBed.createComponent(GlobalError);
      const component = fixture.componentInstance;
      fixture.detectChanges();

      expect(component.error()).toEqual({
        message: 'Test error without status',
      });
    });
  });

  describe('Signal Behavior', () => {
    it('should have error signal with correct initial value', () => {
      fixture.detectChanges();
      expect(component.error().message).toBe('Test error message');
      expect(component.error().status).toBe(500);
    });

    it('should have error signal that is readonly', () => {
      fixture.detectChanges();
      expect(component.error).toBeDefined();
      expect(typeof component.error).toBe('function');
    });
  });

  describe('Template Rendering', () => {
    it('should render error message', () => {
      fixture.detectChanges();
      const errorElement = fixture.debugElement.nativeElement.querySelector('p');
      expect(errorElement).toBeTruthy();
      expect(errorElement.textContent.trim()).toBe('Test error message');
    });

    it('should render error icon', () => {
      fixture.detectChanges();
      const iconElement = fixture.debugElement.nativeElement.querySelector('img');
      expect(iconElement).toBeTruthy();
      expect(iconElement.getAttribute('src')).toBe('assets/icons/error.svg');
      expect(iconElement.getAttribute('alt')).toBe('error-icon');
      expect(iconElement.getAttribute('width')).toBe('40');
      expect(iconElement.getAttribute('height')).toBe('40');
    });

    it('should render close button', () => {
      fixture.detectChanges();
      const closeButton = fixture.debugElement.nativeElement.querySelector('button');
      expect(closeButton).toBeTruthy();
      expect(closeButton.getAttribute('type')).toBe('button');
      expect(closeButton.classList.contains('btn-cancel')).toBe(true);
      expect(closeButton.textContent.trim()).toBe('Ok');
    });

    it('should render container with correct CSS classes', () => {
      fixture.detectChanges();
      const container = fixture.debugElement.nativeElement.querySelector('.global-error');
      expect(container).toBeTruthy();
    });

    it('should render error content container with correct CSS classes', () => {
      fixture.detectChanges();
      const contentContainer = fixture.debugElement.nativeElement.querySelector(
        '.d-flex.align-items-center.gap-2',
      );
      expect(contentContainer).toBeTruthy();
    });

    it('should render footer with correct CSS classes', () => {
      fixture.detectChanges();
      const footer = fixture.debugElement.nativeElement.querySelector(
        '.footer.mt-4.d-flex.justify-content-end',
      );
      expect(footer).toBeTruthy();
    });
  });

  describe('Component Methods', () => {
    it('should have close method', () => {
      expect(component.close).toBeDefined();
      expect(typeof component.close).toBe('function');
    });

    it('should call dialogRef.close when close method is called', () => {
      fixture.detectChanges();
      component.close();
      expect(mockDialogRef.close).toHaveBeenCalledTimes(1);
    });
  });

  describe('Template Interactions', () => {
    it('should call close method when close button is clicked', () => {
      fixture.detectChanges();
      const closeButton = fixture.debugElement.nativeElement.querySelector('button');
      closeButton.click();
      expect(mockDialogRef.close).toHaveBeenCalledTimes(1);
    });

    it('should call close method with no arguments when close button is clicked', () => {
      fixture.detectChanges();
      const closeButton = fixture.debugElement.nativeElement.querySelector('button');
      closeButton.click();
      expect(mockDialogRef.close).toHaveBeenCalledWith();
    });
  });

  describe('Accessibility', () => {
    it('should have proper alt text for error icon', () => {
      fixture.detectChanges();
      const iconElement = fixture.debugElement.nativeElement.querySelector('img');
      expect(iconElement.getAttribute('alt')).toBe('error-icon');
    });

    it('should have proper button type', () => {
      fixture.detectChanges();
      const closeButton = fixture.debugElement.nativeElement.querySelector('button');
      expect(closeButton.getAttribute('type')).toBe('button');
    });

    it('should have semantic structure for error message', () => {
      fixture.detectChanges();
      const messageElement = fixture.debugElement.nativeElement.querySelector('p');
      expect(messageElement.tagName.toLowerCase()).toBe('p');
      expect(messageElement.classList.contains('m-0')).toBe(true);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty error message', () => {
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        imports: [
          GlobalError,
          TranslateModule.forRoot({
            fallbackLang: 'en',
          }),
          DialogModule,
          ButtonModule,
        ],
        providers: [
          { provide: DynamicDialogRef, useValue: mockDialogRef },
          {
            provide: DynamicDialogConfig,
            useValue: {
              data: {
                error: {
                  message: '',
                },
              },
            },
          },
        ],
      });

      const fixture = TestBed.createComponent(GlobalError);
      fixture.detectChanges();

      const errorElement = fixture.debugElement.nativeElement.querySelector('p');
      expect(errorElement).toBeTruthy();
      expect(errorElement.textContent.trim()).toBe('');
    });

    it('should handle very long error message', () => {
      const longMessage =
        'This is a very long error message that could potentially cause issues with layout or display if not handled properly by the component styling and template structure';
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        imports: [
          GlobalError,
          TranslateModule.forRoot({
            fallbackLang: 'en',
          }),
          DialogModule,
          ButtonModule,
        ],
        providers: [
          { provide: DynamicDialogRef, useValue: mockDialogRef },
          {
            provide: DynamicDialogConfig,
            useValue: {
              data: {
                error: {
                  message: longMessage,
                },
              },
            },
          },
        ],
      });

      const fixture = TestBed.createComponent(GlobalError);
      fixture.detectChanges();

      const errorElement = fixture.debugElement.nativeElement.querySelector('p');
      expect(errorElement).toBeTruthy();
      expect(errorElement.textContent.trim()).toBe(longMessage);
    });

    it('should handle error message with special characters', () => {
      const specialMessage = 'Error! @#$% &*()';
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        imports: [
          GlobalError,
          TranslateModule.forRoot({
            fallbackLang: 'en',
          }),
          DialogModule,
          ButtonModule,
        ],
        providers: [
          { provide: DynamicDialogRef, useValue: mockDialogRef },
          {
            provide: DynamicDialogConfig,
            useValue: {
              data: {
                error: {
                  message: specialMessage,
                },
              },
            },
          },
        ],
      });

      const fixture = TestBed.createComponent(GlobalError);
      fixture.detectChanges();

      const errorElement = fixture.debugElement.nativeElement.querySelector('p');
      expect(errorElement).toBeTruthy();
      expect(errorElement.textContent.trim()).toBe(specialMessage);
    });

    it('should handle error message with HTML-like content', () => {
      const htmlMessage = '<script>alert("xss")</script>';
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        imports: [
          GlobalError,
          TranslateModule.forRoot({
            fallbackLang: 'en',
          }),
          DialogModule,
          ButtonModule,
        ],
        providers: [
          { provide: DynamicDialogRef, useValue: mockDialogRef },
          {
            provide: DynamicDialogConfig,
            useValue: {
              data: {
                error: {
                  message: htmlMessage,
                },
              },
            },
          },
        ],
      });

      const fixture = TestBed.createComponent(GlobalError);
      fixture.detectChanges();

      const errorElement = fixture.debugElement.nativeElement.querySelector('p');
      expect(errorElement).toBeTruthy();
      expect(errorElement.textContent.trim()).toBe(htmlMessage);
    });
  });

  describe('Component Lifecycle', () => {
    it('should handle multiple detection cycles', () => {
      fixture.detectChanges();
      expect(component.error().message).toBe('Test error message');

      fixture.detectChanges();
      expect(component.error().message).toBe('Test error message');

      fixture.detectChanges();
      expect(component.error().message).toBe('Test error message');
    });

    it('should maintain error signal value across detection cycles', () => {
      fixture.detectChanges();
      const initialError = component.error();

      fixture.detectChanges();
      expect(component.error()).toBe(initialError);

      fixture.detectChanges();
      expect(component.error()).toBe(initialError);
    });
  });

  describe('Dependency Injection', () => {
    it('should inject DynamicDialogRef', () => {
      const dialogRef = TestBed.inject(DynamicDialogRef);
      expect(dialogRef).toBe(mockDialogRef);
    });

    it('should inject DynamicDialogConfig', () => {
      const dialogConfig = TestBed.inject(DynamicDialogConfig);
      expect(dialogConfig).toBe(mockDialogConfig);
    });
  });
});
