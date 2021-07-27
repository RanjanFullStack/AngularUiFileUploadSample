import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, Inject } from '@angular/core';
import { Http } from '@angular/http';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ConfirmationService, Message } from 'primeng/components/common/api';
import { LazyLoadEvent } from 'primeng/components/common/lazyloadevent';
import { MessageService } from 'primeng/components/common/messageservice';
import { AccountService } from '../../services/account.service';
import { MiscellaneousService } from '../../services/miscellaneous.service';
import { FeaturesEnum } from '../../services/permission.service';
 


@Component({
    selector: 'user',
    templateUrl: './user-list.component.html',
	providers: [MessageService, ConfirmationService]
})

export class UserListComponent {
    feature: typeof FeaturesEnum = FeaturesEnum;
    public users: any;
    closeResult: string;
    dataTable: any;
    loading: boolean;
    selectedUser: string;
    selectedUserId: string;
    currentModalRef: any;
    totalRecords: number;
    blockedTable: boolean = false;
    msgs: Message[] = [];
    msgTimeSpan: number;
    pagerLength: any;
	globalFilter: string = "";
	paginationFilterClone: any = {};
	constructor( private confirmationService: ConfirmationService,
        private miscService: MiscellaneousService,  private accountService: AccountService, protected changeDetectorRef: ChangeDetectorRef) {
        //  this.spinner.show();

        this.msgTimeSpan = this.miscService.getMessageTimeSpan();
        this.pagerLength = this.miscService.getPagerLength();
    }

 //   openModal(content: any, userName: string, userId: string) {
         
 //       this.selectedUser = userName;
 //       this.selectedUserId = userId;
	//	this.currentModalRef = this.modalService.open(content, { size: 'sm' });	
		
	//}

    resetPasswordModel: ResetPasswordModel = {
        currentPassword: "",
        newPassword: "",
        emailId: "",
        userId: 0,
        encryptedUserId: "",
        confirmPassword: "",
        eventName: "resetPasswordByAdmin"

    };

	openModal(userName: string, userId: string) {
		this.selectedUserId = userId;
		this.confirmationService.confirm({
			message: "Do you want to reset the password for <b>" + userName+"</b>",
			accept: () => {
				this.resetPassword();
			}
		});
	}

    resetPassword() {
        this.loading = true;
        this.resetPasswordModel = {
            currentPassword: "",
            newPassword: "",
            emailId: "",
            userId: 0,
            encryptedUserId: this.selectedUserId,
            confirmPassword: "",
            eventName: "resetPasswordByAdmin"
        };
        this.accountService.resetPassword(this.resetPasswordModel)
            .subscribe(result => {
                let resp = result["body"];
                this.msgs= this.miscService.showAlertMessages(result.code == 'OK' ? 'success' : 'error', result.message);               
                this.loading = false;
            }, error => {
                this.accountService.redirectToLogin(error);                
                this.loading = false;
            });
    }
    
     
    getUserList(event: any) {
        if (event == null) {
            event = { first: 0, rows: 10, globalFilter: null, sortField: null, sortOrder: 1 };
        }
		this.paginationFilterClone = JSON.parse(JSON.stringify(event));
        this.blockedTable = true;
        this.accountService.getUserList({ paginationFilter:  event  }).subscribe(result => {
			let resp = result["body"];    
			if (resp != null && result.code == "OK") {
				this.users = resp.userList;
				this.totalRecords = resp.totalRecords;
			}
			else {
				this.users = [];
				this.totalRecords = 0;
			}
          
            this.blockedTable = false;
            
        }, error => {
           
            this.accountService.redirectToLogin(error);
            this.blockedTable = false;
        });
       

    }
    loadUsersLazy(event: LazyLoadEvent) {
        //in a real application, make a remote request to load data using state metadata from event
        //event.first = First row offset
        //event.rows = Number of rows per page
        //event.sortField = Field name to sort with
        //event.sortOrder = Sort order as number, 1 for asc and -1 for dec
        //filters: FilterMetadata object having field as key and filter value, filter matchMode as value
        
        this.getUserList(event);
        //imitate db connection over a network

        //setTimeout(() => {
        //    if (this.users  ) {
        //        this.users = this.users.slice(event.first, (event.first + event.rows));
        //    }
        //}, 250);
    }


    exportUserList() {
		let event = JSON.parse(JSON.stringify(this.paginationFilterClone));
		event.globalFilter = this.globalFilter;
		event.filterWithoutPaging = true;
        this.accountService.exportUserList({ paginationFilter: event }).subscribe(response => this.miscService.downloadExcelFile(response));
    }

    
}
interface ResetPasswordModel {
    encryptedUserId: string;
    userId: number;
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
    emailId: string;
    eventName: string;

}

