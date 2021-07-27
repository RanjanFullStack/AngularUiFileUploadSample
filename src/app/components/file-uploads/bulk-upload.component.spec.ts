import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkUploadComponent } from './bulk-upload.component';
import { DropdownModule, GrowlModule, FileUploadModule, AutoCompleteModule } from 'primeng/primeng';
import { TypeAheadControlComponent } from '../custom-controls/typeahead-control.component';
import { FormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MiscellaneousService } from 'src/app/services/miscellaneous.service';
import { PortfolioCompanyService } from 'src/app/services/portfolioCompany.service';

describe('BulkUploadComponent', () => {
    let component: BulkUploadComponent;
    let fixture: ComponentFixture<BulkUploadComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports:[DropdownModule,FormsModule,GrowlModule,FileUploadModule,AutoCompleteModule,HttpClientTestingModule],
            declarations: [BulkUploadComponent,TypeAheadControlComponent],
            providers:[{ provide: "BASE_URL", baseUrl: "localhost" },MiscellaneousService,PortfolioCompanyService]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(BulkUploadComponent);
        component = fixture.componentInstance;
        //fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});