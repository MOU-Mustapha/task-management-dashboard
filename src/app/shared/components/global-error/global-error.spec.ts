import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GlobalError } from './global-error';

describe('GlobalError', () => {
  let component: GlobalError;
  let fixture: ComponentFixture<GlobalError>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GlobalError],
    }).compileComponents();

    fixture = TestBed.createComponent(GlobalError);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
