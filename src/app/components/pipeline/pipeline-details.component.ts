import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { AccountService } from "../../services/account.service";
import { FeaturesEnum } from "../../services/permission.service";
import { PipelineService } from "../../services/pipeline.service";


@Component({
	selector: 'pipeline-details',
	templateUrl: './pipeline-details.component.html'
})


export class PipelineDetailsComponent implements OnInit {
	feature: typeof FeaturesEnum = FeaturesEnum;	
	id: any;	
	model: any = {};	
	loading = false;	
	msgTimeSpan: any;
	constructor(
		private accountService: AccountService,  private _pipelineService: PipelineService,
		 private _avRoute: ActivatedRoute) {
		if (this._avRoute.snapshot.params["id"]) {
			this.id = this._avRoute.snapshot.params["id"];
		}
	}
	ngOnInit() {
		if (this.id != undefined) {

			this.getPipelineDetails();

		}
	}

	getPipelineDetails() {
		this.loading = true;
		//get user details by user id
		this._pipelineService.getPipelineById({ Value: this.id })
			.subscribe(result => {

				let resp = result["body"];

				this.model = resp;
				//}
				this.loading = false;

			}, error => {
				this.accountService.redirectToLogin(error);
				this.loading = false;

			});
	}
	

}