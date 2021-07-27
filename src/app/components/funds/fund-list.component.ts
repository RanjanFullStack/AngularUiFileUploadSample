import { ChangeDetectorRef, Component } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { LazyLoadEvent } from 'primeng/primeng';
import { AccountService } from '../../services/account.service';
import { FundService } from '../../services/funds.service';
import { MiscellaneousService } from '../../services/miscellaneous.service';
import { FeaturesEnum } from '../../services/permission.service';


@Component({
	selector: 'fund-list',
	templateUrl: './fund-list.component.html'
})

export class FundListComponent {
    feature: typeof FeaturesEnum = FeaturesEnum;
	public funds: any=[];
	closeResult: string;
    pagerLength: any;
	dataTable: any;
	blockedTable: boolean = false;
	totalRecords: number;
	globalFilter: string = "";
	paginationFilterClone: any = {}
	constructor(private accountService: AccountService, private _fundService: FundService, protected changeDetectorRef: ChangeDetectorRef, private spinner: NgxSpinnerService, private miscService: MiscellaneousService) {
		this.pagerLength = this.miscService.getPagerLength();
	}

	getFundList(event: any) {

		if (event == null) {
			event = { first: 0, rows: 10, globalFilter: null, sortField: null, sortOrder: 1 };
        }
        if (event.multiSortMeta == undefined) {
            event.multiSortMeta = [{ field: "fundName", order: 1 }]; 
            event.sortField = "fundName";
        }

		this.paginationFilterClone = JSON.parse(JSON.stringify(event));

		this.blockedTable = true;
		this._fundService.getFundsList({ paginationFilter: event }).subscribe(result => {

			let resp = result["body"] ;// JSON.parse(result._body);
			if (resp != null && result.code == "OK") {
				this.funds = resp.fundList;
				this.totalRecords = resp.totalRecords;
			}
			else {
				this.funds = [];
				this.totalRecords = 0;
			}
			this.blockedTable = false;
		}, error => {
			this.blockedTable = false;
			this.accountService.redirectToLogin(error);

		});
	}

	exportFundList() {
		let event = JSON.parse(JSON.stringify(this.paginationFilterClone));
		event.globalFilter = this.globalFilter;
		event.filterWithoutPaging = true;
		this._fundService.exportFundList({ paginationFilter: event }).subscribe(response => this.miscService.downloadExcelFile(response));
	}
 

	loadFundsLazy(event: LazyLoadEvent) {
		this.getFundList(event);
	}
}