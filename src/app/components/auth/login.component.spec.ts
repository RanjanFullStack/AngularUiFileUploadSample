import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { DialogModule } from 'primeng/primeng';
import { LoginComponent } from './login.component';
import { ResetPasswordControl } from './reset-password.control';
import { AccountService } from 'src/app/services/account.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AlertService } from 'src/app/services/alert.service';
import { MiscellaneousService } from 'src/app/services/miscellaneous.service';


describe('LoginComponent', () => {
    let component: LoginComponent;
    let fixture: ComponentFixture<LoginComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports:[FormsModule,DialogModule,RouterTestingModule,HttpClientTestingModule],
            declarations: [LoginComponent,ResetPasswordControl],
            providers:[AccountService,AlertService,MiscellaneousService,{ provide: "BASE_URL", baseUrl: "localhost" }]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(LoginComponent);
        component = fixture.componentInstance;
        //fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});