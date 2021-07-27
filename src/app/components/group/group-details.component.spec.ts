import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { GroupDetailsComponent } from './group-details.component';
import { CheckPermissionDirective } from 'src/app/directives/check-permission.directive';
import { TreeTableModule } from 'primeng/primeng';
import { PermissionService } from 'src/app/services/permission.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AccountService } from 'src/app/services/account.service';
import { MiscellaneousService } from 'src/app/services/miscellaneous.service';


describe('GroupDetailsComponent', () => {
    let component: GroupDetailsComponent;
    let fixture: ComponentFixture<GroupDetailsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports:[RouterTestingModule,AngularFontAwesomeModule,TreeTableModule,HttpClientTestingModule],
            declarations: [GroupDetailsComponent,CheckPermissionDirective],
            providers:[PermissionService,AccountService,MiscellaneousService,{ provide: "BASE_URL", baseUrl: "localhost" }]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(GroupDetailsComponent);
        component = fixture.componentInstance;
        //fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});