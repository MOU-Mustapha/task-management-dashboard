import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

import { describe, it, expect, beforeEach } from 'vitest';

import { Layout } from './layout';

@Component({
  selector: 'app-header',
  standalone: true,
  template: '',
})
class HeaderStub {}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  template: '',
})
class SidebarStub {}

describe('Layout', () => {
  let fixture: ComponentFixture<Layout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Layout, RouterModule.forRoot([])],
    })
      .overrideComponent(Layout, {
        set: {
          imports: [RouterModule, HeaderStub, SidebarStub],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(Layout);
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render header, sidebar and router outlet structure', () => {
    fixture.detectChanges();

    expect(fixture.debugElement.query(By.css('app-header'))).toBeTruthy();
    expect(fixture.debugElement.query(By.css('app-sidebar'))).toBeTruthy();
    expect(fixture.debugElement.query(By.css('router-outlet'))).toBeTruthy();

    const mainEl = fixture.debugElement.query(By.css('main'));
    expect(mainEl).toBeTruthy();

    const contentEl = fixture.debugElement.query(By.css('.content'));
    expect(contentEl).toBeTruthy();
  });
});
