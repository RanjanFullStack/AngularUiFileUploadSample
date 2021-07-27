import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckboxComponentComponent } from './checkbox.component';

describe('CheckboxComponentComponent', () => {
  let component: CheckboxComponentComponent;
  let fixture: ComponentFixture<CheckboxComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckboxComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckboxComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
