import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { describe, it, expect, beforeEach, vi } from 'vitest';

import { App } from './app';

@Component({
  selector: 'app-global-spinner',
  standalone: true,
  template: '',
})
class GlobalSpinnerStub {}

describe('App', () => {
  let fixture: ComponentFixture<App>;
  let translateServiceMock: {
    use: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    translateServiceMock = {
      use: vi.fn(),
    };

    localStorage.clear();
    document.body.className = '';
    document.documentElement.dir = '';
    document.documentElement.lang = '';
    document.body.lang = '';

    await TestBed.configureTestingModule({
      imports: [App, RouterModule.forRoot([])],
      providers: [{ provide: TranslateService, useValue: translateServiceMock }],
    })
      .overrideComponent(App, {
        set: {
          imports: [RouterModule, GlobalSpinnerStub],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(App);
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render global spinner and router outlet', () => {
    fixture.detectChanges();

    expect(fixture.debugElement.query(By.css('app-global-spinner'))).toBeTruthy();
    expect(fixture.debugElement.query(By.css('router-outlet'))).toBeTruthy();
  });

  it('should default lang to en when localStorage is empty', () => {
    fixture.detectChanges();

    expect(localStorage.getItem('lang')).toBe('en');
    expect(translateServiceMock.use).toHaveBeenCalledWith('en');

    expect(document.body.classList.contains('en')).toBe(true);
    expect(document.body.classList.contains('ar')).toBe(false);
    expect(document.documentElement.dir).toBe('ltr');
    expect(document.documentElement.lang).toBe('en');
    expect(document.body.lang).toBe('en');
  });

  it('should apply saved lang from localStorage', () => {
    localStorage.setItem('lang', 'ar');

    fixture.detectChanges();

    expect(localStorage.getItem('lang')).toBe('ar');
    expect(translateServiceMock.use).toHaveBeenCalledWith('ar');

    expect(document.body.classList.contains('en')).toBe(false);
    expect(document.body.classList.contains('ar')).toBe(true);
    expect(document.documentElement.dir).toBe('rtl');
    expect(document.documentElement.lang).toBe('ar');
    expect(document.body.lang).toBe('ar');
  });
});
