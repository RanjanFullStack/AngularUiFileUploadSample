import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { DataTableModule } from 'primeng/primeng';
import { CheckPermissionDirective } from 'src/app/directives/check-permission.directive';
import { PipelineListComponent } from './pipeline-list.component';
import { AccountService } from 'src/app/services/account.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { PipelineService } from 'src/app/services/pipeline.service';
import { MiscellaneousService } from 'src/app/services/miscellaneous.service';
import { PermissionService } from 'src/app/services/permission.service';


describe('PipelineListComponent', () => {
    let component: PipelineListComponent;
    let fixture: ComponentFixture<PipelineListComponent>;

    beforeEach(async(() => {
        try{
        TestBed.configureTestingModule({
            imports:[RouterTestingModule,AngularFontAwesomeModule,FormsModule,DataTableModule,HttpClientTestingModule],
            declarations: [PipelineListComponent,CheckPermissionDirective],
            providers:[AccountService,PipelineService,MiscellaneousService,PermissionService,{ provide: "BASE_URL", baseUrl: "localhost" }]
        })
            .compileComponents();
    }catch{}
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PipelineListComponent);
        component = fixture.componentInstance;
        ////fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});