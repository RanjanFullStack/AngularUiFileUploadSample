import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddFundTrackRecordComponent } from './fund-trackRecord.component';
import { FormsModule } from '@angular/forms';
import { MessagesModule, AutoCompleteModule } from 'primeng/primeng';
import { TypeAheadControlComponent } from '../custom-controls/typeahead-control.component';
import { MockActivatedRoute } from '../Deal/MockActivatedRoute';
import { ActivatedRoute } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MiscellaneousService } from 'src/app/services/miscellaneous.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FundService } from 'src/app/services/funds.service';

describe('FundTrackRecordComponent', () => {
    let component: AddFundTrackRecordComponent;
    let fixture: ComponentFixture<AddFundTrackRecordComponent>;
    let activatedRouteStub: MockActivatedRoute;
    
    beforeEach(async(() => {
        activatedRouteStub = new MockActivatedRoute();
        TestBed.configureTestingModule({
            imports:[FormsModule,MessagesModule,AutoCompleteModule,HttpClientTestingModule],
            declarations: [AddFundTrackRecordComponent,TypeAheadControlComponent],
            providers:[MiscellaneousService,FundService,{ provide: ActivatedRoute, useValue: activatedRouteStub },NgbActiveModal,{ provide: "BASE_URL", baseUrl: "localhost" }]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AddFundTrackRecordComponent);
        component = fixture.componentInstance;
        //fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});