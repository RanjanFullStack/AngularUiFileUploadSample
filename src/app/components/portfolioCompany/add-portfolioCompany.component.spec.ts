import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPortfolioCompanyComponent } from './add-portfolioCompany.component';
import { RouterTestingModule } from '@angular/router/testing';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { GrowlModule } from 'primeng/growl';
import { FormsModule } from '@angular/forms';
import { TypeAheadControlComponent } from '../custom-controls/typeahead-control.component';
import { LocationControlComponent } from '../custom-controls/location-control.component';
import { NgbTabsetModule } from '@ng-bootstrap/ng-bootstrap';
import { Footer, ConfirmDialogModule, AutoCompleteModule } from 'primeng/primeng';
import { PortfolioCompanyService } from 'src/app/services/portfolioCompany.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MiscellaneousService } from 'src/app/services/miscellaneous.service';
import { AccountService } from 'src/app/services/account.service';
import { FirmService } from 'src/app/services/firm.service';

describe('AddPortfolioCompanyComponent', () => {
    let component: AddPortfolioCompanyComponent;
    let fixture: ComponentFixture<AddPortfolioCompanyComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports:[RouterTestingModule,HttpClientTestingModule, AngularFontAwesomeModule,GrowlModule,FormsModule,NgbTabsetModule,ConfirmDialogModule,AutoCompleteModule],
            declarations: [AddPortfolioCompanyComponent,TypeAheadControlComponent,LocationControlComponent],
            providers:[PortfolioCompanyService,MiscellaneousService,AccountService,FirmService,{ provide: "BASE_URL", baseUrl: "localhost" }]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AddPortfolioCompanyComponent);
        component = fixture.componentInstance;
        //fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});