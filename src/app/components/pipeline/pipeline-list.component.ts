import { ChangeDetectorRef, Component } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { LazyLoadEvent } from 'primeng/primeng';
import { AccountService } from '../../services/account.service';
import { MiscellaneousService } from '../../services/miscellaneous.service';
import { FeaturesEnum } from '../../services/permission.service';
import { PipelineService } from '../../services/pipeline.service';


@Component({
    selector: 'pipeline-list',
    templateUrl: './pipeline-list.component.html'
})

export class PipelineListComponent {
    feature: typeof FeaturesEnum = FeaturesEnum;
     pipelineList: any = [];
    closeResult: string;
    pagerLength: any;
    dataTable: any;
    blockedTable: boolean = false;
    totalRecords: number;
	globalFilter: string = "";
	paginationFilterClone: any = {};
    constructor(private accountService: AccountService, private _pipelineService:PipelineService, protected changeDetectorRef: ChangeDetectorRef, private spinner: NgxSpinnerService, private miscService: MiscellaneousService) {
        this.pagerLength = this.miscService.getPagerLength();
    }

    getPipelineList(event: any) {
         
        if (event == null) {
            event = { first: 0, rows: 10, globalFilter: null, sortField: null, sortOrder: 1 };
        }
		this.paginationFilterClone = JSON.parse(JSON.stringify(event));
        this.blockedTable = true;
        this._pipelineService.getPipelineList({ paginationFilter: event }).subscribe(result => {

             
            let resp = result["body"];// JSON.parse(result._body);
            if (resp != null ) {
                this.pipelineList = resp.pipelineList;
                this.totalRecords = resp.totalRecords;
            }
            else {
                this.pipelineList = [];
                this.totalRecords = 0;
            }
            this.blockedTable = false;
        }, error => {
            this.blockedTable = false;
            this.accountService.redirectToLogin(error);

        });
    }

    exportPipelineList() {
		let event = JSON.parse(JSON.stringify(this.paginationFilterClone));
		event.globalFilter = this.globalFilter;
		event.filterWithoutPaging = true;
        this._pipelineService.exportPipelineList({ paginationFilter: event }).subscribe(response => this.miscService.downloadExcelFile(response));
    }


    loadPipelinesLazy(event: LazyLoadEvent) {

        this.getPipelineList(event);
    }
}