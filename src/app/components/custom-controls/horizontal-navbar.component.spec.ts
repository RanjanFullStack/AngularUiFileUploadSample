import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HorizontalNavBarComponent } from './horizontal-navbar.component';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { SelectButtonModule } from 'primeng/primeng';
import { FormsModule } from '@angular/forms';

describe('HorizontalNavbarComponent', () => {
    let component: HorizontalNavBarComponent;
    let fixture: ComponentFixture<HorizontalNavBarComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports:[AngularFontAwesomeModule,SelectButtonModule,FormsModule],
            declarations: [HorizontalNavBarComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(HorizontalNavBarComponent);
        component = fixture.componentInstance;
        //fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});