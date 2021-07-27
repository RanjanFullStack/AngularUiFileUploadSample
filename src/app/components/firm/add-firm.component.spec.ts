import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfirmationService, MessageService, TabViewModule, ConfirmDialogModule, AutoCompleteModule } from "primeng/primeng";
import { AddFirmComponent } from './add-firm.component';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { AngularFontAwesomeComponent } from 'angular-font-awesome';
import { GrowlModule } from 'primeng/growl';
import { Component, NO_ERRORS_SCHEMA } from '@angular/Core';
import { FormsModule } from '@angular/forms';
import { LocationControlComponent } from '../custom-controls/location-control.component';
import { TypeAheadControlComponent } from '../custom-controls/typeahead-control.component';
import { NgbTabsetModule } from '@ng-bootstrap/ng-bootstrap';
import { AccountService } from 'src/app/services/account.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FirmService } from 'src/app/services/firm.service';
import { MockActivatedRoute } from '../Deal/MockActivatedRoute';
import { MiscellaneousService } from 'src/app/services/miscellaneous.service';
import { RouterTestingModule } from '@angular/router/testing';

describe('Add Firm Component', () => {
    let component: AddFirmComponent;
    let fixture: ComponentFixture<AddFirmComponent>;
    let activatedRouteStub: MockActivatedRoute;

    beforeEach(async(() => {
        activatedRouteStub = new MockActivatedRoute();
        TestBed.configureTestingModule({
            imports:[RouterModule,GrowlModule,FormsModule,NgbTabsetModule,ConfirmDialogModule,AutoCompleteModule,HttpClientTestingModule,RouterTestingModule],
            declarations: [AddFirmComponent,AngularFontAwesomeComponent,LocationControlComponent,TypeAheadControlComponent],
            providers: [AccountService,FirmService,MiscellaneousService,{ provide: ActivatedRoute, useValue: activatedRouteStub },{ provide: "BASE_URL", baseUrl: "localhost" }]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AddFirmComponent);
        component = fixture.componentInstance;
        //fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
