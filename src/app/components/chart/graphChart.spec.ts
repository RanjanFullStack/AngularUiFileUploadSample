import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphChartComponent } from './graphChart';
import { MiscellaneousService } from 'src/app/services/miscellaneous.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('GraphChartComponent', () => {
    let component: GraphChartComponent;
    let fixture: ComponentFixture<GraphChartComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports:[HttpClientTestingModule],
            declarations: [GraphChartComponent],
            providers:[MiscellaneousService,{provide:'BASE_URL',baseUrl:"localhost"}]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(GraphChartComponent);
        component = fixture.componentInstance;
        ////fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});