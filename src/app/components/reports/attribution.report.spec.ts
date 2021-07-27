import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { AttributionReportsComponent } from "./attribution.report";
import { HorizontalNavBarComponent } from "../custom-controls/horizontal-navbar.component";
import { FormsModule } from "@angular/forms";
import {
  MultiSelectModule,
  CalendarModule,
  DialogModule,
  SelectButtonModule,
  AutoCompleteModule,
} from "primeng/primeng";
import { FilterControlComponent } from "../custom-controls/filter-control.component";
import { TableModule } from "primeng/table";
import {
  MinusSignToBracketsPipe,
  FormatNumbersPipe,
} from "src/app/pipes/minus-sign-to-brackets";
import { DonutChartComponent } from "../chart/donutChart";
import { AngularFontAwesomeModule } from "angular-font-awesome";
import { BarChartComponent } from "../chart/barChart";
import { TypeAheadControlComponent } from "../custom-controls/typeahead-control.component";
import { Button } from "./../../../../projects/ng-neptune/src/lib/Button/button.component";
import { ConfirmModalComponentComponent } from "./../../../../projects/ng-neptune/src/lib/confirm-modal-component/confirm-modal.component";
import { Toast } from "./../../../../projects/ng-neptune/src/lib/Toast/toast.component";
import { ReportService } from "src/app/services/report.service";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { MiscellaneousService } from "src/app/services/miscellaneous.service";
import { AccountService } from "src/app/services/account.service";
import { FundService } from "src/app/services/funds.service";
import { MockActivatedRoute } from "../Deal/MockActivatedRoute";
import { ActivatedRoute } from "@angular/router";
import { FilterService } from "src/app/services/filter.services";
import { InputComponent } from "./../../../../projects/ng-neptune/src/lib/Input/input.component";

describe("AttributionReportComponent", () => {
  let component: AttributionReportsComponent;
  let fixture: ComponentFixture<AttributionReportsComponent>;
  let activatedRouteStub: MockActivatedRoute;

  beforeEach(async(() => {
    activatedRouteStub = new MockActivatedRoute();
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        FormsModule,
        MultiSelectModule,
        CalendarModule,
        TableModule,
        DialogModule,
        AngularFontAwesomeModule,
        SelectButtonModule,
        AutoCompleteModule,
      ],
      declarations: [
        AttributionReportsComponent,
        HorizontalNavBarComponent,
        FilterControlComponent,
        MinusSignToBracketsPipe,
        FormatNumbersPipe,
        DonutChartComponent,
        BarChartComponent,
        TypeAheadControlComponent,
        Button,
        ConfirmModalComponentComponent,
        Toast,
        InputComponent
      ],
      providers: [
        ReportService,
        FilterService,
        MiscellaneousService,
        AccountService,
        FundService,
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        { provide: "BASE_URL", baseUrl: "localhost" },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AttributionReportsComponent);
    component = fixture.componentInstance;
    //fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
