import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PortfolioCompanyListComponent } from './portfolioCompany-list.component';
import { RouterTestingModule } from '@angular/router/testing';
import { CheckPermissionDirective } from 'src/app/directives/check-permission.directive';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { FormsModule } from '@angular/forms';
import { DataTableModule, SplitButtonModule } from 'primeng/primeng';
import { MiscellaneousService } from 'src/app/services/miscellaneous.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { PortfolioCompanyService } from 'src/app/services/portfolioCompany.service';
import { AccountService } from 'src/app/services/account.service';
import { PermissionService } from 'src/app/services/permission.service';

describe('PortfolioCompanyListComponent', () => {
    let component: PortfolioCompanyListComponent;
    let fixture: ComponentFixture<PortfolioCompanyListComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports:[RouterTestingModule,AngularFontAwesomeModule,FormsModule,DataTableModule,HttpClientTestingModule,SplitButtonModule],
            declarations: [PortfolioCompanyListComponent,CheckPermissionDirective],
            providers:[MiscellaneousService,PortfolioCompanyService,AccountService,PermissionService,{ provide: "BASE_URL", baseUrl: "localhost" }]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PortfolioCompanyListComponent);
        component = fixture.componentInstance;
        ////fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
    it("should call export all portfolio companies",()=>{
        component.exportPortfolioCompanyKPIDataList();
    });
});