import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddQueryComponent } from './add-queries.component';
import { RouterTestingModule } from '@angular/router/testing';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { FormsModule } from '@angular/forms';
import { GrowlModule } from 'primeng/growl';
import { TableModule } from 'primeng/table';
import { MiscellaneousService } from 'src/app/services/miscellaneous.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('AddQueriesComponent', () => {
    let component: AddQueryComponent;
    let fixture: ComponentFixture<AddQueryComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports:[RouterTestingModule,AngularFontAwesomeModule,FormsModule,GrowlModule,TableModule,HttpClientTestingModule],
            declarations: [AddQueryComponent],
            providers:[MiscellaneousService,{ provide: "BASE_URL", baseUrl: "localhost" }]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AddQueryComponent);
        component = fixture.componentInstance;
        ////fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});