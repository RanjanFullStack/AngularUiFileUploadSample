import { OnInit, Component, ChangeDetectorRef, Input, forwardRef, ViewChild } from "@angular/core";
import { FundService } from "../../services/funds.service";
import { AccountService } from "../../services/account.service";
import { Router, ActivatedRoute } from "@angular/router";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NgForm } from "@angular/forms";
import { Output } from "@angular/core";
import { EventEmitter } from "@angular/core";
 
import { Message } from "primeng/components/common/api";
import { MessageService } from "primeng/components/common/messageservice";
import { MiscellaneousService } from "../../services/miscellaneous.service";

@Component({
	selector: 'savefundTrackRecord',
	templateUrl: './fund-trackRecord.component.html',
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => AddFundTrackRecordComponent),
			multi: true
		},MessageService]
})


export class AddFundTrackRecordComponent implements OnInit, ControlValueAccessor {
	//employeeForm: FormGroup;
	//model: FundDetails;
	@Input() trackRecordList: any = {};
	@Output() onSave = new EventEmitter<any>();
	saveText: string = "Create";
	resetText: string = "Reset";
	id: string;
	msgs: Message[] = [];
	@ViewChild('f') userFrm: NgForm;
    loading: boolean = false;
    yearOptions: any = [];
	quarterOptions: any = [{ value: "Q1", text: "Q1" }, { value: "Q2", text: "Q2" }, { value: "Q3", text: "Q3" }, { value: "Q4", text: "Q4" }]
	msgTimeSpan: number;
	private _model: any = {};
	modelClone: any = {};

	get model(): any {
		// transform value for display
		return this._model;
	}

	@Input()
	set model(model: any) {
		this._model = model;
		this.modelClone = JSON.parse(JSON.stringify(this.model));
		if (model.encryptedFundTrackRecordId != "" && model.encryptedFundTrackRecordId != null ) {
			this.saveText = "Update"
			this.resetText = "Reload";
			this.validateSelectedQuarter();
		}
	}

	constructor(private _avRoute: ActivatedRoute, public activeModal: NgbActiveModal, private miscService: MiscellaneousService, private messageService: MessageService,
		private _fundService: FundService, protected changeDetectorRef: ChangeDetectorRef) {
		if (this._avRoute.snapshot.params["id"]) {
			this.id = this._avRoute.snapshot.params["id"];
		}
        this.msgTimeSpan = this.miscService.getMessageTimeSpan();
        this.yearOptions = this.miscService.bindYearList();
	}

	ngOnInit() { }

	onInvestmentCostChange() {
		this.calculateGrossMultiple();
	}

	onRealizedValueChange() {
		this.calculateTotalValue();
	}

	onUnRealizedValueChange() {
		this.calculateTotalValue();
	}



	calculateGrossMultiple() {
		if (this.model.totalValue != null && this.model.totalInvestedCost != null && this.model.totalInvestedCost > 0) {
			this.model.grossMultiple = this.model.totalValue / this.model.totalInvestedCost;			
		}
	}

	calculateTotalValue() {
		if (this.hasValueInNumber(this.model.totalRealizedValue) && this.hasValueInNumber(this.model.totalUnRealizedValue)) {
			this.model.totalValue = parseFloat(this.model.totalRealizedValue) + parseFloat(this.model.totalUnRealizedValue);
			this.calculateGrossMultiple();
		}
	}

	calculateRealizedValue() {
		if (this.hasValueInNumber(this.model.totalValue) && this.hasValueInNumber(this.model.totalUnRealizedValue)) {
			this.model.realizedValue = this.model.totalValue - this.model.totalUnRealizedValue;
		}
	}

	calculateUnRealizedValue() {
		if (this.hasValueInNumber(this.model.totalValue) && this.hasValueInNumber(this.model.totalRealizedValue)) {
			this.model.unrealizedValue = this.model.totalValue - this.model.totalRealizedValue;
		}
	}

	hasValueInNumber(val: any) {
		if (val != null && val != undefined && val !== "") {
			return true;
		}
		return false;
	}

	validateSelectedQuarter() {

		if (this.model.quarter != null && this.model.quarter != "" && this.model.year != undefined && this.model.year != null && this.model.year.toString().length == 4) {
			let quarterDate = this.miscService.getQuarterLastDateByQuarter(this.model.quarter, this.model.year);

			let currentQuarter = this.miscService.getQuarterLastDate(new Date());

			if (currentQuarter < quarterDate) {
				this.model.valuationDate = undefined;
				this.miscService.showInlineMessage(this.messageService, 'error', "Selected quarter should not be greater than current quarter.");
				return;
			}

			this.model.valuationDate = quarterDate;
			this.messageService.clear();

		}

	}


	save(form: any) {
		if (this.model.valuationDate == undefined) {
			this.miscService.showInlineMessage(this.messageService, 'error', "Please select valid year and quarter.");
			return;
		}

		var localModel = this.model;
		var matchingRecords = this.trackRecordList.filter(function (element: any, index: any) { return element.quarter == localModel.quarter && element.year == localModel.year && (element.encryptedFundTrackRecordId != localModel.encryptedFundTrackRecordId); });
		if (matchingRecords != null && matchingRecords.length > 0) {
			this.miscService.showInlineMessage(this.messageService, 'error', "The year and quarter pair already exist for this fund");
			return;
		}
		this.messageService.clear();
		this.loading = true;
		console.log(this.model)
		this._fundService.saveFundTrackRecord(this.model)
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
		f.resetForm();
		this.messageService.clear();
		this.changeDetectorRef.detectChanges();
		setTimeout(function (local: any) {
			local.model = JSON.parse(JSON.stringify(local.modelClone));
		}, 0, this)

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

