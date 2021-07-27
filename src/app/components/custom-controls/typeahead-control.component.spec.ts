import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TypeAheadControlComponent } from './typeahead-control.component';
import {AutoCompleteModule } from 'primeng/primeng';
import { FormsModule } from '@angular/forms';
import { MiscellaneousService } from 'src/app/services/miscellaneous.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
describe('TypeaheadControlComponent', () => {
    let component: TypeAheadControlComponent;
    let fixture: ComponentFixture<TypeAheadControlComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports:[FormsModule,AutoCompleteModule,HttpClientTestingModule],
            declarations: [TypeAheadControlComponent],
            providers:[MiscellaneousService,{provide:'BASE_URL',baseUrl:"localhost"}]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TypeAheadControlComponent);
        component = fixture.componentInstance;
        //fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});