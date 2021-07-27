import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterComponent } from './master.component';
import { RouterTestingModule } from '@angular/router/testing';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { NavMenuComponent } from '../navmenu/navmenu.component';
import { PlaceholderComponent, BreadcrumbComponent, ContentService } from './master.module';
import { NgxSpinnerModule } from 'ngx-spinner';
import { CheckPermissionDirective } from 'src/app/directives/check-permission.directive';
import { PermissionService } from 'src/app/services/permission.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AccountService } from 'src/app/services/account.service';
import { ReportService } from 'src/app/services/report.service';

describe('MasterComponent', () => {
    let component: MasterComponent;
    let fixture: ComponentFixture<MasterComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports:[RouterTestingModule,AngularFontAwesomeModule,NgxSpinnerModule,HttpClientTestingModule],
            declarations: [MasterComponent,NavMenuComponent,PlaceholderComponent,BreadcrumbComponent,CheckPermissionDirective],
            providers:[PermissionService,AccountService,ReportService,ContentService,{ provide: "BASE_URL", baseUrl: "localhost" }]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(MasterComponent);
        component = fixture.componentInstance;
        //fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});