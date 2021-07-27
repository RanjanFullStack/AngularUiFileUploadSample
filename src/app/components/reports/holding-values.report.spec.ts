import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { FormsModule } from "@angular/forms";
import {
  CalendarModule,
  MultiSelectModule,
  SelectButtonModule,
  AutoCompleteModule,
} from "primeng/primeng";
import { TableModule } from "primeng/table";
import {
  FormatNumbersPipe,
  MinusSignToBracketsPipe,
} from "src/app/pipes/minus-sign-to-brackets";
import { BarChartComponent } from "../chart/barChart";
import { DonutChartComponent } from "../chart/donutChart";
import { FilterControlComponent } from "../custom-controls/filter-control.component";
import { HorizontalNavBarComponent } from "../custom-controls/horizontal-navbar.component";
import { HoldingValuesComponent } from "./holding-values.report";
import { AngularFontAwesomeModule } from "angular-font-awesome";
import { TypeAheadControlComponent } from "../custom-controls/typeahead-control.component";
import { Button } from "./../../../../projects/ng-neptune/src/lib/Button/button.component";
import { Toast } from "./../../../../projects/ng-neptune/src/lib/Toast/toast.component";
import { ConfirmModalComponentComponent } from './../../../../projects/ng-neptune/src/lib/confirm-modal-component/confirm-modal.component';
import { ReportService } from "src/app/services/report.service";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { MiscellaneousService } from "src/app/services/miscellaneous.service";
import { AccountService } from "src/app/services/account.service";
import { FilterService } from "src/app/services/filter.services";
import { InputComponent } from "./../../../../projects/ng-neptune/src/lib/Input/input.component";

describe("HoldingValuesReportComponent", () => {
  let component: HoldingValuesComponent;
  let fixture: ComponentFixture<HoldingValuesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        MultiSelectModule,
        CalendarModule,
        TableModule,
        AngularFontAwesomeModule,
        SelectButtonModule,
        AutoCompleteModule,
        HttpClientTestingModule
      ],
      declarations: [
        HoldingValuesComponent,
        HorizontalNavBarComponent,
        FilterControlComponent,
        FormatNumbersPipe,
        MinusSignToBracketsPipe,
        DonutChartComponent,
        BarChartComponent,
        TypeAheadControlComponent,
        Button,
        Toast,
        ConfirmModalComponentComponent,
        InputComponent
      ],
      providers: [ReportService,MiscellaneousService,AccountService,FilterService,{ provide: "BASE_URL", baseUrl: "localhost" }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HoldingValuesComponent);
    component = fixture.componentInstance;
    //fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
