import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { PopoverModule } from 'primeng/popover';
import { Router, ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { describe, it, expect, beforeEach, vi } from 'vitest';

import { Header } from './header';
import { TasksFacade } from '../../../features/tasks/services/tasks.facade';

describe('Header', () => {
  let component: Header;
  let fixture: ComponentFixture<Header>;
  let translateService: TranslateService;

  const mockTasksFacade = {
    setSearch: vi.fn(),
  };

  const mockRouter = {
    url: '/dashboard',
    navigate: vi.fn(),
    events: of({}),
    createUrlTree: vi.fn(),
    serializeUrl: vi.fn(),
    parseUrl: vi.fn(),
    isActive: vi.fn(),
    routerState: {
      root: {},
    },
  };

  const mockActivatedRoute = {
    snapshot: {},
    params: of({}),
    queryParams: of({}),
    url: of({}),
    data: of({}),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        Header,
        TranslateModule.forRoot({
          fallbackLang: 'en',
        }),
        FormsModule,
        PopoverModule,
      ],
      providers: [
        { provide: TasksFacade, useValue: mockTasksFacade },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Header);
    component = fixture.componentInstance;
    translateService = TestBed.inject(TranslateService);

    // Clear localStorage before each test
    localStorage.clear();

    // Reset document body classes and attributes
    document.body.className = '';
    document.documentElement.dir = '';
    document.documentElement.lang = '';
    document.body.lang = '';

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render header structure', () => {
    const headerElement = fixture.debugElement.nativeElement.querySelector('header');
    const logo = fixture.debugElement.nativeElement.querySelector('.logo img');
    const searchInput = fixture.debugElement.nativeElement.querySelector('#search');

    expect(headerElement).toBeTruthy();
    expect(logo).toBeTruthy();
    expect(searchInput).toBeTruthy();
  });

  describe('toggleLang', () => {
    it('should toggle from English to Arabic', () => {
      vi.spyOn(translateService, 'getCurrentLang').mockReturnValue('en');
      vi.spyOn(translateService, 'use');

      component.toggleLang();

      expect(localStorage.getItem('lang')).toBe('ar');
      expect(translateService.use).toHaveBeenCalledWith('ar');
      expect(document.body.classList.contains('en')).toBe(false);
      expect(document.body.classList.contains('ar')).toBe(true);
      expect(document.documentElement.dir).toBe('rtl');
      expect(document.documentElement.lang).toBe('ar');
      expect(document.body.lang).toBe('ar');
    });

    it('should toggle from Arabic to English', () => {
      vi.spyOn(translateService, 'getCurrentLang').mockReturnValue('ar');
      vi.spyOn(translateService, 'use');

      component.toggleLang();

      expect(localStorage.getItem('lang')).toBe('en');
      expect(translateService.use).toHaveBeenCalledWith('en');
      expect(document.body.classList.contains('en')).toBe(true);
      expect(document.body.classList.contains('ar')).toBe(false);
      expect(document.documentElement.dir).toBe('ltr');
      expect(document.documentElement.lang).toBe('en');
      expect(document.body.lang).toBe('en');
    });

    it('should default to English when current language is not en or ar', () => {
      vi.spyOn(translateService, 'getCurrentLang').mockReturnValue('fr');
      vi.spyOn(translateService, 'use');

      component.toggleLang();

      expect(localStorage.getItem('lang')).toBe('en');
      expect(translateService.use).toHaveBeenCalledWith('en');
    });
  });

  describe('onSearch', () => {
    it('should set search term', () => {
      const searchValue = 'test search';

      component.onSearch(searchValue);

      expect(mockTasksFacade.setSearch).toHaveBeenCalledWith(searchValue);
    });

    it('should handle empty search term', () => {
      const searchValue = '';

      component.onSearch(searchValue);

      expect(mockTasksFacade.setSearch).toHaveBeenCalledWith('');
    });

    it('should handle search term with special characters', () => {
      const searchValue = 'test@#$%^&*()';

      component.onSearch(searchValue);

      expect(mockTasksFacade.setSearch).toHaveBeenCalledWith(searchValue);
    });
  });

  describe('template structure', () => {
    it('should render search input with proper attributes', () => {
      const searchInput = fixture.debugElement.nativeElement.querySelector('#search');
      expect(searchInput.getAttribute('type')).toBe('search');
    });

    it('should render logo with proper alt text', () => {
      const logo = fixture.debugElement.nativeElement.querySelector('.logo img');
      expect(logo.getAttribute('alt')).toBe('logo');
    });

    it('should render user menu popover', () => {
      const popover = fixture.debugElement.nativeElement.querySelector('p-popover');
      expect(popover).toBeTruthy();
    });
  });
});
