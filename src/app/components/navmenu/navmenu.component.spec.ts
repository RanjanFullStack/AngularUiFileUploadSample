import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NavMenuComponent } from './navmenu.component';
import { RouterTestingModule } from '@angular/router/testing';
import { CheckPermissionDirective } from 'src/app/directives/check-permission.directive';
import { PermissionService } from 'src/app/services/permission.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AccountService } from 'src/app/services/account.service';
import { ReportService } from 'src/app/services/report.service';

describe('NavmenuComponent', () => {
    let component: NavMenuComponent;
    let fixture: ComponentFixture<NavMenuComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports:[RouterTestingModule,HttpClientTestingModule],
            declarations: [NavMenuComponent,CheckPermissionDirective],
            providers:[PermissionService,AccountService,ReportService,{ provide: "BASE_URL", baseUrl: "localhost" }]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(NavMenuComponent);
        component = fixture.componentInstance;
        //fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});