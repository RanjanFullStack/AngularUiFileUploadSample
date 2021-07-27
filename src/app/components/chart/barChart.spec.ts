import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BarChartComponent } from './barChart';
import { MiscellaneousService } from 'src/app/services/miscellaneous.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('BarChartComponent', () => {
    let component: BarChartComponent;
    let fixture: ComponentFixture<BarChartComponent>;

    beforeEach(async(() => {
        // TestBed.configureTestingModule({
        //     imports:[HttpClientTestingModule],
        //     declarations: [BarChartComponent],
        //     providers:[MiscellaneousService,{provide:'BASE_URL',baseUrl:"localhost"}]
        // })
        //     .compileComponents();
    }));

    beforeEach(() => {
        // fixture = TestBed.createComponent(BarChartComponent);
        // component = fixture.componentInstance;
        // //fixture.detectChanges();
    });

    it('should create', () => {
        //expect(component).toBeTruthy();
    });
});