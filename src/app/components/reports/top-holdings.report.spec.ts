import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TopHoldingsComponent } from './top-holdings.report';
import { HorizontalNavBarComponent } from '../custom-controls/horizontal-navbar.component';
import { FormsModule } from '@angular/forms';
import { MultiSelectModule, CalendarModule, SelectButtonModule, AutoCompleteModule } from 'primeng/primeng';
import { FilterControlComponent } from '../custom-controls/filter-control.component';
import { Button } from './../../../../projects/ng-neptune/src/lib/Button/button.component';
import { Toast } from './../../../../projects/ng-neptune/src/lib/Toast/toast.component';
import { ConfirmModalComponentComponent } from './../../../../projects/ng-neptune/src/lib/confirm-modal-component/confirm-modal.component';
import { TableModule } from 'primeng/table';
import { FormatNumbersPipe, MinusSignToBracketsPipe } from 'src/app/pipes/minus-sign-to-brackets';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { TypeAheadControlComponent } from '../custom-controls/typeahead-control.component';
import { ReportService } from 'src/app/services/report.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MiscellaneousService } from 'src/app/services/miscellaneous.service';
import { AccountService } from 'src/app/services/account.service';
import { FilterService } from 'src/app/services/filter.services';
import { InputComponent } from './../../../../projects/ng-neptune/src/lib/Input/input.component';

describe('TopHoldingsReportComponent', () => {
    let component: TopHoldingsComponent;
    let fixture: ComponentFixture<TopHoldingsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports:[FormsModule,HttpClientTestingModule,MultiSelectModule,CalendarModule,SelectButtonModule,TableModule,AngularFontAwesomeModule,AutoCompleteModule],
            declarations: [TopHoldingsComponent,HorizontalNavBarComponent,FilterControlComponent,Button,Toast,ConfirmModalComponentComponent,FormatNumbersPipe,MinusSignToBracketsPipe,TypeAheadControlComponent,InputComponent],
            providers:[ReportService,MiscellaneousService,AccountService,FilterService,{ provide: "BASE_URL", baseUrl: "localhost" }]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TopHoldingsComponent);
        component = fixture.componentInstance;
        ////fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});