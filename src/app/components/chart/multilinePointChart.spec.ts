import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { multilinePointChartComponent } from './multilinePointChart';
import { MiscellaneousService } from 'src/app/services/miscellaneous.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('MultilinePointChartComponent', () => {
    let component: multilinePointChartComponent;
    let fixture: ComponentFixture<multilinePointChartComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports:[HttpClientTestingModule],
            declarations: [multilinePointChartComponent],
            providers:[MiscellaneousService,{provide:'BASE_URL',baseUrl:"localhost"}]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(multilinePointChartComponent);
        component = fixture.componentInstance;
        //fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});