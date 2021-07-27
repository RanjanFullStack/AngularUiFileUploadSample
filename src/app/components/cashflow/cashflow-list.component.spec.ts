import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CashflowlListComponent } from './cashflow-list.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CheckPermissionDirective } from 'src/app/directives/check-permission.directive';
import { RouterTestingModule } from '@angular/router/testing';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { DataTableModule } from 'primeng/primeng';
import { MiscellaneousService } from 'src/app/services/miscellaneous.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AccountService } from 'src/app/services/account.service';
import { CashflowService } from 'src/app/services/cashflow.service';
import { PermissionService } from 'src/app/services/permission.service';



describe('CashflowListComponent', () => {
    let component: CashflowlListComponent;
    let fixture: ComponentFixture<CashflowlListComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports:[FormsModule,ReactiveFormsModule,RouterTestingModule,AngularFontAwesomeModule,DataTableModule,HttpClientTestingModule],
            declarations: [CashflowlListComponent,CheckPermissionDirective],
            providers:[MiscellaneousService,AccountService,CashflowService,PermissionService,{provide:'BASE_URL',baseUrl:"localhost"}]
            
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CashflowlListComponent);
        component = fixture.componentInstance;
        //fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});