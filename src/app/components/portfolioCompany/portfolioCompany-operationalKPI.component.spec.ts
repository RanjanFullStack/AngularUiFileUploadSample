import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MessagesModule, Footer, ConfirmDialogModule, AutoCompleteModule } from 'primeng/primeng';
import { SavePortfolioOperationalKPIComponent } from './portfolioCompany-operationalKPI.component';
import { TypeAheadControlComponent } from '../custom-controls/typeahead-control.component';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { MockActivatedRoute } from '../Deal/MockActivatedRoute';
import { ActivatedRoute } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MiscellaneousService } from 'src/app/services/miscellaneous.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { PortfolioCompanyService } from 'src/app/services/portfolioCompany.service';
import { AccountService } from 'src/app/services/account.service';


describe('PortfolioCompanyOperationalKPIComponent', () => {
    let component: SavePortfolioOperationalKPIComponent;
    let fixture: ComponentFixture<SavePortfolioOperationalKPIComponent>;
    let activatedRouteStub: MockActivatedRoute;
    
    beforeEach(async(() => {
        activatedRouteStub = new MockActivatedRoute();
        TestBed.configureTestingModule({
            imports:[FormsModule,MessagesModule,AngularFontAwesomeModule,ConfirmDialogModule,AutoCompleteModule,HttpClientTestingModule],
            declarations: [SavePortfolioOperationalKPIComponent,TypeAheadControlComponent],
            providers:[MiscellaneousService,PortfolioCompanyService,AccountService,{ provide: ActivatedRoute, useValue: activatedRouteStub },NgbActiveModal,{ provide: "BASE_URL", baseUrl: "localhost" }]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SavePortfolioOperationalKPIComponent);
        component = fixture.componentInstance;
        //fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});