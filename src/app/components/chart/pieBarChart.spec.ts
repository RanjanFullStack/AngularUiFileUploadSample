import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { pieBarChartComponent } from './pieBarChart';
import { MiscellaneousService } from 'src/app/services/miscellaneous.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('PieBarChartComponent', () => {
    let component: pieBarChartComponent;
    let fixture: ComponentFixture<pieBarChartComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports:[HttpClientTestingModule],
            declarations: [pieBarChartComponent],
            providers:[MiscellaneousService,{provide:'BASE_URL',baseUrl:"localhost"}]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(pieBarChartComponent);
        component = fixture.componentInstance;
        //fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});