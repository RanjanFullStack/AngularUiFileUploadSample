import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateInfoSectionComponent } from './update-info-section.component';
import { FormsModule } from '@angular/forms';
import { MessagesModule, EditorModule, ConfirmDialogModule, AutoCompleteModule } from 'primeng/primeng';
import { TypeAheadControlComponent } from '../custom-controls/typeahead-control.component';
import { ActivatedRoute } from '@angular/router';
import { MockActivatedRoute } from '../Deal/MockActivatedRoute';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { PortfolioCompanyService } from 'src/app/services/portfolioCompany.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MiscellaneousService } from 'src/app/services/miscellaneous.service';
import { AccountService } from 'src/app/services/account.service';

describe('UpdateInfoSectionComponent', () => {
    let component: UpdateInfoSectionComponent;
    let fixture: ComponentFixture<UpdateInfoSectionComponent>;
    let activatedRouteStub: MockActivatedRoute;

    beforeEach(async(() => {
        activatedRouteStub = new MockActivatedRoute();
        TestBed.configureTestingModule({
            imports:[FormsModule,MessagesModule,EditorModule,ConfirmDialogModule,AutoCompleteModule,HttpClientTestingModule],
            declarations: [UpdateInfoSectionComponent,TypeAheadControlComponent],
            providers:[PortfolioCompanyService,MiscellaneousService,AccountService,{ provide: ActivatedRoute, useValue: activatedRouteStub },NgbActiveModal,{ provide: "BASE_URL", baseUrl: "localhost" }]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(UpdateInfoSectionComponent);
        component = fixture.componentInstance;
        //fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});