import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SavePortfolioProfitabilityComponent } from './portfolioCompany-profitability.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { MessagesModule, AutoCompleteModule } from 'primeng/primeng';
import { TypeAheadControlComponent } from '../custom-controls/typeahead-control.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MiscellaneousService } from 'src/app/services/miscellaneous.service';
import { PortfolioCompanyService } from 'src/app/services/portfolioCompany.service';
import { AccountService } from 'src/app/services/account.service';

describe('PortfolioCompanyProfitabilityComponent', () => {
    let component: SavePortfolioProfitabilityComponent;
    let fixture: ComponentFixture<SavePortfolioProfitabilityComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports:[RouterTestingModule,HttpClientTestingModule,FormsModule,MessagesModule,AutoCompleteModule],
            declarations: [SavePortfolioProfitabilityComponent,TypeAheadControlComponent],
            providers:[{ provide: "BASE_URL", baseUrl: "localhost" },NgbActiveModal,MiscellaneousService,PortfolioCompanyService,AccountService]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SavePortfolioProfitabilityComponent);
        component = fixture.componentInstance;
        //fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});