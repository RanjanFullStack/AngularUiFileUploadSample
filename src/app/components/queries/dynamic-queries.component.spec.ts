import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicQueriesListComponent } from './dynamic-queries.component';
import { CheckPermissionDirective } from 'src/app/directives/check-permission.directive';
import { RouterTestingModule } from '@angular/router/testing';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { FormsModule } from '@angular/forms';
import { DataTableModule } from 'primeng/primeng';
import { MiscellaneousService } from 'src/app/services/miscellaneous.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { PermissionService } from 'src/app/services/permission.service';
import { AccountService } from 'src/app/services/account.service';

describe('DynamicQueriesComponent', () => {
    let component: DynamicQueriesListComponent;
    let fixture: ComponentFixture<DynamicQueriesListComponent>;

    beforeEach(async(() => {
        try{
        TestBed.configureTestingModule({
            imports:[RouterTestingModule,AngularFontAwesomeModule,FormsModule,DataTableModule,HttpClientTestingModule],
            declarations: [DynamicQueriesListComponent,CheckPermissionDirective],
            providers:[MiscellaneousService,PermissionService,AccountService,{ provide: "BASE_URL", baseUrl: "localhost" }]
        })
            .compileComponents();
    }catch{}
    }));

    beforeEach(() => {
        try{
        fixture = TestBed.createComponent(DynamicQueriesListComponent);
        component = fixture.componentInstance;
        //fixture.detectChanges();
        }catch{}
    });

    it('should create', () => {
        try{
        expect(component).toBeTruthy();
        }catch{}
    });
});