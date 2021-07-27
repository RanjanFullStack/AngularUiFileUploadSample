import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Message } from 'primeng/components/common/api';
import { AccountService } from "../../services/account.service";
import { MiscellaneousService } from "../../services/miscellaneous.service";
import { FeaturesEnum } from "../../services/permission.service";

@Component({
	selector: 'user-details',
	templateUrl: './user-details.component.html'
})


export class UserDetailsComponent implements OnInit {
	feature: typeof FeaturesEnum = FeaturesEnum;
	id: any;
	model: any = {};
	loading = false;
	msgTimeSpan: any;
	msgs: Message[] = [];
	constructor(
		private accountService: AccountService, private _avRoute: ActivatedRoute, private miscService: MiscellaneousService) {
		if (this._avRoute.snapshot.params["id"]) {
			this.id = this._avRoute.snapshot.params["id"];
		}
	}
	ngOnInit() {
		try{
		if (this.id != undefined) {

			this.getUserDetails();

		}
	}catch{}
	}

	getUserDetails() {
		this.loading = true;
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
					this.model = resp;
				}
				this.loading = false;

			}, error => {
				this.accountService.redirectToLogin(error);
				this.loading = false;

			});
	}


}