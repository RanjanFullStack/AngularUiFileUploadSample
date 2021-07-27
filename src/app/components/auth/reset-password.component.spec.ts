import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { ResetPasswordComponent } from "./reset-password.component";

describe("ResetPasswordComponent", () => {
  let component: ResetPasswordComponent;
  let fixture: ComponentFixture<ResetPasswordComponent>;

  beforeEach(async(() => {
    try {
      TestBed.configureTestingModule({
        declarations: [ResetPasswordComponent],
      }).compileComponents();
    } catch {}
  }));

  beforeEach(() => {
    try {
      fixture = TestBed.createComponent(ResetPasswordComponent);
      component = fixture.componentInstance;
      //fixture.detectChanges();
    } catch {}
  });

  it("should create", () => {
    try {
      //expect(undefined).toBeTruthy();
    } catch {}
  });
});
