import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Message } from "primeng/components/common/api";
import { TreeNode } from "primeng/components/common/treenode";
import { AccountService } from "../../services/account.service";
import { MiscellaneousService } from "../../services/miscellaneous.service";
import { FeaturesEnum, PermissionService } from "../../services/permission.service";



@Component({
	selector: 'group-details',
	templateUrl: './group-details.component.html',
})


export class GroupDetailsComponent implements OnInit {
	feature: typeof FeaturesEnum = FeaturesEnum;
	msgs: Message[] = [];
	userList: any[];
	msgTimeSpan: number;
	id: any;
	selectedFeatureList: TreeNode[];
	model: any = {
		isActive: true,
		userGroup: [],
		selectedFeatures: []
	};
	successMessage: any = true;
	loading = false;
	cols: any[];
	featureList: TreeNode[];


	constructor(
		private permissionService: PermissionService,
		private miscService: MiscellaneousService,
		private _avRoute: ActivatedRoute, protected changeDetectorRef: ChangeDetectorRef, private accountService: AccountService) {
		if (this._avRoute.snapshot.params["id"]) {
			this.id = this._avRoute.snapshot.params["id"];
		}
		this.msgTimeSpan = this.miscService.getMessageTimeSpan();
		this.cols = [
			{ field: 'feature', header: 'Features' },
			{ field: 'canAdd', header: 'Add' },
			{ field: 'canEdit', header: 'Edit' },
			{ field: 'canView', header: 'View' },
			{ field: 'canExport', header: 'Export' },
			{ field: 'canImport', header: 'Import' }
		];
	}
	ngOnInit() {
		if (this.id != undefined) {

			this.getGroupDetails();

		}
	}

	getGroupDetails() {
		if (this.id != undefined) {

			this.loading = true;
			// get group details by group id
			this.permissionService.getGroupById({ Value: this.id })
				.subscribe(result => {

					let resp = result["body"];
					if (resp != null && resp.groupID > 0) {
						this.model = resp;
						this.model.userGroup.forEach((n: any) => (n.name = n.firstName + " " + n.lastName + " (" + n.emailID + ")"));
						var local = this;

						this.selectedFeatureList = resp.selectedFeatures;
					}
					else {
						this.msgs = this.miscService.showAlertMessages('error', resp.response);
					}
					this.loading = false;
				}, error => {
					this.accountService.redirectToLogin(error);
					this.loading = false;
				});
		} else {
			this.loading = false;
		}
	}

	createHierarchicalFeatureSelection(featureList: any, parentFeature: any) {
		let local = this;

		featureList.forEach(function (value: any) {
			if (value.children != null && value.children.length > 0) {
				value.children = local.createHierarchicalFeatureSelection(value.children, value);
				featureList = featureList.concat(value.children);
			}
			value.parent = parentFeature;
		});
		return featureList;
	}
	isActionHidden(feature: any, action: any) {
		let availableActions = feature.enabledActions.filter(function (val: any) {
			return val.action == action;
		});
		if (availableActions.length > 0) {
			return false;
		}
		else {
			return true;
		}
	}
}