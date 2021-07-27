import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddFundComponent } from './add-funds.component';
import { RouterTestingModule } from '@angular/router/testing';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { FormsModule } from '@angular/forms';
import { GrowlModule } from 'primeng/growl';
import { TypeAheadControlComponent } from '../custom-controls/typeahead-control.component';
import { LocationControlComponent } from '../custom-controls/location-control.component';
import { TooltipControlComponent } from '../custom-controls/tooltip-control.component';
import { CommentControlComponent } from '../custom-controls/comment-control.component';
import { CalendarModule, AutoCompleteModule, OverlayPanelModule } from 'primeng/primeng';
import { MiscellaneousService } from 'src/app/services/miscellaneous.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FirmService } from 'src/app/services/firm.service';
import { FundService } from 'src/app/services/funds.service';
import { AccountService } from 'src/app/services/account.service';

describe('AddFundsComponent', () => {
    let component: AddFundComponent;
    let fixture: ComponentFixture<AddFundComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports:[RouterTestingModule,AngularFontAwesomeModule,FormsModule,GrowlModule,
                CalendarModule,AutoCompleteModule,OverlayPanelModule,HttpClientTestingModule],
            declarations: [AddFundComponent,TypeAheadControlComponent,LocationControlComponent,TooltipControlComponent,CommentControlComponent],
            providers:[MiscellaneousService,FirmService,FundService,AccountService,{ provide: "BASE_URL", baseUrl: "localhost" }]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AddFundComponent);
        component = fixture.componentInstance;
        //fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});