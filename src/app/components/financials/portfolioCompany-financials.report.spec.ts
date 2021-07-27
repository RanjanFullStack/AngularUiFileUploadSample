import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PortfolioCompanyFinancialsReportComponent } from './portfolioCompany-financials.report';
import { FormsModule } from '@angular/forms';
import { GrowlModule } from 'primeng/growl';
import { HorizontalNavBarComponent } from '../custom-controls/horizontal-navbar.component';
import { TypeAheadControlComponent } from '../custom-controls/typeahead-control.component';
import { CalendarModule, SelectButtonModule, AutoCompleteModule } from 'primeng/primeng';
import { TableModule } from 'primeng/table';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MinusSignToBracketsPipe } from 'src/app/pipes/minus-sign-to-brackets';
import { MiscellaneousService } from 'src/app/services/miscellaneous.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AccountService } from 'src/app/services/account.service';
import { PortfolioCompanyService } from 'src/app/services/portfolioCompany.service';
import { AngularFontAwesomeModule } from 'angular-font-awesome';

describe('PortfolioCompanyFinancialsReportComponent', () => {
    let component: PortfolioCompanyFinancialsReportComponent;
    let fixture: ComponentFixture<PortfolioCompanyFinancialsReportComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports:[FormsModule,GrowlModule,CalendarModule,TableModule,HttpClientTestingModule,AngularFontAwesomeModule,SelectButtonModule,AutoCompleteModule],
            declarations: [PortfolioCompanyFinancialsReportComponent,HorizontalNavBarComponent,TypeAheadControlComponent,MinusSignToBracketsPipe],
            providers:[MiscellaneousService,AccountService,PortfolioCompanyService,{ provide: "BASE_URL", baseUrl: "localhost" }],
            schemas:[]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PortfolioCompanyFinancialsReportComponent);
        component = fixture.componentInstance;
        ////fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});