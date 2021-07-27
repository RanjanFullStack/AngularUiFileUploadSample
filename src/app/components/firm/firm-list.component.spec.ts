import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FirmListComponent } from './firm-list.component';
import { CheckPermissionDirective } from 'src/app/directives/check-permission.directive';
import { RouterTestingModule } from '@angular/router/testing';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { FormsModule } from '@angular/forms';
import { DataTableModule } from 'primeng/primeng';
import { MiscellaneousService } from 'src/app/services/miscellaneous.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AccountService } from 'src/app/services/account.service';
import { FirmService } from 'src/app/services/firm.service';
import { PermissionService } from 'src/app/services/permission.service';

describe('FirmListComponent', () => {
    let component: FirmListComponent;
    let fixture: ComponentFixture<FirmListComponent>;

    beforeEach(async(() => {
    
        TestBed.configureTestingModule({
            imports:[RouterTestingModule,AngularFontAwesomeModule,FormsModule,DataTableModule,HttpClientTestingModule],
            declarations: [FirmListComponent,CheckPermissionDirective],
            providers:[MiscellaneousService,AccountService,FirmService,PermissionService,{ provide: "BASE_URL", baseUrl: "localhost" }]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(FirmListComponent);
        component = fixture.componentInstance;
        ////fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});