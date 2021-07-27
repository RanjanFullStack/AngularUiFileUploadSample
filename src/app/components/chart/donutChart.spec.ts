import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DonutChartComponent } from './donutChart';
import { MiscellaneousService } from 'src/app/services/miscellaneous.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('DonutChartComponent', () => {
    let component: DonutChartComponent;
    let fixture: ComponentFixture<DonutChartComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports:[HttpClientTestingModule],
            declarations: [DonutChartComponent],
            providers:[MiscellaneousService,{provide:'BASE_URL',baseUrl:"localhost"}]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DonutChartComponent);
        component = fixture.componentInstance;
        //fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});