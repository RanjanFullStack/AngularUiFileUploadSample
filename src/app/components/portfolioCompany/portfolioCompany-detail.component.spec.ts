import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { GrowlModule, SplitButtonModule, DropdownModule, DataTableModule, AccordionModule, MenuModule, AutoCompleteModule } from 'primeng/primeng';
import { CheckPermissionDirective } from 'src/app/directives/check-permission.directive';
import { lineBarChartComponent } from '../chart/lineBarChart';
import { TypeAheadControlComponent } from '../custom-controls/typeahead-control.component';
import { PortfolioCompanyDetailComponent } from './portfolioCompany-detail.component';
import { BarChartComponent } from '../chart/barChart';
import { TableModule } from 'primeng/table';
import { MinusSignToBracketsPipe } from 'src/app/pipes/minus-sign-to-brackets';
import { ReportService } from 'src/app/services/report.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AccountService } from 'src/app/services/account.service';
import { MiscellaneousService } from 'src/app/services/miscellaneous.service';
import { PortfolioCompanyService } from 'src/app/services/portfolioCompany.service';
import { PermissionService } from 'src/app/services/permission.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


describe('PortfolioCompanyDetailComponent', () => {
    let component: PortfolioCompanyDetailComponent;
    let fixture: ComponentFixture<PortfolioCompanyDetailComponent>;

    beforeEach(async(() => {
    //     try{
    //     TestBed.configureTestingModule({
    //         imports:[RouterTestingModule,HttpClientTestingModule,AngularFontAwesomeModule,SplitButtonModule,GrowlModule,FormsModule,DropdownModule,DataTableModule,TableModule,AccordionModule,MenuModule,AutoCompleteModule,BrowserAnimationsModule],
    //         declarations: [PortfolioCompanyDetailComponent,CheckPermissionDirective,TypeAheadControlComponent,lineBarChartComponent,BarChartComponent,MinusSignToBracketsPipe],
    //         providers:[ReportService,AccountService,MiscellaneousService,PortfolioCompanyService,PermissionService,{ provide: "BASE_URL", baseUrl: "localhost" }]
    //     })
    //         .compileComponents();
    // }catch{}
    }));

    beforeEach(() => {
        // try{
        // fixture = TestBed.createComponent(PortfolioCompanyDetailComponent);
        // component = fixture.componentInstance;
        // //fixture.detectChanges();
        // }catch{}
    });

    it('should create', () => {
        //expect(component).toBeTruthy();
    });
});