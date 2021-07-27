import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeComponent } from './home.component';
import { GraphChartComponent } from '../chart/graphChart';
import { lineBarChartComponent } from '../chart/lineBarChart';
import { DonutChartComponent } from '../chart/donutChart';
import { BarChartComponent } from '../chart/barChart';
import { Pie3DChartComponent } from '../chart/pie3DChart';
import { ReportService } from 'src/app/services/report.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MiscellaneousService } from 'src/app/services/miscellaneous.service';
import { AccountService } from 'src/app/services/account.service';

describe('HomeComponent', () => {
    let component: HomeComponent;
    let fixture: ComponentFixture<HomeComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports:[HttpClientTestingModule],
            declarations: [HomeComponent,GraphChartComponent,lineBarChartComponent,DonutChartComponent,BarChartComponent,Pie3DChartComponent],
            providers:[ReportService,MiscellaneousService,AccountService,{ provide: "BASE_URL", baseUrl: "localhost" }]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(HomeComponent);
        component = fixture.componentInstance;
        //fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});