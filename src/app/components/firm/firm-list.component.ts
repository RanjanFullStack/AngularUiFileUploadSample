import { ChangeDetectorRef, Component } from '@angular/core';
import { LazyLoadEvent } from 'primeng/primeng';
import { AccountService } from '../../services/account.service';
import { FirmService } from '../../services/firm.service';
import { MiscellaneousService } from '../../services/miscellaneous.service';
import { FeaturesEnum } from '../../services/permission.service';

@Component({
    selector: 'firm',
    templateUrl: './firm-list.component.html'
})

export class FirmListComponent {
    feature: typeof FeaturesEnum = FeaturesEnum;
    public firms: any=[];    
    pagerLength: any;
    dataTable: any;
    blockedTable: boolean = false;
	totalRecords: number;
	globalFilter: string = "";
	paginationFilterClone: any = {};

    constructor(private miscService: MiscellaneousService,private accountService: AccountService, private firmService: FirmService, protected changeDetectorRef: ChangeDetectorRef) {
        this.pagerLength = this.miscService.getPagerLength();
    }

	getFirmList(event: any) {

		if (event == null) {
			event = { first: 0, rows: 10, globalFilter: null, sortField: null, sortOrder: 1 };
        }
        if (event.multiSortMeta == undefined) {
            event.multiSortMeta = [{ field: "FirmName", order: 1 }];
            event.sortField = "FirmName";
        }
		this.paginationFilterClone = JSON.parse(JSON.stringify(event));

        this.blockedTable = true;
		this.firmService.getFirmList({ paginationFilter: event }).subscribe(result => {

            let resp = result["body"] ;// JSON.parse(result._body);
			if (resp != null && result.code == "OK") {
				this.firms = resp.firmList;
				
				this.totalRecords = resp.totalRecords;
			}
			else {
				this.firms = [];
				this.totalRecords = 0;
			}
			this.blockedTable = false;    
        }, error => {
            this.blockedTable = false;
            this.accountService.redirectToLogin(error);

        });
	}

	exportFirmList() {
		let event = JSON.parse(JSON.stringify(this.paginationFilterClone));
		event.globalFilter = this.globalFilter;
		event.filterWithoutPaging = true;
		this.firmService.exportFirmList({ paginationFilter: event }).subscribe(response => this.miscService.downloadExcelFile(response));
	}
   

	loadFirmsLazy(event: LazyLoadEvent) {
		
		this.getFirmList(event);
	}
}

