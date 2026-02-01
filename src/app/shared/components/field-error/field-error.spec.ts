import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { describe, it, expect, beforeEach } from 'vitest';

import { FieldError } from './field-error';

describe('FieldError', () => {
  let component: FieldError;
  let fixture: ComponentFixture<FieldError>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FieldError,
        TranslateModule.forRoot({
          fallbackLang: 'en',
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FieldError);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Input Properties', () => {
    it('should have errorMsg input', () => {
      expect(Object.hasOwn(component, 'errorMsg')).toBe(true);
    });

    it('should have displayError input', () => {
      expect(Object.hasOwn(component, 'displayError')).toBe(true);
    });

    it('should accept errorMsg input', () => {
      component.errorMsg = 'This field is required';
      fixture.detectChanges();

      expect(component.errorMsg).toBe('This field is required');
    });

    it('should accept displayError input', () => {
      component.displayError = true;
      fixture.detectChanges();

      expect(component.displayError).toBe(true);
    });

    it('should accept displayError false input', () => {
      component.displayError = false;
      fixture.detectChanges();

      expect(component.displayError).toBe(false);
    });

    it('should initialize with undefined inputs', () => {
      expect(component.errorMsg).toBeUndefined();
      expect(component.displayError).toBeUndefined();
    });
  });

  describe('Template Rendering', () => {
    it('should render error message when displayError is true', () => {
      component.errorMsg = 'Test error message';
      component.displayError = true;
      fixture.detectChanges();

      const errorElement = fixture.debugElement.nativeElement.querySelector('.error-msg');
      expect(errorElement).toBeTruthy();
      expect(errorElement.textContent.trim()).toContain('Test error message');
    });

    it('should not render error message when displayError is false', () => {
      component.errorMsg = 'Test error message';
      component.displayError = false;
      fixture.detectChanges();

      const errorElement = fixture.debugElement.nativeElement.querySelector('.error-msg');
      expect(errorElement).toBeFalsy();
    });

    it('should render error message with translate pipe', () => {
      component.errorMsg = 'validation.required';
      component.displayError = true;
      fixture.detectChanges();

      const errorElement = fixture.debugElement.nativeElement.querySelector('.error-msg');
      expect(errorElement).toBeTruthy();
      expect(errorElement.textContent.trim()).toContain('validation.required');
    });

    it('should render error message with correct CSS class', () => {
      component.errorMsg = 'Test error';
      component.displayError = true;
      fixture.detectChanges();

      const errorElement = fixture.debugElement.nativeElement.querySelector('.error-msg');
      expect(errorElement).toBeTruthy();
      expect(errorElement.classList.contains('error-msg')).toBe(true);
    });

    it('should render empty error message when errorMsg is empty string', () => {
      component.errorMsg = '';
      component.displayError = true;
      fixture.detectChanges();

      const errorElement = fixture.debugElement.nativeElement.querySelector('.error-msg');
      expect(errorElement).toBeTruthy();
      expect(errorElement.textContent.trim()).toBe('');
    });

    it('should render error message with spaces', () => {
      component.errorMsg = '  Error with spaces  ';
      component.displayError = true;
      fixture.detectChanges();

      const errorElement = fixture.debugElement.nativeElement.querySelector('.error-msg');
      expect(errorElement).toBeTruthy();
      expect(errorElement.textContent.trim()).toBe('Error with spaces');
    });

    it('should render error message with special characters', () => {
      component.errorMsg = 'Error! @#$%';
      component.displayError = true;
      fixture.detectChanges();

      const errorElement = fixture.debugElement.nativeElement.querySelector('.error-msg');
      expect(errorElement).toBeTruthy();
      expect(errorElement.textContent.trim()).toBe('Error! @#$%');
    });

    it('should render error message with HTML-like content', () => {
      component.errorMsg = '<script>alert("xss")</script>';
      component.displayError = true;
      fixture.detectChanges();

      const errorElement = fixture.debugElement.nativeElement.querySelector('.error-msg');
      expect(errorElement).toBeTruthy();
      expect(errorElement.textContent.trim()).toBe('<script>alert("xss")</script>');
    });
  });

  describe('Conditional Rendering', () => {
    it('should not render when displayError is false even with errorMsg', () => {
      component.errorMsg = 'Should not show';
      component.displayError = false;
      fixture.detectChanges();

      const errorElement = fixture.debugElement.nativeElement.querySelector('.error-msg');
      expect(errorElement).toBeFalsy();
    });

    it('should render when displayError is true even with empty errorMsg', () => {
      component.errorMsg = '';
      component.displayError = true;
      fixture.detectChanges();

      const errorElement = fixture.debugElement.nativeElement.querySelector('.error-msg');
      expect(errorElement).toBeTruthy();
    });
  });

  describe('Accessibility', () => {
    it('should have proper semantic structure for error message', () => {
      component.errorMsg = 'Error message';
      component.displayError = true;
      fixture.detectChanges();

      const errorElement = fixture.debugElement.nativeElement.querySelector('.error-msg');
      expect(errorElement).toBeTruthy();
      expect(errorElement.tagName.toLowerCase()).toBe('div');
    });

    it('should preserve error message content for screen readers', () => {
      component.errorMsg = 'This field is required';
      component.displayError = true;
      fixture.detectChanges();

      const errorElement = fixture.debugElement.nativeElement.querySelector('.error-msg');
      expect(errorElement).toBeTruthy();
      expect(errorElement.textContent.trim()).toBe('This field is required');
    });

    it('should handle empty error message gracefully', () => {
      component.errorMsg = '';
      component.displayError = true;
      fixture.detectChanges();

      const errorElement = fixture.debugElement.nativeElement.querySelector('.error-msg');
      expect(errorElement).toBeTruthy();
      expect(errorElement.textContent.trim()).toBe('');
    });
  });

  describe('Edge Cases', () => {
    it('should handle very long error messages', () => {
      const longMessage =
        'This is a very long error message that could potentially cause issues with layout or display if not handled properly by the component styling and template structure';
      component.errorMsg = longMessage;
      component.displayError = true;
      fixture.detectChanges();

      const errorElement = fixture.debugElement.nativeElement.querySelector('.error-msg');
      expect(errorElement).toBeTruthy();
      expect(errorElement.textContent.trim()).toBe(longMessage);
    });

    it('should handle null-like values gracefully', () => {
      component.errorMsg = 'null';
      component.displayError = true;
      fixture.detectChanges();

      const errorElement = fixture.debugElement.nativeElement.querySelector('.error-msg');
      expect(errorElement).toBeTruthy();
      expect(errorElement.textContent.trim()).toBe('null');
    });

    it('should handle undefined-like values gracefully', () => {
      component.errorMsg = 'undefined';
      component.displayError = true;
      fixture.detectChanges();

      const errorElement = fixture.debugElement.nativeElement.querySelector('.error-msg');
      expect(errorElement).toBeTruthy();
      expect(errorElement.textContent.trim()).toBe('undefined');
    });

    it('should handle numeric error messages', () => {
      component.errorMsg = '404';
      component.displayError = true;
      fixture.detectChanges();

      const errorElement = fixture.debugElement.nativeElement.querySelector('.error-msg');
      expect(errorElement).toBeTruthy();
      expect(errorElement.textContent.trim()).toBe('404');
    });
  });

  describe('Component Lifecycle', () => {
    it('should initialize without inputs', () => {
      expect(component).toBeTruthy();
      expect(component.errorMsg).toBeUndefined();
      expect(component.displayError).toBeUndefined();
    });

    it('should handle multiple detection cycles', () => {
      component.errorMsg = 'Test error';
      component.displayError = true;
      fixture.detectChanges();

      expect(fixture.debugElement.nativeElement.querySelector('.error-msg')).toBeTruthy();

      fixture.detectChanges();
      expect(fixture.debugElement.nativeElement.querySelector('.error-msg')).toBeTruthy();

      fixture.detectChanges();
      expect(fixture.debugElement.nativeElement.querySelector('.error-msg')).toBeTruthy();
    });
  });
});
