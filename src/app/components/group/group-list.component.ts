 
import { Component, Inject, ChangeDetectorRef } from "@angular/core";
import { AccountService } from "../../services/account.service";
import { Http } from "@angular/http";
import { PermissionService, FeaturesEnum } from "../../services/permission.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { NgxSpinnerService } from "ngx-spinner";
import { MiscellaneousService } from "../../services/miscellaneous.service";
import { LazyLoadEvent } from "primeng/primeng";
 



@Component({
    selector: 'groups',
    templateUrl: './group-list.component.html'
})

export class GroupListComponent {
    public groups: any;
	feature: typeof FeaturesEnum = FeaturesEnum;
    dataTable: any;
    selectedGroup: string;
    currentModalRef: any;
    selectedGroupId: string;
    userList: any;
    loading = false;
    successMessage: any = true;
    blockedTable: boolean = false;
	pagerLength: any;
	totalRecords: number;
	globalFilter: string = "";
	paginationFilterClone: any = {};
    constructor(private miscService: MiscellaneousService, private accountService: AccountService, private permissionService: PermissionService, private spinner: NgxSpinnerService, protected changeDetectorRef: ChangeDetectorRef, private modalService: NgbModal) {
       
        this.pagerLength = this.miscService.getPagerLength();
	}


	getGroupList(event: any) {
		if (event == null) {
			event = { first: 0, rows: 10, globalFilter: null, sortField: null, sortOrder: 1 };
		}
		this.paginationFilterClone = JSON.parse(JSON.stringify(event));
		this.blockedTable = true;		
		this.permissionService.getGroupList({ paginationFilter: event }).subscribe(result => {
			let resp = result["body"];
			if (result != null && result.code == "OK") {
				this.groups = resp.groupList;
				this.totalRecords = resp.totalRecords;
			}
			else {
				this.groups = [];
				this.totalRecords = 0;
			}

			this.blockedTable = false;

		}, error => {

			this.accountService.redirectToLogin(error);
			this.blockedTable = false;
		});


	}

	loadGroupsLazy(event: LazyLoadEvent) {
		this.getGroupList(event);
	}

    openGroupDetailsModal(content: any, groupName: string, groupId: string) {
        this.spinner.show();
        
        this.selectedGroup = groupName;
         
        this.getUserListByGroupId(groupId, content);
        
    }

    getUserListByGroupId(groupId: any, content: any,) {
        this.permissionService.getGroupById({ Value: groupId })
            .subscribe(result => {				
				let resp = result["body"];
				if (resp != null && resp.groupID > 0) {
					this.userList = resp.userGroup;
				}
				else {
				}


                this.spinner.hide();
                this.currentModalRef = this.modalService.open(content, { size: 'lg' });
                

            }, error => {
                this.accountService.redirectToLogin(error);
                this.spinner.hide();

            });
    }

    closeModal() {
        this.currentModalRef.close();
	}

	exportGroupList() {
		let event = JSON.parse(JSON.stringify(this.paginationFilterClone));
		event.globalFilter = this.globalFilter;
		event.filterWithoutPaging = true;
		this.permissionService.exportGroupList({ paginationFilter: event }).subscribe(response => this.miscService.downloadExcelFile(response));
	}

   
}
