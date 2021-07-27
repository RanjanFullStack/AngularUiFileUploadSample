import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FirmDetailsComponent } from './firm-details.component';
import { RouterTestingModule } from '@angular/router/testing';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { AccountService } from 'src/app/services/account.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MiscellaneousService } from 'src/app/services/miscellaneous.service';
import { FirmService } from 'src/app/services/firm.service';
import { FormBuilder } from '@angular/forms';
import { CheckPermissionDirective } from 'src/app/directives/check-permission.directive';

describe('FirmDetailsComponent', () => {
    let component: FirmDetailsComponent;
    let fixture: ComponentFixture<FirmDetailsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports:[RouterTestingModule,AngularFontAwesomeModule,HttpClientTestingModule],
            declarations: [FirmDetailsComponent],
            providers:[AccountService,MiscellaneousService,FirmService,{ provide: "BASE_URL", baseUrl: "localhost" }]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(FirmDetailsComponent);
        component = fixture.componentInstance;
        //fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});