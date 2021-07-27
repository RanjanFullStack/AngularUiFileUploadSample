import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmModalComponentComponent } from './confirm-modal.component';
import { Button } from './../Button/button.component';

describe('ConfirmModalComponentComponent', () => {
  let component: ConfirmModalComponentComponent;
  let fixture: ComponentFixture<ConfirmModalComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmModalComponentComponent ,Button]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmModalComponentComponent);
    component = fixture.componentInstance;
    //fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
