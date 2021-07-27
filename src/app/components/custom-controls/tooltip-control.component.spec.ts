import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TooltipControlComponent } from './tooltip-control.component';
import { OverlayPanelModule } from 'primeng/primeng';


describe('TooltipControlComponent', () => {
    let component: TooltipControlComponent;
    let fixture: ComponentFixture<TooltipControlComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports:[OverlayPanelModule],
            declarations: [TooltipControlComponent],
            providers:[]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TooltipControlComponent);
        component = fixture.componentInstance;
        //fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});