import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Message } from 'primeng/components/common/api';
import { MessageService } from 'primeng/components/common/messageservice';
import { AccountService } from '../../services/account.service';
import { MiscellaneousService } from '../../services/miscellaneous.service';
 


@Component({
    selector: 'register',
    templateUrl: './add-user.component.html',
    providers: [MessageService]
})


export class AddUserComponent implements OnInit {
    userForm: FormGroup;
    countryList: any[];
    groupList: any[];
    msgTimeSpan: number;
    id: any;
    msgs: Message[] = [];
	title: string = "Create";
	resetText: string = "Reset";
    userStatus: boolean = true;
    selectedUserList:any = {};
    model: any = { isActive: this.userStatus, groupDetails: [] };
    loading = false;
    constructor(
        private messageService: MessageService,   
        private accountService: AccountService, private _avRoute: ActivatedRoute, protected changeDetectorRef: ChangeDetectorRef, private miscService: MiscellaneousService) {
        if (this._avRoute.snapshot.params["id"]) {
			this.id = this._avRoute.snapshot.params["id"];
			if (this.id != undefined) {
				this.title = "Update";
				this.resetText = "Reload";
			}
			this.loading = true;
        }
        this.msgTimeSpan = this.miscService.getMessageTimeSpan();
    }
    sourceURL: any;
    ngOnInit() {
        this.sourceURL = this.miscService.GetPriviousPageUrl();
        //bind country dropdown list
        this.miscService.getCountryList().subscribe(result => {
			this.countryList = result["body"];
			this.setDefaultValues();
           
        }, error => {
            this.accountService.redirectToLogin(error);

        });
        //bind group dropdown list
        this.getGroupList();
         
	}

	setDefaultValues() {
		if (this.id != undefined) {
			this.loading = true;
			this.title = "Update";
			//get user details by user id
			this.accountService.getUserById({ Value: this.id })
				.subscribe(result => {
                    
					let resp = result["body"];// JSON.parse(result._body);
					//when No record found or something went wrong
					if (resp.length == 1) {
						if (resp[0].response != null && resp[0].response != "") {

							this.msgs = this.miscService.showAlertMessages('error', resp[0].response);
						}
					} else {
						resp.country = this.countryList.filter(function (element, index) { return element.countryId == resp.country.countryId; })[0];
						this.model = resp;
					}
					this.loading = false;

					this.setGroupList();
				}, error => {
					this.accountService.redirectToLogin(error);
					this.loading = false;

				});
		}
	}

    getGroupList() {
        
        this.miscService.getGroupList().subscribe(result => {
           console.log("As")
			this.groupList = this.miscService.sortArray(result["body"], "groupName"); 
            
        }, error => {
            this.accountService.redirectToLogin(error);

        });
    }
    setGroupList() {
       
        // To show options already selected in multiselect, creating a copy of userlist and replacing each element in the list which matches with any element in userGroup list.
        let groupListClone: any = [];
        this.groupList.forEach((n: any) => {
            let groupDetails = this.model.groupDetails.filter(function (ug: any) {
                return ug.groupName == n.groupName;
            });
            if (groupDetails.length > 0) {
                groupListClone.push(groupDetails[0]);
            }
            else {
                groupListClone.push(n);
            }
        });
        this.groupList = groupListClone;
    }

    saveUser(f: any) {
    
		this.loading = true;
        if (this.title == "Create") {
            this.accountService.addUser(this.model)
                .subscribe(
                data => {
                    if (data.code == "OK") {
                        this.formReset(f);
                    }  
					this.loading = false;
                   
                    this.msgs = this.miscService.showAlertMessages(data.code == 'OK' ? 'success' :'error', data.message);
                },
                error => {
                    this.msgs = this.miscService.showAlertMessages('error', error.message);
					this.loading = false;
                });
        }
        else if (this.title == "Update") {
            this.accountService.updateUser(this.model)
                .subscribe(
                data => {
					this.loading = false;
                    this.msgs = this.miscService.showAlertMessages(data.code == 'OK' ? 'success' : 'error', data.message);
                },
                error => {
                    this.msgs = this.miscService.showAlertMessages('error', error.message);
					this.loading = false;
                });
        }
    }

    formReset(f: any) {
        f.resetForm();
         this.changeDetectorRef.detectChanges();
        this.model = { isActive: true, groupDetails: [] }
		this.setDefaultValues();
    }
    
}
