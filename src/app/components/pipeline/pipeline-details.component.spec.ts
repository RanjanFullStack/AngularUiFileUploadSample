import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PipelineDetailsComponent } from './pipeline-details.component';
import { RouterTestingModule } from '@angular/router/testing';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { CheckPermissionDirective } from 'src/app/directives/check-permission.directive';
import { GrowlModule } from 'primeng/growl';
import { AccountService } from 'src/app/services/account.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { PipelineService } from 'src/app/services/pipeline.service';
import { PermissionService } from 'src/app/services/permission.service';

describe('PipelineDetailsComponent', () => {
    let component: PipelineDetailsComponent;
    let fixture: ComponentFixture<PipelineDetailsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports:[RouterTestingModule,AngularFontAwesomeModule,GrowlModule,HttpClientTestingModule],
            declarations: [PipelineDetailsComponent,CheckPermissionDirective],
            providers:[AccountService,PipelineService,PermissionService,{ provide: "BASE_URL", baseUrl: "localhost" }]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PipelineDetailsComponent);
        component = fixture.componentInstance;
        //fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});