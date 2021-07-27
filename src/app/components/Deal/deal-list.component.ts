import { ChangeDetectorRef, Component } from '@angular/core';
import 'datatables.net';
import 'datatables.net-bs4';
import { NgxSpinnerService } from 'ngx-spinner';
import { LazyLoadEvent } from 'primeng/primeng';
import { AccountService } from '../../services/account.service';
import { DealService } from '../../services/deal.service';
import { MiscellaneousService } from '../../services/miscellaneous.service';
import { FeaturesEnum } from '../../services/permission.service';

@Component({
	selector: 'deal-list',
	templateUrl: './deal-list.component.html'
})

export class DealListComponent {
    feature: typeof FeaturesEnum = FeaturesEnum;
	public deals: any;
	closeResult: string;
	blockedTable: boolean = false;
	totalRecords: number;
    dataTable: any;
	pagerLength: any;
	globalFilter: string = "";
	
    constructor(private miscService: MiscellaneousService, private accountService: AccountService, private _dealService: DealService, protected changeDetectorRef: ChangeDetectorRef, private spinner: NgxSpinnerService) {
        this.pagerLength = this.miscService.getPagerLength();
	}

	paginationFilterClone: any = {};

	getDealList(event: any) {

		if (event == null) {
			event = { first: 0, rows: 10, globalFilter: null, sortField: null, sortOrder: 1 };
        }
        if (event.multiSortMeta == undefined) {
            event.multiSortMeta = [{ field: "DealID", order: 1 }];
            event.sortField = "DealID";
        }

		this.paginationFilterClone = JSON.parse(JSON.stringify(event));
		this.blockedTable = true;
		this._dealService.getDealsList({ paginationFilter: event }).subscribe(result => {

			let resp = result["body"]// JSON.parse(result._body);
			if (resp != null && result.code == "OK") {
				this.deals = resp.dealList;
				this.totalRecords = resp.totalRecords;
			}
			else {
				this.deals = [];
				this.totalRecords = 0;
			}
			this.blockedTable = false;
		}, error => {
			this.blockedTable = false;
			this.accountService.redirectToLogin(error);

		});
	}
	exportDealList() {
		let event = JSON.parse(JSON.stringify(this.paginationFilterClone));
		event.globalFilter = this.globalFilter;
		event.filterWithoutPaging = true;
		this._dealService.exportDealList({ paginationFilter: event, includeAllDetails: true}).subscribe(response => this.miscService.downloadExcelFile(response));
	}

	loadDealsLazy(event: LazyLoadEvent) {
		this.getDealList(event);
	}

}