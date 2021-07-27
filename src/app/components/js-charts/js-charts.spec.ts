import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JSChartComponent } from './js-charts';

describe('JsChartsComponent', () => {
    let component: JSChartComponent;
    let fixture: ComponentFixture<JSChartComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [JSChartComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(JSChartComponent);
        component = fixture.componentInstance;
        //fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});