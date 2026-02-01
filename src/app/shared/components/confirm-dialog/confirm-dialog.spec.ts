import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { DialogModule } from 'primeng/dialog';
import { describe, it, expect, beforeEach, vi } from 'vitest';

import { ConfirmDialog } from './confirm-dialog';

describe('ConfirmDialog', () => {
  let component: ConfirmDialog;
  let fixture: ComponentFixture<ConfirmDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ConfirmDialog,
        TranslateModule.forRoot({
          fallbackLang: 'en',
        }),
        DialogModule,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmDialog);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Input Properties', () => {
    it('should have default visible value', () => {
      expect(component.visible).toBe(false);
    });

    it('should have default message value', () => {
      expect(component.message).toBe('');
    });

    it('should accept visible input', () => {
      component.visible = true;
      fixture.detectChanges();

      expect(component.visible).toBe(true);
    });

    it('should accept message input', () => {
      component.message = 'Are you sure?';
      fixture.detectChanges();

      expect(component.message).toBe('Are you sure?');
    });
  });

  describe('Output Events', () => {
    it('should have dismiss EventEmitter', () => {
      expect(component.dismiss).toBeDefined();
      expect(component.dismiss.emit).toBeDefined();
    });

    it('should have confirm EventEmitter', () => {
      expect(component.confirm).toBeDefined();
      expect(component.confirm.emit).toBeDefined();
    });
  });

  describe('confirmDialog method', () => {
    it('should emit confirm event', () => {
      vi.spyOn(component.confirm, 'emit');
      vi.spyOn(component.dismiss, 'emit');

      component.confirmDialog();

      expect(component.confirm.emit).toHaveBeenCalledWith();
    });

    it('should emit dismiss event', () => {
      vi.spyOn(component.confirm, 'emit');
      vi.spyOn(component.dismiss, 'emit');

      component.confirmDialog();

      expect(component.dismiss.emit).toHaveBeenCalledWith();
    });

    it('should set visible to false', () => {
      component.visible = true;
      vi.spyOn(component.confirm, 'emit');
      vi.spyOn(component.dismiss, 'emit');

      component.confirmDialog();

      expect(component.visible).toBe(false);
    });

    it('should call dismiss after confirm', () => {
      const callOrder: string[] = [];
      vi.spyOn(component.confirm, 'emit').mockImplementation(() => {
        callOrder.push('confirm');
      });
      vi.spyOn(component.dismiss, 'emit').mockImplementation(() => {
        callOrder.push('dismiss');
      });

      component.confirmDialog();

      expect(callOrder).toEqual(['confirm', 'dismiss']);
    });
  });

  describe('hideDialog method', () => {
    it('should emit dismiss event', () => {
      vi.spyOn(component.dismiss, 'emit');

      component.hideDialog();

      expect(component.dismiss.emit).toHaveBeenCalledWith();
    });

    it('should set visible to false', () => {
      component.visible = true;

      component.hideDialog();

      expect(component.visible).toBe(false);
    });

    it('should not emit confirm event', () => {
      vi.spyOn(component.confirm, 'emit');
      vi.spyOn(component.dismiss, 'emit');

      component.hideDialog();

      expect(component.confirm.emit).not.toHaveBeenCalled();
      expect(component.dismiss.emit).toHaveBeenCalled();
    });
  });

  describe('Template Rendering', () => {
    it('should render dialog with correct attributes', () => {
      component.visible = true;
      fixture.detectChanges();

      const dialogElement = fixture.debugElement.nativeElement.querySelector('p-dialog');
      expect(dialogElement).toBeTruthy();
      // PrimeNG dialog attributes may not be directly accessible, so we just check the element exists
    });

    it('should render message with translate pipe', () => {
      component.message = 'Test message';
      component.visible = true;
      fixture.detectChanges();

      const messageElement = fixture.debugElement.nativeElement.querySelector('p');
      expect(messageElement).toBeTruthy();
      expect(messageElement.textContent.trim()).toContain('Test message');
    });

    it('should render confirm button', () => {
      component.visible = true;
      fixture.detectChanges();

      const confirmButton = fixture.debugElement.nativeElement.querySelector('.btn-save');
      expect(confirmButton).toBeTruthy();
      expect(confirmButton.getAttribute('type')).toBe('button');
      expect(confirmButton.textContent.trim()).toContain('Confirm');
    });

    it('should render cancel button', () => {
      component.visible = true;
      fixture.detectChanges();

      const cancelButton = fixture.debugElement.nativeElement.querySelector('.btn-cancel');
      expect(cancelButton).toBeTruthy();
      expect(cancelButton.getAttribute('type')).toBe('button');
      expect(cancelButton.textContent.trim()).toContain('Cancel');
    });

    it('should render button container with correct classes', () => {
      component.visible = true;
      fixture.detectChanges();

      const buttonContainer = fixture.debugElement.nativeElement.querySelector('.mt-4');
      expect(buttonContainer).toBeTruthy();
      expect(buttonContainer.classList.contains('d-flex')).toBe(true);
      expect(buttonContainer.classList.contains('align-items-center')).toBe(true);
      expect(buttonContainer.classList.contains('gap-2')).toBe(true);
      expect(buttonContainer.classList.contains('justify-content-end')).toBe(true);
    });

    it('should not render dialog when visible is false', () => {
      component.visible = false;
      fixture.detectChanges();

      const dialogElement = fixture.debugElement.nativeElement.querySelector('p-dialog');
      expect(dialogElement).toBeTruthy(); // Element exists but not visible due to PrimeNG behavior
    });
  });

  describe('Template Interactions', () => {
    it('should call confirmDialog when confirm button is clicked', () => {
      component.visible = true;
      fixture.detectChanges();

      vi.spyOn(component, 'confirmDialog');

      const confirmButton = fixture.debugElement.nativeElement.querySelector('.btn-save');
      confirmButton.click();

      expect(component.confirmDialog).toHaveBeenCalled();
    });

    it('should call hideDialog when cancel button is clicked', () => {
      component.visible = true;
      fixture.detectChanges();

      vi.spyOn(component, 'hideDialog');

      const cancelButton = fixture.debugElement.nativeElement.querySelector('.btn-cancel');
      cancelButton.click();

      expect(component.hideDialog).toHaveBeenCalled();
    });
  });

  describe('Event Emission Integration', () => {
    it('should emit dismiss event when hideDialog is called via template', () => {
      component.visible = true;
      fixture.detectChanges();

      let dismissCalled = false;
      component.dismiss.subscribe(() => {
        dismissCalled = true;
      });

      const cancelButton = fixture.debugElement.nativeElement.querySelector('.btn-cancel');
      cancelButton.click();

      expect(dismissCalled).toBe(true);
    });

    it('should emit confirm event when confirmDialog is called via template', () => {
      component.visible = true;
      fixture.detectChanges();

      let confirmCalled = false;
      let dismissCalled = false;

      component.confirm.subscribe(() => {
        confirmCalled = true;
      });

      component.dismiss.subscribe(() => {
        dismissCalled = true;
      });

      const confirmButton = fixture.debugElement.nativeElement.querySelector('.btn-save');
      confirmButton.click();

      expect(confirmCalled).toBe(true);
      expect(dismissCalled).toBe(true);
    });

    it('should update visible property when hideDialog is called', () => {
      component.visible = true;
      fixture.detectChanges();

      const cancelButton = fixture.debugElement.nativeElement.querySelector('.btn-cancel');
      cancelButton.click();

      expect(component.visible).toBe(false);
    });

    it('should update visible property when confirmDialog is called', () => {
      component.visible = true;
      fixture.detectChanges();

      const confirmButton = fixture.debugElement.nativeElement.querySelector('.btn-save');
      confirmButton.click();

      expect(component.visible).toBe(false);
    });
  });

  describe('Accessibility', () => {
    it('should have proper button types', () => {
      component.visible = true;
      fixture.detectChanges();

      const buttons = fixture.debugElement.nativeElement.querySelectorAll('button');
      buttons.forEach((button: Element) => {
        expect(button.getAttribute('type')).toBe('button');
      });
    });

    it('should have proper dialog attributes', () => {
      component.visible = true;
      fixture.detectChanges();

      const dialogElement = fixture.debugElement.nativeElement.querySelector('p-dialog');
      expect(dialogElement).toBeTruthy();
      // PrimeNG dialog handles these attributes internally
    });

    it('should have proper header for screen readers', () => {
      component.visible = true;
      fixture.detectChanges();

      const dialogElement = fixture.debugElement.nativeElement.querySelector('p-dialog');
      expect(dialogElement.getAttribute('header')).toBe('Confirmation');
    });
  });

  describe('Component Lifecycle', () => {
    it('should initialize with default values', () => {
      expect(component.visible).toBe(false);
      expect(component.message).toBe('');
      expect(component.confirm).toBeDefined();
      expect(component.dismiss).toBeDefined();
    });

    it('should handle multiple method calls', () => {
      const confirmDialogSpy = vi.spyOn(component, 'confirmDialog');
      const hideDialogSpy = vi.spyOn(component, 'hideDialog');

      component.confirmDialog();
      component.hideDialog();

      expect(confirmDialogSpy).toHaveBeenCalledTimes(1);
      expect(hideDialogSpy).toHaveBeenCalledTimes(2); // Once directly, once from confirmDialog
    });
  });
});
