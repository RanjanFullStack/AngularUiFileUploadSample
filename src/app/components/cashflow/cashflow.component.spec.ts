import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CashflowComponent } from './cashflow.component';
import { TooltipControlComponent } from "./../custom-controls/tooltip-control.component";
import { TypeAheadControlComponent} from "./../custom-controls/typeahead-control.component"
import { RouterTestingModule } from '@angular/router/testing';
import { AngularFontAwesomeModule } from "angular-font-awesome";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GrowlModule } from "primeng/growl";
import { FileUploadModule } from "primeng/fileupload";
import { MinusSignToBracketsPipe } from 'src/app/pipes/minus-sign-to-brackets';
import { CheckPermissionDirective } from 'src/app/directives/check-permission.directive';
import { TableModule } from 'primeng/table';
import { Dialog, OverlayPanel, AutoComplete } from 'primeng/primeng';
import { MiscellaneousService } from 'src/app/services/miscellaneous.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CashflowService } from 'src/app/services/cashflow.service';
import { AccountService } from 'src/app/services/account.service';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { FundService } from 'src/app/services/funds.service';

describe('CashflowComponent', () => {
    let component: CashflowComponent;
    let fixture: ComponentFixture<CashflowComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports:[RouterTestingModule,AngularFontAwesomeModule,FormsModule,ReactiveFormsModule,GrowlModule,FileUploadModule,TableModule,HttpClientTestingModule],
            declarations: [CashflowComponent,TooltipControlComponent, TypeAheadControlComponent,MinusSignToBracketsPipe,CheckPermissionDirective,
                Dialog,OverlayPanel,AutoComplete],
            providers:[MiscellaneousService,CashflowService,AccountService,FileUploadService,FundService,{provide:'BASE_URL',baseUrl:"localhost"}]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CashflowComponent);
        component = fixture.componentInstance;
        //fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});