import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { DealDetailsComponent } from "./deal-details.component";
import {
  ActivatedRoute,
  RouterModule,
  RouterLinkWithHref,
  Router,
  Routes,
} from "@angular/router";
import { AngularFontAwesomeModule } from "angular-font-awesome";
import { TooltipControlComponent } from "../custom-controls/tooltip-control.component";
import { CheckPermissionDirective } from "src/app/directives/check-permission.directive";
import {
  InputSwitchModule,
  DataTableModule,
  GrowlModule,
  OverlayPanelModule,
  RadioButtonModule,
} from "primeng/primeng";
import { FormsModule } from "@angular/forms";
import { AccountService } from "src/app/services/account.service";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { MiscellaneousService } from "src/app/services/miscellaneous.service";
import { DealService } from "src/app/services/deal.service";
import { PortfolioCompanyService } from "src/app/services/portfolioCompany.service";
import {MockActivatedRoute} from "./MockActivatedRoute";
import { RouterTestingModule } from "@angular/router/testing";
import { PermissionService } from "src/app/services/permission.service";


describe("DealDetailsComponent", () => {
  let component: DealDetailsComponent;
  let fixture: ComponentFixture<DealDetailsComponent>;
  let activatedRouteStub: MockActivatedRoute;

  beforeEach(async(() => {
    activatedRouteStub = new MockActivatedRoute();
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        AngularFontAwesomeModule,
        InputSwitchModule,
        FormsModule,
        DataTableModule,
        GrowlModule,
        OverlayPanelModule,
        RadioButtonModule,
        HttpClientTestingModule,
      ],
      declarations: [
        DealDetailsComponent,
        TooltipControlComponent,
        CheckPermissionDirective,
      ],
      providers: [
        AccountService,
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        MiscellaneousService,
        PortfolioCompanyService,
        DealService,
        PermissionService,
        { provide: "BASE_URL", baseUrl: "localhost" },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DealDetailsComponent);
    component = fixture.componentInstance;
    ////fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});

