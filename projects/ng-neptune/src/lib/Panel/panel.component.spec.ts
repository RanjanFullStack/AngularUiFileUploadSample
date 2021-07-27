import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Panel } from './panel.component';

describe('NgNeptuneComponent', () => {
  let component: Panel;
  let fixture: ComponentFixture<Panel>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Panel ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Panel);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
