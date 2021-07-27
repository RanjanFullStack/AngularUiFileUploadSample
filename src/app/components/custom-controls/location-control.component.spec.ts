import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationControlComponent } from './location-control.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TypeAheadControlComponent } from './typeahead-control.component';
import { AutoCompleteModule } from 'primeng/primeng';
import { MiscellaneousService } from 'src/app/services/miscellaneous.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AccountService } from 'src/app/services/account.service';

describe('LocationControlComponent', () => {
    let component: LocationControlComponent;
    let fixture: ComponentFixture<LocationControlComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports:[FormsModule,ReactiveFormsModule,AutoCompleteModule,HttpClientTestingModule],
            declarations: [LocationControlComponent,TypeAheadControlComponent],
            providers:[MiscellaneousService,AccountService,{provide:'BASE_URL',baseUrl:"localhost"}]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(LocationControlComponent);
        component = fixture.componentInstance;
        ////fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});