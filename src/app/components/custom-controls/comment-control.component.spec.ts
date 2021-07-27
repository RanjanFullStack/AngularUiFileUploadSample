import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommentControlComponent } from './comment-control.component';
import { OverlayPanelModule } from 'primeng/primeng';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularFontAwesomeModule } from 'angular-font-awesome';

describe('CommentControlComponent', () => {
    let component: CommentControlComponent;
    let fixture: ComponentFixture<CommentControlComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports:[OverlayPanelModule,FormsModule,ReactiveFormsModule,AngularFontAwesomeModule],
            declarations: [CommentControlComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CommentControlComponent);
        component = fixture.componentInstance;
        //fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});