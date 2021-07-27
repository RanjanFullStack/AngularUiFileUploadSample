import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { ConfirmationService, Message } from "primeng/components/common/api";
import { MessageService } from "primeng/components/common/messageservice";
import { TreeNode } from "primeng/components/common/treenode";
import { AccountService } from "../../services/account.service";
import { MiscellaneousService } from "../../services/miscellaneous.service";
import { PermissionService } from "../../services/permission.service";




@Component({
	selector: 'update-group',
	templateUrl: './add-group.component.html',
	providers: [MessageService, ConfirmationService]
})

export class AddGroupComponent implements OnInit {

    userForm: FormGroup;
    userList: any[];
    msgTimeSpan: number;
    id: any;
	title: string = "Create";
	resetText: string = "Reset";
    groupStatus: boolean = true;
    enableFeature: boolean = true;
    selectedFeatureList: TreeNode[];
    selectedFeaturesClone: any[];
    member: any = {};
    model: any = {
        isActive: this.groupStatus,
        userGroup: [],
        selectedFeatures: []
    };
    groupId: any = 0;
    featureList: TreeNode[];

	msgs: Message[] = [];
	successMessage: any = true;
	loading = false;
	cols: any[];
	selectedValues: string[] = [];
	selectedFeaturesReady: boolean;
	removeUserConfirmationMessage: string = 'Are you sure that you want to remove this user from group?';
	constructor(private router: Router,
		private confirmationService: ConfirmationService,
		private messageService: MessageService,
		private permissionService: PermissionService,
		private miscService: MiscellaneousService,
		private _avRoute: ActivatedRoute, protected changeDetectorRef: ChangeDetectorRef, private accountService: AccountService) {
		if (this._avRoute.snapshot.params["id"]) {
			this.id = this._avRoute.snapshot.params["id"];
			this.title = "Update";
			this.loading = true;
			this.groupId = this.id;
			this.resetText = "Reload";
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
    sourceURL: any;
    ngOnInit() {
        this.sourceURL = this.miscService.GetPriviousPageUrl();

		this.loading = true;
		this.accountService.getUserListForGroup({ paginationFilter: null }).subscribe(result => {

			this.userList = result["body"]["userList"];
			this.userList.forEach(n => (n.name = n.firstName + " " + n.lastName + " (" + n.emailID + ")"));
			this.setDefaultValues();

		}, error => {
			this.accountService.redirectToLogin(error);
			this.loading = false;
		});
		this.getFeatureList();


	}

	setDefaultValues() {
		if (this.id != undefined) {

			this.loading = true;
			this.title = "Update";
			// get group details by group id
			this.permissionService.getGroupById({ Value: this.id })
				.subscribe(result => {

					let resp = result["body"];
					if (resp != null && resp.groupID > 0) {

						resp.selectedFeatures=this.createHierarchicalFeatureSelection(resp.selectedFeatures, null);

						this.model = resp;
						this.model.userGroup.forEach((n: any) => (n.name = n.firstName + " " + n.lastName + " (" + n.emailID + ")"));
						var local = this;

						// To show options already selected in multiselect, creating a copy of userlist and replacing each element in the list which matches with any element in userGroup list.
						let userListClone: any = [];
						this.userList.forEach((n: any) => {
							let userGroups = local.model.userGroup.filter(function (ug: any) {
								return ug.name == n.name;
							});
							if (userGroups.length > 0) {
								userListClone.push(userGroups[0]);
							}
							else {
								userListClone.push(n);
							}
						});
						this.userList = userListClone;
						this.selectedFeatureList = resp.selectedFeatures;
						this.enableDisableFeatures();
					}
					else {
						this.msgs = this.miscService.showAlertMessages('error', resp.response);
					}
					this.loading = false;
					// this.model.userGroup = resp.userGroup;
				}, error => {
					this.accountService.redirectToLogin(error);
					this.loading = false;
				});
		} else {
			this.loading = false;
		}
	}

	createHierarchicalFeatureSelection(featureList:any,parentFeature:any) {
		let local = this;
        if (featureList != null) {
            featureList.forEach(function (value: any) {
                if (value.children != null && value.children.length > 0) {
                    value.children = local.createHierarchicalFeatureSelection(value.children, value);
                    featureList = featureList.concat(value.children);
                }
                value.parent = parentFeature;
            });
        }
		return featureList;
	}

	removeUsers(emailId: any) {
		this.confirmationService.confirm({
			message: this.removeUserConfirmationMessage,
			accept: () => {
				this.model.userGroup = this.model.userGroup.filter(function (ele: any) {
					return (ele.emailID != emailId);
				});
			}
		});
	}

	createHierarchicalFeature(featureList: any, parentFeature: any) {
		let local = this;
		if (featureList != null) {
			featureList.forEach(function (value: any) {
				if (value.children != null && value.children.length > 0) {
					value.children = local.createHierarchicalFeature(value.children, value);
					featureList = featureList.concat(value.children);
				}
				value.parent=null;
			});
		}
		return featureList;
	}

	includeParentInFeature(featureList: any, parentFeatureList: any) {
		
		//let local = this;
		//if (featureList != null) {

			
		//	featureList.forEach(function (ele: any) {
		//		if (ele.parent != null) {
		//			let parentIncluded = parentFeatureList.filter(function (parentEle: any) {
		//				return ele.parent.data.features.featureId == parentEle.data.features.featureId
		//			})
		//			if (parentIncluded.length > 0) {
		//				parentFeatureList.push(ele.parent);
		//			}
		//		}
		//		if (ele.children != null) {
		//			local.includeParentInFeature(ele.children, parentFeatureList);
		//		}
		//	})
		//}
		//return featureList;
	}

	saveGroup(f: any) {
		var local = this;


		let parents: any[] = [];
		if (local.model.selectedFeatures != null) {
			local.model.selectedFeatures.filter(function (eleSelected: any) {
				if (eleSelected.parent != null) {
					let selection = local.model.selectedFeatures.filter(function (ele1: any) {
						return eleSelected.parent.data.features.featureId == ele1.data.features.featureId;
					})
					if (selection.length <= 0) {
						parents.push(eleSelected.parent);
					}
				}
			});
		}


		let selectedFearureList = this.serializeFeatureList(this.createHierarchicalFeature(this.featureList, null));
		

		let mainselectedFearureList = selectedFearureList.filter(function (ele: any) {
			if (local.model.selectedFeatures != null) {
				var selectedFeatures = local.model.selectedFeatures.filter(function (eleSelected: any) {
					if (eleSelected.data.features.featureId == ele.data.features.featureId) {
						return true;
					}
					//else if (eleSelected.parent != null && eleSelected.parent.data.features.featureId == ele.data.features.featureId) {
					//	ele.data.featureEnabled = true;
					//	ele.children = null;
					//	return true;
					//}
					return false;
					
				});				
				return selectedFeatures.length > 0;
			}
		});

		let parentselectedFearureList :any[]= []
		//mainselectedFearureList=	selectedFearureList.filter(function (ele: any) {
		//	if (local.model.selectedFeatures != null) {
		//		var selectedFeatures = parents.filter(function (eleSelected: any) {

		//			eleSelected.children.filter(function (child: any) {
		//				mainselectedFearureList.filter(function (child1: any) {
		//					return child1.data.features.featureId == child.data.features.featureId
		//				})
		//			})
		//			return eleSelected.data.features.featureId == ele.data.features.featureId;
		//		});
		//		return selectedFeatures.length > 0;
		//	}
		//});



		selectedFearureList = mainselectedFearureList.concat(parentselectedFearureList);

		this.model.selectedFeatures = [];
		let modelClone = JSON.parse(JSON.stringify(this.model));
		this.model.selectedFeatures = selectedFearureList;

		modelClone.selectedFeatures = this.serializeFeatureList(this.model.selectedFeatures);

		this.loading = true;
        if (this.title == "Create") {
			this.permissionService.addGroup(modelClone)
				.subscribe(
					data => {
						if (data.code == "OK") {
							this.formReset(f);
						}
						this.loading = false;

						this.msgs = this.miscService.showAlertMessages(data.code == 'OK' ? 'success' : 'error', data.message);
					},
					error => {

						this.msgs = this.miscService.showAlertMessages('error', error.message);
						this.loading = false;
					});
		}
		else if (this.title == "Update") {
			this.permissionService.updateGroup(modelClone)
				.subscribe(
					data => {
						this.loading = false;
						this.formReset(f);
						this.msgs = this.miscService.showAlertMessages(data.code == 'OK' ? 'success' : 'error', data.message);

					},
					error => {
						this.msgs = this.miscService.showAlertMessages('error', error.message);
						this.loading = false;
					});
		}
	}


	getFeatureList() {
		this.permissionService.getFeatureList({ Value: this.groupId == undefined ? 0 : this.groupId }).subscribe(result => {

			this.featureList = result["body"];
			this.enableDisableFeatures();
		}, error => {
			this.accountService.redirectToLogin(error);
		});
	}

	enableDisableFeatures() {
		var local = this;
		if (this.model.selectedFeatures != null && this.featureList != null && this.model.selectedFeatures.length > 0 && this.featureList.length > 0) {
			//this.featureList = this.featureList.filter(function (ele: any) {

			//	let selected = local.model.selectedFeatures.filter(function (eleSelected: any) {
			//		return eleSelected.data.features.featureId == ele.data.features.featureId;
			//	});
			//	if (selected.length > 0) {
			//		ele.data.featureEnabled = true;
			//	}
			//	else if (ele.children != null && ele.children.length > 0) {

			//	}
			//	return ele;
			//});
			this.featureList=this.enableDisableMainFeatureList(this.featureList);

			this.model.selectedFeatures = this.model.selectedFeatures.filter(function (eleSelected: any) {				
				//let features = local.featureList.filter(function (ele: any) {
				//	return eleSelected.data.features.featureId == ele.data.features.featureId;
				//});
				//if (features.length > 0) {
				//	eleSelected.data.featureEnabled = true;
				//}
				if (local.checkMatchedFeatureInHierarchy(local.featureList, eleSelected)) {
					eleSelected.data.featureEnabled = true;
				}
				return eleSelected;
			});

		}
	}

	enableDisableMainFeatureList(featureList:any) {
		var local = this;		
			featureList = featureList.filter(function (ele: any) {

				let selected = local.model.selectedFeatures.filter(function (eleSelected: any) {
					return eleSelected.data.features.featureId == ele.data.features.featureId;
				});
				if (selected.length > 0) {
					ele.data.featureEnabled = true;
				}
				if (ele.children != null && ele.children.length > 0) {
					ele.children = local.enableDisableMainFeatureList(ele.children)
				}
				return ele;
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

	checkMatchedFeatureInHierarchy(featureList: any,featureSelected:any) {
		var local = this;
		let result:boolean = false;
		let features: any = featureList.filter(function (ele: any) {
			let matched = featureSelected.data.features.featureId == ele.data.features.featureId;
			if (!matched && ele.children != null && ele.children.length > 0) {
				matched = local.checkMatchedFeatureInHierarchy(ele.children, featureSelected);
				if (matched && featureSelected.parent==null) {
					featureSelected.parent = ele;
					featureSelected.parent.partialSelected = true;
				}
			}
			return matched;
		});
		result = features.length > 0;
		return result;
	}

	onSelectFeature(rowData: any) {
		var local = this;
		if (rowData.data != undefined) {
			let selectedFeature = this.model.selectedFeatures.filter(function (ele: any) {
				return ele.data.features.featureId == rowData.features.featureId;
			});

			if (selectedFeature.length > 0) {
				selectedFeature[0].data.canAdd = selectedFeature[0].data.canEdit = selectedFeature[0].data.canView = selectedFeature[0].data.canExport = selectedFeature[0].data.canImport = true;
			} else {
				rowData.canAdd = rowData.canEdit = rowData.canView = rowData.canExport = rowData.canImport = false;
			}
		} else {
			if (this.model.selectedFeatures.length > 0) {
				let mainSelectedFeatures = this.model.selectedFeatures.filter(function (ele: any) {
					return ele.parent == null;
				});
				
				if (mainSelectedFeatures.length == this.featureList.length) {
					this.model.selectedFeatures = this.model.selectedFeatures.filter(function (ele: any) {
						if (local.selectedFeaturesClone == undefined || local.selectedFeaturesClone == null) {
							ele.data.featureEnabled = ele.data.canAdd = ele.data.canEdit = ele.data.canView = ele.data.canExport = ele.data.canImport = true;
							return ele;
						}
						else {
							var alreadySelected = local.selectedFeaturesClone.filter(function (eleClone: any) {
								return eleClone.data.features.featureId == ele.data.features.featureId;
							});
							if (alreadySelected.length <= 0) {
								ele.data.featureEnabled = ele.data.canAdd = ele.data.canEdit = ele.data.canView = ele.data.canExport = ele.data.canImport = true;
								return ele;
							}
							else {
								return ele;
							}
						}
					});
				}
				else {

					let selectedFeature = this.model.selectedFeatures.filter(function (ele: any) {
						return ele.data.features.featureId == rowData.features.featureId;
					});

					this.selectAllActionsInFeatures(selectedFeature);
					this.unSelectAllActionsInFeatures(this.featureList);

				}
			}
			else {
				this.uncheckAllActionsInFeatures(this.featureList);
			}
		}
		//this.model.selectedFeatures = this.selectedFeatureList;
		this.selectedFeaturesClone = this.serializeFeatureList(this.model.selectedFeatures);
	}

	unSelectAllActionsInFeatures(featureList: any) {
		let local = this;
		let unselectedFeatures = featureList.filter(function (ele: any) {
			if (ele.children != null && ele.children.length > 0) {
				local.unSelectAllActionsInFeatures(ele.children);
			}
			let unselected = local.model.selectedFeatures.filter(function (sEle: any) {
				return sEle.data.features.featureId == ele.data.features.featureId;
			});
			return (unselected.length <= 0);
		});

		unselectedFeatures.forEach(function (value: any) {
			value.data.featureEnabled = value.data.canAdd = value.data.canEdit = value.data.canView = value.data.canExport = value.data.canImport = null;
		});
	}

	uncheckAllActionsInFeatures(featureList: any) {
		let local = this;
		featureList.forEach(function (value: any) {
			value.data.featureEnabled = value.data.canAdd = value.data.canEdit = value.data.canView = value.data.canExport = value.data.canImport = null;
			if (value.children != null && value.children.length > 0) {
				local.uncheckAllActionsInFeatures(value.children);
			}
		});
	}

	selectAllActionsInFeatures(featureList: any) {
		let local = this;
		featureList.forEach(function (value: any) {
			value.data.featureEnabled = value.data.canAdd = value.data.canEdit = value.data.canView = value.data.canExport = value.data.canImport = true;
			if (value.children != null && value.children.length > 0) {
				local.selectAllActionsInFeatures(value.children);
			}
		});
	}



	serializeFeatureList(featureList: any) {
		let local = this;

		let result: any = [];
		featureList.forEach(function (value: any) {
			let res: any = {}
			res.data = JSON.parse(JSON.stringify(value.data));
			if (value.children != null && value.children.length > 0) {
				res.children = local.serializeFeatureList(value.children);
			}
			else {
				res.children = null;
			}
			result.push(res);
		});
		return result;
	}


	formReset(f: any) {
		
		f.resetForm();
		
		this.member = {};
		this.member.userData = ["undefined"];
		this.model = {
			isActive: this.groupStatus,
			userGroup: []
		};
		this.featureList = [];
		this.getFeatureList();
		this.changeDetectorRef.detectChanges();
		this.setDefaultValues();
		
	}

}

