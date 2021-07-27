import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPipelineComponent } from './add-pipeline.component';
import { RouterTestingModule } from '@angular/router/testing';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { FormsModule } from '@angular/forms';
import { TypeAheadControlComponent } from '../custom-controls/typeahead-control.component';
import { CalendarModule, GrowlModule, AutoCompleteModule } from 'primeng/primeng';
import { PipelineService } from 'src/app/services/pipeline.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FirmService } from 'src/app/services/firm.service';
import { FundService } from 'src/app/services/funds.service';
import { MiscellaneousService } from 'src/app/services/miscellaneous.service';
import { AccountService } from 'src/app/services/account.service';

describe('AddPipelineComponent', () => {
    let component: AddPipelineComponent;
    let fixture: ComponentFixture<AddPipelineComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports:[RouterTestingModule,HttpClientTestingModule,AngularFontAwesomeModule,FormsModule,CalendarModule,GrowlModule,AutoCompleteModule],
            declarations: [AddPipelineComponent,TypeAheadControlComponent],
            providers:[PipelineService,FirmService,FundService,MiscellaneousService,AccountService,{ provide: "BASE_URL", baseUrl: "localhost" }]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AddPipelineComponent);
        component = fixture.componentInstance;
        //fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});