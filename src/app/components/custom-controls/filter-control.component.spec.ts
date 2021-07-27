import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterControlComponent } from './filter-control.component';
import { TypeAheadControlComponent } from './typeahead-control.component';
import { Button } from './../../../../projects/ng-neptune/src/lib/Button/button.component';
import { ConfirmModalComponentComponent } from './../../../../projects/ng-neptune/src/lib/confirm-modal-component/confirm-modal.component';
import { Toast } from './../../../../projects/ng-neptune/src/lib/Toast/toast.component';
import { AutoCompleteModule } from 'primeng/primeng';
import { FormsModule } from '@angular/forms';
import { FilterService } from 'src/app/services/filter.services';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AccountService } from 'src/app/services/account.service';
import { InputComponent } from './../../../../projects/ng-neptune/src/lib/Input/input.component';

describe('FilterControlComponent', () => {
    let component: FilterControlComponent;
    let fixture: ComponentFixture<FilterControlComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports:[AutoCompleteModule,FormsModule,HttpClientTestingModule],
            declarations: [FilterControlComponent, TypeAheadControlComponent,Button,ConfirmModalComponentComponent,Toast,InputComponent],
            providers:[FilterService,AccountService,{provide:'BASE_URL',baseUrl:"localhost"}]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(FilterControlComponent);
        component = fixture.componentInstance;
        //fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});