import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { AddGroupComponent } from "./add-group.component";
import { RouterTestingModule } from "@angular/router/testing";
import { AngularFontAwesomeModule } from "angular-font-awesome";
import { GrowlModule } from "primeng/growl";
import { FormsModule } from "@angular/forms";
import {
  MultiSelectModule,
  TreeTableModule,
  ConfirmDialogModule,
} from "primeng/primeng";
import { PermissionService } from "src/app/services/permission.service";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { AccountService } from "src/app/services/account.service";
import { MiscellaneousService } from "src/app/services/miscellaneous.service";

describe("AddGroupComponent", () => {
  let component: AddGroupComponent;
  let fixture: ComponentFixture<AddGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        AngularFontAwesomeModule,
        GrowlModule,
        FormsModule,
        MultiSelectModule,
        TreeTableModule,
        ConfirmDialogModule,
      ],
      declarations: [AddGroupComponent],
      providers: [PermissionService,AccountService,MiscellaneousService,{ provide: "BASE_URL", baseUrl: "localhost" }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddGroupComponent);
    component = fixture.componentInstance;
    //fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
