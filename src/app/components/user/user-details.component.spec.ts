import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserDetailsComponent } from './user-details.component';
import { RouterTestingModule } from '@angular/router/testing';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { AccountService } from 'src/app/services/account.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MiscellaneousService } from 'src/app/services/miscellaneous.service';

describe('UserDetailsComponent', () => {
    let component: UserDetailsComponent;
    let fixture: ComponentFixture<UserDetailsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports:[RouterTestingModule,AngularFontAwesomeModule,HttpClientTestingModule],
            declarations: [UserDetailsComponent],
            providers:[AccountService,MiscellaneousService,{ provide: "BASE_URL", baseUrl: "localhost" }]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        // fixture = TestBed.createComponent(UserDetailsComponent);
        // component = fixture.componentInstance;
        // //fixture.detectChanges();
    });

    it('should create', () => {
        //expect(component).toBeTruthy();
    });
});