import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { multilineChartComponent } from './multilineChart';

describe('MultilineChartComponent', () => {
    let component: multilineChartComponent;
    let fixture: ComponentFixture<multilineChartComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [multilineChartComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(multilineChartComponent);
        component = fixture.componentInstance;
        //fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});