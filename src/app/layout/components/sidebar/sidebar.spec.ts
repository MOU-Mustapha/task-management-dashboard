import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { of } from 'rxjs';
import { describe, it, expect, beforeEach, vi } from 'vitest';

import { Sidebar } from './sidebar';
import { TaskDialogService } from '../../../features/tasks/services/task-dialog.service';

describe('Sidebar', () => {
  let component: Sidebar;
  let fixture: ComponentFixture<Sidebar>;

  const mockTaskDialogService = {
    open: vi.fn(),
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
        Sidebar,
        TranslateModule.forRoot({
          defaultLanguage: 'en',
        }),
        ButtonModule,
        RouterModule.forRoot([]),
      ],
      providers: [
        { provide: TaskDialogService, useValue: mockTaskDialogService },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Sidebar);
    component = fixture.componentInstance;

    // Reset mocks before each test
    vi.clearAllMocks();

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render sidebar structure', () => {
    const sidebarElement = fixture.debugElement.nativeElement.querySelector('.sidebar');
    expect(sidebarElement).toBeTruthy();
  });

  it('should have correct modules data', () => {
    expect(component.modules).toHaveLength(2);
    expect(component.modules[0]).toEqual({
      name: 'Dashboard',
      route: '/',
      icon: 'assets/icons/dashboard.png',
    });
    expect(component.modules[1]).toEqual({
      name: 'Tasks',
      route: '/tasks',
      icon: 'assets/icons/tasks.png',
    });
  });

  describe('template rendering', () => {
    it('should render navigation links for each module', () => {
      const navLinks = fixture.debugElement.nativeElement.querySelectorAll('a');
      expect(navLinks).toHaveLength(2);
    });

    it('should render module icons with proper attributes', () => {
      const icons = fixture.debugElement.nativeElement.querySelectorAll('a img');
      expect(icons).toHaveLength(2);

      // Dashboard icon
      expect(icons[0].getAttribute('src')).toBe('assets/icons/dashboard.png');
      expect(icons[0].getAttribute('alt')).toBe('Dashboard');
      expect(icons[0].getAttribute('width')).toBe('15');
      expect(icons[0].getAttribute('height')).toBe('15');

      // Tasks icon
      expect(icons[1].getAttribute('src')).toBe('assets/icons/tasks.png');
      expect(icons[1].getAttribute('alt')).toBe('Tasks');
      expect(icons[1].getAttribute('width')).toBe('15');
      expect(icons[1].getAttribute('height')).toBe('15');
    });

    it('should render create task button', () => {
      const createButton = fixture.debugElement.nativeElement.querySelector('.btn-create');
      expect(createButton).toBeTruthy();
      expect(createButton.getAttribute('type')).toBe('button');
      expect(createButton.textContent.trim()).toContain('+');
    });
  });

  describe('openTaskModal', () => {
    it('should call taskDialogService.open when openTaskModal is called', () => {
      component.openTaskModal();
      expect(mockTaskDialogService.open).toHaveBeenCalledWith();
    });

    it('should call taskDialogService.open without parameters for new task', () => {
      component.openTaskModal();
      expect(mockTaskDialogService.open).toHaveBeenCalledTimes(1);
      expect(mockTaskDialogService.open).toHaveBeenCalledWith();
    });
  });

  describe('template interactions', () => {
    it('should call openTaskModal when create button is clicked', () => {
      const createButton = fixture.debugElement.nativeElement.querySelector('.btn-create');
      const spyOnOpenTaskModal = vi.spyOn(component, 'openTaskModal');

      createButton.click();

      expect(spyOnOpenTaskModal).toHaveBeenCalled();
      expect(mockTaskDialogService.open).toHaveBeenCalledWith();
    });
  });

  describe('accessibility', () => {
    it('should have proper alt text for all icons', () => {
      const icons = fixture.debugElement.nativeElement.querySelectorAll('a img');

      icons.forEach((icon: Element, index: number) => {
        const altText = icon.getAttribute('alt');
        expect(altText).toBe(component.modules[index].name);
      });
    });

    it('should have proper width and height attributes for icons', () => {
      const icons = fixture.debugElement.nativeElement.querySelectorAll('a img');

      icons.forEach((icon: Element) => {
        expect(icon.getAttribute('width')).toBe('15');
        expect(icon.getAttribute('height')).toBe('15');
      });
    });

    it('should have proper button type for create button', () => {
      const createButton = fixture.debugElement.nativeElement.querySelector('.btn-create');
      expect(createButton.getAttribute('type')).toBe('button');
    });
  });
});
