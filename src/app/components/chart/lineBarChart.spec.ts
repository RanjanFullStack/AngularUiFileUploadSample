import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { lineBarChartComponent } from './lineBarChart';
import { MiscellaneousService } from 'src/app/services/miscellaneous.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('LineBarChartComponent', () => {
    let component: lineBarChartComponent;
    let fixture: ComponentFixture<lineBarChartComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports:[HttpClientTestingModule],
            declarations: [lineBarChartComponent],
            providers:[MiscellaneousService,{provide:'BASE_URL',baseUrl:"localhost"}]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(lineBarChartComponent);
        component = fixture.componentInstance;
        //fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});