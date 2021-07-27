import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DealListComponent } from './deal-list.component';
import { CheckPermissionDirective } from 'src/app/directives/check-permission.directive';
import { RouterTestingModule } from '@angular/router/testing';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { FormsModule } from '@angular/forms';
import { DataTableModule } from 'primeng/primeng';
import { MiscellaneousService } from 'src/app/services/miscellaneous.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AccountService } from 'src/app/services/account.service';
import { DealService } from 'src/app/services/deal.service';
import { PermissionService } from 'src/app/services/permission.service';

describe('DealListComponent', () => {
    let component: DealListComponent;
    let fixture: ComponentFixture<DealListComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports:[RouterTestingModule,AngularFontAwesomeModule,FormsModule,DataTableModule,HttpClientTestingModule],
            declarations: [DealListComponent,CheckPermissionDirective],
            providers:[MiscellaneousService,AccountService,DealService,PermissionService,{ provide: "BASE_URL", baseUrl: "localhost" }]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DealListComponent);
        component = fixture.componentInstance;
        ////fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});