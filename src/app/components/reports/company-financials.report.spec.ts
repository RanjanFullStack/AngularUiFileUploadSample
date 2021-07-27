import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { CompanyFinancialsReportComponent } from "./company-financials.report";
import { HorizontalNavBarComponent } from "../custom-controls/horizontal-navbar.component";
import { FormsModule } from "@angular/forms";
import { TypeAheadControlComponent } from "../custom-controls/typeahead-control.component";
import {
  MultiSelectModule,
  CalendarModule,
  SelectButtonModule,
  AutoCompleteModule,
} from "primeng/primeng";
import { FilterControlComponent } from "../custom-controls/filter-control.component";
import { Button } from "./../../../../projects/ng-neptune/src/lib/Button/button.component";
import { Toast } from "./../../../../projects/ng-neptune/src/lib/Toast/toast.component";
import { lineBarChartComponent } from "../chart/lineBarChart";
import { BarChartComponent } from "../chart/barChart";
import { AngularFontAwesomeModule } from "angular-font-awesome";
import { ConfirmModalComponentComponent } from './../../../../projects/ng-neptune/src/lib/confirm-modal-component/confirm-modal.component';
import { ReportService } from "src/app/services/report.service";
import { HttpClientModule } from "@angular/common/http";
import { MiscellaneousService } from "src/app/services/miscellaneous.service";
import { AccountService } from "src/app/services/account.service";
import { FundService } from "src/app/services/funds.service";
import { PortfolioCompanyService } from "src/app/services/portfolioCompany.service";
import { FilterService } from "src/app/services/filter.services";
import { InputComponent } from "./../../../../projects/ng-neptune/src/lib/Input/input.component";

describe("CompanyFinancialsReportComponent", () => {
  let component: CompanyFinancialsReportComponent;
  let fixture: ComponentFixture<CompanyFinancialsReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        HttpClientModule,
        MultiSelectModule,
        CalendarModule,
        AngularFontAwesomeModule,
        SelectButtonModule,
        AutoCompleteModule,
      ],
      declarations: [
        CompanyFinancialsReportComponent,
        HorizontalNavBarComponent,
        TypeAheadControlComponent,
        FilterControlComponent,
        Button,
        Toast,
        lineBarChartComponent,
        BarChartComponent,
        ConfirmModalComponentComponent,
        InputComponent
      ],
      providers: [
        ReportService,
        MiscellaneousService,
        AccountService,
        FundService,
        PortfolioCompanyService,
        FilterService,
        { provide: "BASE_URL", baseUrl: "localhost" },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyFinancialsReportComponent);
    component = fixture.componentInstance;
    fixture.whenStable().then(() => {
      //fixture.detectChanges();
    });
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
