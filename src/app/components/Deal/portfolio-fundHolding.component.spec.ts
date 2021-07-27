import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SavePortfolioFundHoldingComponent } from './portfolio-fundHolding.component';
import { FormsModule } from '@angular/forms';
import { Messages, AutoCompleteModule } from 'primeng/primeng';
import { TypeAheadControlComponent } from '../custom-controls/typeahead-control.component';
import { ActivatedRoute } from '@angular/router';
import {MockActivatedRoute} from "./MockActivatedRoute";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { MiscellaneousService } from 'src/app/services/miscellaneous.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DealService } from 'src/app/services/deal.service';

describe('PortfolioFundHoldingComponent', () => {
    let component: SavePortfolioFundHoldingComponent;
    let fixture: ComponentFixture<SavePortfolioFundHoldingComponent>;
    let activatedRouteStub: MockActivatedRoute;

    beforeEach(async(() => {
        activatedRouteStub = new MockActivatedRoute();
        TestBed.configureTestingModule({
            imports:[FormsModule,AutoCompleteModule,HttpClientTestingModule],
            declarations: [SavePortfolioFundHoldingComponent,Messages,TypeAheadControlComponent],
            providers:[ MiscellaneousService,DealService,{ provide: ActivatedRoute, useValue: activatedRouteStub },{ provide: "BASE_URL", baseUrl: "localhost" },NgbActiveModal]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SavePortfolioFundHoldingComponent);
        component = fixture.componentInstance;
        //fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});