import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveDealComponent } from './save-deals.component';
import { TooltipControlComponent } from '../custom-controls/tooltip-control.component';
import { RouterTestingModule } from '@angular/router/testing';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { FormsModule } from '@angular/forms';
import { GrowlModule } from 'primeng/growl';
import { TypeAheadControlComponent } from '../custom-controls/typeahead-control.component';
import { CalendarModule, OverlayPanelModule, AutoCompleteModule } from 'primeng/primeng';
import { MiscellaneousService } from 'src/app/services/miscellaneous.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FundService } from 'src/app/services/funds.service';
import { PortfolioCompanyService } from 'src/app/services/portfolioCompany.service';
import { DealService } from 'src/app/services/deal.service';
import { AccountService } from 'src/app/services/account.service';

describe('SaveDealsComponent', () => {
    let component: SaveDealComponent;
    let fixture: ComponentFixture<SaveDealComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports:[RouterTestingModule,AngularFontAwesomeModule,FormsModule,GrowlModule,CalendarModule,OverlayPanelModule,
                AutoCompleteModule,HttpClientTestingModule],
            declarations: [SaveDealComponent,TooltipControlComponent,TypeAheadControlComponent],
            providers:[MiscellaneousService,FundService,PortfolioCompanyService,DealService,AccountService,{ provide: "BASE_URL", baseUrl: "localhost" }]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SaveDealComponent);
        component = fixture.componentInstance;
        //fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});