import { ChangeDetectorRef, Component, EventEmitter, forwardRef, Input, OnInit, Output } from "@angular/core";
import { ControlValueAccessor, FormControl, NgForm, NG_VALUE_ACCESSOR } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { ConfirmationService, Message, MessageService } from "primeng/api";
import { AccountService } from "../../services/account.service";
import { MiscellaneousService } from "../../services/miscellaneous.service";
import { PortfolioCompanyService } from "../../services/portfolioCompany.service";

@Component({
	selector: 'savePortfolioProfitability',
	templateUrl: './portfolioCompany-operationalKPI.component.html',
	providers: [MessageService, ConfirmationService,
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => SavePortfolioOperationalKPIComponent),
			multi: true
		}]
})


export class SavePortfolioOperationalKPIComponent implements OnInit, ControlValueAccessor {

	@Input() sectorwiseOperationalKPIList: any[] = [];
	@Input() companyOperationalKPIList: any[] = [];
	operationalKPIValues: any[] = [];
	@Output() onSave = new EventEmitter<any>();
	saveText: string = "Create";
	resetText: string = "Reset";
	id: string;
	msgTimeSpan: number;
	loading: boolean = false;
	yearOptions: any = [];
	quarterOptions: any = [{ value: "Q1", text: "Q1" }, { value: "Q2", text: "Q2" }, { value: "Q3", text: "Q3" }, { value: "Q4", text: "Q4" }]
	deleteConfirmationMessage: string = 'Are you sure that you want to remove this KPI value for the selected quarter?';
	modelClone: any = {};
	kpiValueModel: any = { kpiInfo:""};
	kpiModel: any = { portfolioCompanyOperationalKPIValues: [] };
	sectorwiseOperationalKPIListEdit: any[];
	sectorwiseOperationalKPIListNew: any[];
	kpiModelClone: any = {};
	message: Message[] = [];

	get model(): any {
		// transform value for display
		return this.kpiModel;
	}

	@Input()
	set model(model: any) {
		
		this.kpiModel = JSON.parse(JSON.stringify(model));
		this.kpiModelClone = JSON.parse(JSON.stringify(model));
		if (model.portfolioCompanyOperationalKPIQuarterID > 0) {
			this.saveText = "Update"
			this.resetText = "Reload";
			this.validateSelectedQuarter();
		}
		else {
			this.kpiModel.portfolioCompanyOperationalKPIValues = [];
		}
		this.filterNewOperationalKPIList();
	}

	constructor(private _avRoute: ActivatedRoute, public activeModal: NgbActiveModal, private miscService: MiscellaneousService, private messageService: MessageService, private confirmationService: ConfirmationService,
		private _portfolioCompanyService: PortfolioCompanyService, protected changeDetectorRef: ChangeDetectorRef, private accountService: AccountService) {
		if (this._avRoute.snapshot.params["id"]) {
			this.id = this._avRoute.snapshot.params["id"];
		}
		this.msgTimeSpan = this.miscService.getMessageTimeSpan();
		this.yearOptions = this.miscService.bindYearList();
	}

	ngOnInit() {
	}

	validateSelectedQuarter() {

		if (this.kpiModel.quarter != null && this.kpiModel.quarter != "" && this.kpiModel.year != undefined && this.kpiModel.year != null && this.kpiModel.year.toString().length == 4) {
			let quarterDate = this.miscService.getQuarterLastDateByQuarter(this.kpiModel.quarter, this.kpiModel.year);

			let currentQuarter = this.miscService.getQuarterLastDate(new Date());

			if (currentQuarter < quarterDate) {
				this.kpiModel.valuationDate = undefined;
				this.miscService.showInlineMessage(this.messageService, 'error', "Selected quarter should not be greater than current quarter.");
				return;
			}

			this.kpiModel.valuationDate = quarterDate;
			this.messageService.clear();

		}
	}

	save(form: NgForm) {
		let local = this;
		if (this.kpiModel.valuationDate == undefined) {
			this.miscService.showInlineMessage(this.messageService, 'error', "Please select valid year and quarter.");
			return;
		}

		let valuesInEditMode = local.kpiModel.portfolioCompanyOperationalKPIValues.filter(function (val2: any) {
			return val2.isEditMode == true
		});
		if (valuesInEditMode.length > 0) {
			this.miscService.showInlineMessage(this.messageService, 'error', "You are in between editing a KPI value. So please complete editing that row then try again.");
			return;
		}

		if (local.kpiModel.portfolioCompanyOperationalKPIValues && local.kpiModel.portfolioCompanyOperationalKPIValues.length <= 0) {
			this.miscService.showInlineMessage(this.messageService, 'error', "Please add a KPI value for this quarter and try again.");
			return;
		}

		if (form) {
			for (var eachControl in form.form.controls) {
				(<FormControl>form.form.controls[eachControl]).markAsDirty();
			}
		}
		if (form.invalid) {
			return;
		}
		var localModel = this.model;
		if (this.companyOperationalKPIList) {
			var matchingRecords = this.companyOperationalKPIList.filter(function (element: any, index: any) { return element.quarter == localModel.quarter && element.year == localModel.year && (element.portfolioCompanyOperationalKPIQuarterID != localModel.portfolioCompanyOperationalKPIQuarterID); });
			if (matchingRecords != null && matchingRecords.length > 0) {
				this.miscService.showInlineMessage(this.messageService, 'error', "The KPI values already exist for this year and quarter pair");
				return;
			}
		}
		this.messageService.clear();
		this.loading = true;
		this._portfolioCompanyService.SavePortfolioCompanyOperationalKPIValue(this.kpiModel)
			.subscribe((data) => {
				if (data.code == "OK") {
					this.onSave.emit(data);
					this.formReset(form);
				}
				else {

					this.miscService.showInlineMessage(this.messageService, 'error', data.message);
				}
				this.loading = false;
			}, error => {
				this.miscService.showInlineMessage(this.messageService, 'error', error);
				this.loading = false;
			})
	}

	formReset(f: any) {
		
		f.reset();
		this.messageService.clear();
		//this.changeDetectorRef.detectChanges();
		setTimeout(function (local: any) {
			if (!local.kpiModelClone.portfolioCompanyOperationalKPIValues) {
				local.kpiModelClone.portfolioCompanyOperationalKPIValues = [];
			}
			local.kpiModel = JSON.parse(JSON.stringify(local.kpiModelClone));
			//local.model = JSON.parse(JSON.stringify(local.modelClone));
		}, 0, this)
		this.kpiValueModel = { kpiInfo:""};
	}

	addOperationalKPIValue(f: NgForm) {
		if (f) {
			for (var eachControl in f.form.controls) {
				(<FormControl>f.form.controls[eachControl]).markAsDirty();
			}
		}
		if (f.invalid) {
			return;
		}
		let copy = JSON.parse(JSON.stringify(this.kpiValueModel));
		//copy.clone = JSON.parse(JSON.stringify(this.kpiValueModel));
		this.kpiModel.portfolioCompanyOperationalKPIValues.push(copy);
		this.clearOperationalKPIValue(f);
		this.filterNewOperationalKPIList();
	}

	clearOperationalKPIValue(f: NgForm) {
		f.reset();
		this.kpiValueModel = { kpiInfo: "" };
	}

	updateKPIValue(value: any) {
		if (value.clone.sectorwiseOperationalKPI == null || value.clone.sectorwiseOperationalKPI == undefined || value.clone.kpiValue == null || value.clone.kpiValue === "" || value.clone.kpiValue == undefined) {
			this.miscService.showInlineMessage(this.messageService, 'error', "Please fill all the required fields.");
			return;
		}
		//this.changeDetectorRef.detectChanges();
		let copy = JSON.parse(JSON.stringify(value.clone));
		copy.clone = JSON.parse(JSON.stringify(value.clone));
		let index = this.kpiModel.portfolioCompanyOperationalKPIValues.indexOf(value);
		this.kpiModel.portfolioCompanyOperationalKPIValues[index] = copy;
		this.kpiModel.portfolioCompanyOperationalKPIValues[index].isEditMode = false;
		this.filterNewOperationalKPIList();
	}
	cancelEditKPIValue(value: any) {
		let copy = JSON.parse(JSON.stringify(value));
		copy.clone = undefined;
		value.clone = copy;
		value.isEditMode = false;
	}
	removeKPIValue(value: any) {
		this.confirmationService.confirm({
			message: this.deleteConfirmationMessage,
			accept: () => {
				let index = this.kpiModel.portfolioCompanyOperationalKPIValues.indexOf(value);
				this.kpiModel.portfolioCompanyOperationalKPIValues.splice(index, 1);
			}
		});
	}
	
	editKPIValue(value: any) {
		let local = this;

		let valuesInEditMode=  local.kpiModel.portfolioCompanyOperationalKPIValues.filter(function (val2: any) {
			return val2.isEditMode == true
		});
		if (valuesInEditMode.length > 0) {
			this.miscService.showInlineMessage(this.messageService, 'warn', "There is another KPI value row in edit mode. So please complete editing that row then try again.");
			return;
		}

		value.clone = JSON.parse(JSON.stringify(value));
		value.clone.clone = undefined;
		this.sectorwiseOperationalKPIListEdit = this.sectorwiseOperationalKPIList.filter(function (val1: any) {
			let existingValues = local.kpiModel.portfolioCompanyOperationalKPIValues.filter(function (val2: any) {
				return val1.sectorwiseKPIID == val2.sectorwiseOperationalKPI.sectorwiseKPIID;
			});
			return existingValues.length <= 0 || val1.sectorwiseKPIID == value.sectorwiseOperationalKPI.sectorwiseKPIID;
		});
		value.isEditMode = true;

	}

	filterNewOperationalKPIList() {
		let local = this;
		this.sectorwiseOperationalKPIListNew = this.sectorwiseOperationalKPIList.filter(function (val1: any) {
			let existingValues = local.kpiModel.portfolioCompanyOperationalKPIValues.filter(function (val2: any) {
				return val1.sectorwiseKPIID == val2.sectorwiseOperationalKPI.sectorwiseKPIID;
			});
			return existingValues.length <= 0;
		});
	}

	

	writeValue(value: any) {
		if (value !== undefined && value != null) {
			this.model = value;
		}
	}

	propagateChange = (_: any) => { };

	registerOnChange(fn: any) {
		this.propagateChange = fn;
	}

	registerOnTouched() { }

}