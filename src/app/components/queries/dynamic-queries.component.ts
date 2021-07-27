import { ChangeDetectorRef, Component } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { LazyLoadEvent } from 'primeng/primeng';
import { MiscellaneousService } from '../../services/miscellaneous.service';
import { FeaturesEnum } from '../../services/permission.service';

@Component({
    selector: 'dynamic-queries',
    templateUrl: './dynamic-queries.component.html'
})

export class DynamicQueriesListComponent {
    feature: typeof FeaturesEnum = FeaturesEnum;
    public querys: any = [];
    id: any;
    closeResult: string;
    pagerLength: any;
    dataTable: any;
    blockedTable: boolean = false;
    totalRecords: number;
    globalFilter: string = "";
    loading = false;
    model: any = {};
    constructor(protected changeDetectorRef: ChangeDetectorRef, private spinner: NgxSpinnerService, private miscService: MiscellaneousService) {
        this.pagerLength = this.miscService.getPagerLength();
    }

    GetDynamicQueriesList(event: any) {
        if (event == null) {
            event = { first: 0, rows: 10, globalFilter: null, sortField: null, sortOrder: 1 };
        }

        this.blockedTable = true;
        this.miscService.GetDynamicQueriesList({ paginationFilter: event }).subscribe(result => {
            let resp = result["body"];
            if (resp != null && result.code == "OK") {
               
                this.querys = resp.queryList;
                this.totalRecords = resp.totalRecords;
            }
            else {
                this.querys = [];
                this.totalRecords = 0;
            }
            this.blockedTable = false;
        }, error => {
            this.blockedTable = false;
            this.miscService.redirectToLogin(error);
        });
    }

    exportQueryList() {
        let event = { globalFilter: this.globalFilter, filterWithoutPaging: true };
        this.miscService.exportQueries({ paginationFilter: event }).subscribe(response => this.miscService.downloadExcelFile(response));
    }

    loadQueriesLazy(event: LazyLoadEvent) {
        this.GetDynamicQueriesList(event);
    }
}