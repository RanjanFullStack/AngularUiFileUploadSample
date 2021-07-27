import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Pie3DChartComponent } from './pie3DChart';

describe('Pie3DChartComponent', () => {
    let component: Pie3DChartComponent;
    let fixture: ComponentFixture<Pie3DChartComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [Pie3DChartComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(Pie3DChartComponent);
        component = fixture.componentInstance;
        //fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});