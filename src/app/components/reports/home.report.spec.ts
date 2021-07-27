import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportsComponent } from './home.report';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { CheckPermissionDirective } from 'src/app/directives/check-permission.directive';
import { TopHoldingsComponent } from './top-holdings.report';
import { HoldingValuesComponent } from './holding-values.report';
import { AttributionReportsComponent } from './attribution.report';
import { CompanyFinancialsReportComponent } from './company-financials.report';
import { HorizontalNavBarComponent } from '../custom-controls/horizontal-navbar.component';
import { FormsModule } from '@angular/forms';
import { MultiSelectModule, CalendarModule, SelectButtonModule, DialogModule, AutoCompleteModule } from 'primeng/primeng';
import { FilterControlComponent } from '../custom-controls/filter-control.component';
import { TableModule } from 'primeng/table';
import { MinusSignToBracketsPipe, FormatNumbersPipe } from 'src/app/pipes/minus-sign-to-brackets';
import { DonutChartComponent } from '../chart/donutChart';
import { BarChartComponent } from '../chart/barChart';
import { TypeAheadControlComponent } from '../custom-controls/typeahead-control.component';
import { lineBarChartComponent } from '../chart/lineBarChart';
import { Button } from './../../../../projects/ng-neptune/src/lib/Button/button.component';
import { Toast } from './../../../../projects/ng-neptune/src/lib/Toast/toast.component';
import { ConfirmModalComponentComponent } from './../../../../projects/ng-neptune/src/lib/confirm-modal-component/confirm-modal.component';
import { ReportService } from 'src/app/services/report.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MiscellaneousService } from 'src/app/services/miscellaneous.service';
import { AccountService } from 'src/app/services/account.service';
import { FundService } from 'src/app/services/funds.service';
import { PortfolioCompanyService } from 'src/app/services/portfolioCompany.service';
import { MockActivatedRoute } from '../Deal/MockActivatedRoute';
import { ActivatedRoute } from '@angular/router';
import { FilterService } from 'src/app/services/filter.services';
import { InputComponent } from './../../../../projects/ng-neptune/src/lib/Input/input.component';

describe('HomeReportComponent', () => {
    let component: ReportsComponent;
    let fixture: ComponentFixture<ReportsComponent>;
    let activatedRouteStub: MockActivatedRoute;

    beforeEach(async(() => {
        activatedRouteStub = new MockActivatedRoute();
        TestBed.configureTestingModule({
            imports:[AngularFontAwesomeModule,FormsModule,MultiSelectModule,CalendarModule,SelectButtonModule,TableModule,DialogModule,AutoCompleteModule,HttpClientTestingModule],
            declarations: [ReportsComponent,CheckPermissionDirective,TopHoldingsComponent,HoldingValuesComponent,AttributionReportsComponent,CompanyFinancialsReportComponent,HorizontalNavBarComponent,FilterControlComponent,MinusSignToBracketsPipe,
            FormatNumbersPipe,DonutChartComponent,BarChartComponent,TypeAheadControlComponent,lineBarChartComponent,Button,Toast,ConfirmModalComponentComponent,InputComponent],
            providers:[ReportService,MiscellaneousService,AccountService,FundService,PortfolioCompanyService,FilterService,{ provide: "BASE_URL", baseUrl: "localhost" },{ provide: ActivatedRoute, useValue: activatedRouteStub }]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ReportsComponent);
        component = fixture.componentInstance;
        //fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});