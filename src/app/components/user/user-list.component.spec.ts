import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserListComponent } from './user-list.component';
import { RouterTestingModule } from '@angular/router/testing';
import { CheckPermissionDirective } from 'src/app/directives/check-permission.directive';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { GrowlModule } from 'primeng/growl';
import { FormsModule } from '@angular/forms';
import { DataTableModule, ConfirmDialogModule } from 'primeng/primeng';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MiscellaneousService } from 'src/app/services/miscellaneous.service';
import { AccountService } from 'src/app/services/account.service';
import { PermissionService } from 'src/app/services/permission.service';

describe('UserListComponent', () => {
    let component: UserListComponent;
    let fixture: ComponentFixture<UserListComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports:[RouterTestingModule,AngularFontAwesomeModule,GrowlModule,FormsModule,DataTableModule,ConfirmDialogModule,HttpClientTestingModule],
            declarations: [UserListComponent,CheckPermissionDirective],
            providers:[MiscellaneousService,AccountService,PermissionService,{ provide: "BASE_URL", baseUrl: "localhost" }]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(UserListComponent);
        component = fixture.componentInstance;
        ////fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});