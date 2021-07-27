import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { DataTableModule } from 'primeng/primeng';
import { CheckPermissionDirective } from 'src/app/directives/check-permission.directive';
import { AccountService } from 'src/app/services/account.service';
import { FundListComponent } from './fund-list.component';
import { FundService } from 'src/app/services/funds.service';
import { MiscellaneousService } from 'src/app/services/miscellaneous.service';
import { PermissionService } from 'src/app/services/permission.service';


describe('FundListComponent', () => {
    let component: FundListComponent;
    let fixture: ComponentFixture<FundListComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports:[RouterTestingModule,AngularFontAwesomeModule,FormsModule,DataTableModule,HttpClientTestingModule],
            declarations: [FundListComponent,CheckPermissionDirective],
            providers:[AccountService,FundService,MiscellaneousService,PermissionService,{ provide: "BASE_URL", baseUrl: "localhost" }]
            
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(FundListComponent);
        component = fixture.componentInstance;
        ////fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});