import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { lineChartComponent } from './lineChart';

describe('LineChartComponent', () => {
    let component: lineChartComponent;
    let fixture: ComponentFixture<lineChartComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [lineChartComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(lineChartComponent);
        component = fixture.componentInstance;
        //fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});