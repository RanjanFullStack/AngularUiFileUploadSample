import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FundDetailsComponent } from './fund-details.component';
import { TooltipControlComponent } from '../custom-controls/tooltip-control.component';
import { RouterTestingModule } from '@angular/router/testing';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { GrowlModule } from 'primeng/growl';
import { CheckPermissionDirective } from 'src/app/directives/check-permission.directive';
import { multilinePointChartComponent } from '../chart/multilinePointChart';
import { DonutChartComponent } from '../chart/donutChart';
import { DataTableModule, InputSwitchModule, DialogModule, OverlayPanelModule, RadioButtonModule } from 'primeng/primeng';
import { FormsModule } from '@angular/forms';
import { AccountService } from 'src/app/services/account.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MiscellaneousService } from 'src/app/services/miscellaneous.service';
import { FundService } from 'src/app/services/funds.service';
import { DealService } from 'src/app/services/deal.service';
import { ReportService } from 'src/app/services/report.service';
import { PermissionService } from 'src/app/services/permission.service';

describe('FundDetailsComponent', () => {
    let component: FundDetailsComponent;
    let fixture: ComponentFixture<FundDetailsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports:[RouterTestingModule,AngularFontAwesomeModule,GrowlModule,DataTableModule,InputSwitchModule,FormsModule,
                DialogModule,OverlayPanelModule,RadioButtonModule,HttpClientTestingModule],
            declarations: [FundDetailsComponent,TooltipControlComponent,CheckPermissionDirective,
                multilinePointChartComponent,DonutChartComponent],
                providers:[AccountService,MiscellaneousService,FundService,DealService,ReportService,PermissionService,{ provide: "BASE_URL", baseUrl: "localhost" }]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(FundDetailsComponent);
        component = fixture.componentInstance;
        ////fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});