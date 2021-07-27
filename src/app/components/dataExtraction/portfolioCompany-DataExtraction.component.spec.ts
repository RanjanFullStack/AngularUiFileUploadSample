import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PortfolioCompanyDataExtractionComponent } from './portfolioCompany-DataExtraction.component';
import { GrowlModule } from 'primeng/growl';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MultiSelectModule, CalendarModule, DropdownModule, AutoCompleteModule } from 'primeng/primeng';
import { TypeAheadControlComponent } from '../custom-controls/typeahead-control.component';
import { MiscellaneousService } from 'src/app/services/miscellaneous.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FundService } from 'src/app/services/funds.service';
import { PortfolioCompanyService } from 'src/app/services/portfolioCompany.service';
import { AccountService } from 'src/app/services/account.service';

describe('PortfolioCompanyDataExtractionComponent', () => {
    let component: PortfolioCompanyDataExtractionComponent;
    let fixture: ComponentFixture<PortfolioCompanyDataExtractionComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports:[GrowlModule,FormsModule,ReactiveFormsModule,MultiSelectModule,CalendarModule,DropdownModule,AutoCompleteModule,HttpClientTestingModule],
            declarations: [PortfolioCompanyDataExtractionComponent,TypeAheadControlComponent],
            providers:[MiscellaneousService,FundService,PortfolioCompanyService,AccountService,{provide:'BASE_URL',baseUrl:"localhost"}]
        })
            .compileComponents();
    }));

    beforeEach(() => {

        //fixture = TestBed.createComponent(PortfolioCompanyDataExtractionComponent);
        //component = fixture.componentInstance;
        ////fixture.detectChanges();
    });

    it('should create', () => {
        //expect(component).toBeTruthy();
    });
});