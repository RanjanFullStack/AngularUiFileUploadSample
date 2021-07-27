import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { Message } from 'primeng/components/common/api';
import { MessageService } from 'primeng/components/common/messageservice';
import { AccountService } from '../../services/account.service';
import { FirmService } from '../../services/firm.service';
//import { FetchEmployeeComponent } from '../funds/funds.component';
import { FundService } from '../../services/funds.service';
import { MiscellaneousService } from '../../services/miscellaneous.service';
import { NgbDateParserFormatter_uk } from '../../shared/NgbDateParserFormatter_uk';


@Component({
	selector: 'createfund',
	templateUrl: './add-funds.component.html',
	providers: [{ provide: NgbDateParserFormatter, useClass: NgbDateParserFormatter_uk }, MessageService]

})


export class AddFundComponent implements OnInit {

	model: any = {};
	title: string = "Create";
	resetText: string = "Reset";
	id: string;
	masterModel: any = {};
	geographyModel: any;
	msgTimeSpan: number;
	loading: boolean;
	datemodel: NgbDateStruct;
	msgs: Message[] = [];
	masterDataLoadRequired: boolean = true;
	yearOptions: any = [];
	clawbackOptions: any = [{ value: "Yes", text: "Yes" }, { value: "No", text: "No" }]
	regionListClone: any[] = [];
	countryListClone: any[] = [];

	constructor(private _avRoute: ActivatedRoute, private miscService: MiscellaneousService, private firmService: FirmService, private messageService: MessageService,
		private _fundService: FundService, private _router: Router, protected changeDetectorRef: ChangeDetectorRef, private accountService: AccountService) {
		if (this._avRoute.snapshot.params["id"]) {
			this.id = this._avRoute.snapshot.params["id"];
			this.loading = true;
			this.title = "Update";
			this.resetText = "Reload";
		}
		this.msgTimeSpan = this.miscService.getMessageTimeSpan();
		this.yearOptions = this.miscService.bindYearList();
	}
	sourceURL: any;
	ngOnInit() {
		this.sourceURL = this.miscService.GetPriviousPageUrl();
		this.setDefaultValues();
	}

	setDefaultValues() {
		if (this.id != undefined) {
			this.loading = true;
			this.title = "Update";
			this._fundService.getFundById({ EncryptedFundId: this.id, PaginationFilter: null })
				.subscribe(result => {
					let resp = result["body"];
					if (resp != null && result.code == "OK") {
						this.model = resp.fundList[0];

						this.model.fundClosingDate = new Date(this.model.fundClosingDate);

						if (this.masterDataLoadRequired) {
							this.getMasterFundModel();

						}
					}
					else {
						if (resp.status != null && resp.status.message != "") {

							this.msgs = this.miscService.showAlertMessages('error', resp.status.message);
						}
					}
					//when No record found or something went wrong						
					this.loading = false;
				}, error => {
					this.accountService.redirectToLogin(error);
					this.loading = false;
				});
		}
		else {
			this.model = {};
			setTimeout(function (local: any) {
				local.model.geographyDetail = {};
			}, 10, this);

			if (this.masterDataLoadRequired) {
				this.getMasterFundModel();

			}
		}
	}

	getMasterFundModel() {
		this.firmLoading = true;
		this.accountTypeLoading = true;
		this.strategyLoading = true;
		this.sectorLoading = true;
		this.currencyLoading = true;
		this.countryLoading = true;
		this.regionLoading = true;
		this._fundService.getMasterFundModel().subscribe(result => {

			let resp = result["body"];// JSON.parse(result._body);
			if (resp != null) {
				let localModel = this.model;

				this.masterModel.firmList = resp.firmList;
				if (this.model.firmDetail != null && this.model.firmDetail.firmID > 0) {
					this.model.firmDetail = this.masterModel.firmList.filter(function (element: any, index: any) { return element.firmID == localModel.firmDetail.firmID; })[0];
				}

				this.masterModel.accountTypeList = resp.accountTypeList;
				if (this.model.accountTypeDetail != null && this.model.accountTypeDetail.accountTypeID > 0) {
					this.model.accountTypeDetail = this.masterModel.accountTypeList.filter(function (element: any, index: any) { return element.accountTypeID == localModel.accountTypeDetail.accountTypeID; })[0];
				}

				this.masterModel.strategyList = resp.strategyList;
				if (this.model.strategyDetail != null && this.model.strategyDetail.strategyID > 0) {
					this.model.strategyDetail = this.masterModel.strategyList.filter(function (element: any, index: any) { return element.strategyID == localModel.strategyDetail.strategyID; })[0];
				}

				this.masterModel.sectorList = resp.sectorList;
				if (this.model.sectorDetail != null && this.model.sectorDetail.sectorID > 0) {
					this.model.sectorDetail = this.masterModel.sectorList.filter(function (element: any, index: any) { return element.sectorID == localModel.sectorDetail.sectorID; })[0];
				}

				this.masterModel.currencyList = resp.currencyList;
				if (this.model.currencyDetail != null && this.model.currencyDetail.currencyID > 0) {
					this.model.currencyDetail = this.masterModel.currencyList.filter(function (element: any, index: any) { return element.currencyID == localModel.currencyDetail.currencyID; })[0];
				}

				this.masterModel.countryList = resp.countryList;
				this.countryListClone = JSON.parse(JSON.stringify(resp.countryList));
				if (this.model.geographyDetail != null && this.model.geographyDetail.country != null && this.model.geographyDetail.country.countryId > 0) {
					this.model.geographyDetail.country = this.masterModel.countryList.filter(function (element: any, index: any) { return element.countryId == localModel.geographyDetail.country.countryId; })[0];

				}

				this.masterModel.regionList = resp.regionList;
				this.regionListClone = JSON.parse(JSON.stringify(resp.regionList));
				if (this.model.geographyDetail != null && this.model.geographyDetail.region != null && this.model.geographyDetail.region.regionId > 0) {
					this.model.geographyDetail.region = this.masterModel.regionList.filter(function (element: any, index: any) { return element.regionId == localModel.geographyDetail.region.regionId; })[0];
				}
			}

			this.firmLoading = false;
			this.accountTypeLoading = false;
			this.strategyLoading = false;
			this.sectorLoading = false;
			this.currencyLoading = false;
			this.countryLoading = false;
			this.regionLoading = false;
		}, error => {
			this.firmLoading = true;
			this.accountTypeLoading = true;
			this.strategyLoading = true;
			this.sectorLoading = true;
			this.currencyLoading = true;
			this.countryLoading = true;
			this.regionLoading = true;

			this.accountService.redirectToLogin(error);

		});
	}

	firmLoading: boolean;
	getFirmList() {

		this.firmLoading = true;
		this.firmService.getFirmList({}).subscribe(result => {

			let resp = result["body"];// JSON.parse(result._body);
			if (resp != null && result.code == "OK") {
				this.masterModel.firmList = resp.firmList;
				let localModel = this.model;
				if (this.model.firmDetail != null && this.model.firmDetail.firmID > 0) {
					this.model.firmDetail = this.masterModel.firmList.filter(function (element: any, index: any) { return element.firmID == localModel.firmDetail.firmID; })[0];
				}
			}
			this.firmLoading = false;
		}, error => {
			this.firmLoading = false;
			this.accountService.redirectToLogin(error);

		});
	}

	accountTypeLoading: boolean;
	getAccountTypeList() {

		this.accountTypeLoading = true;
		this.miscService.getAccountTypeList().subscribe(result => {
			let resp = result["body"];// JSON.parse(result._body);
			if (resp != null && result.code == "OK") {
				this.masterModel.accountTypeList = resp.accountTypeList;
				let localModel = this.model;
				if (this.model.accountTypeDetail != null && this.model.accountTypeDetail.accountTypeID > 0) {
					this.model.accountTypeDetail = this.masterModel.accountTypeList.filter(function (element: any, index: any) { return element.accountTypeID == localModel.accountTypeDetail.accountTypeID; })[0];
				}
			}
			this.accountTypeLoading = false;
		}, error => {
			this.accountTypeLoading = false;
			this.accountService.redirectToLogin(error);

		});
	}

	strategyLoading: boolean;
	getStrategyList() {

		this.strategyLoading = true;
		this.miscService.getStrategyList().subscribe(result => {
			let resp = result["body"];// JSON.parse(result._body);
			if (resp != null && result.code == "OK") {
				this.masterModel.strategyList = resp.strategyList;
				let localModel = this.model;
				if (this.model.strategyDetail != null && this.model.strategyDetail.strategyID > 0) {
					this.model.strategyDetail = this.masterModel.strategyList.filter(function (element: any, index: any) { return element.strategyID == localModel.strategyDetail.strategyID; })[0];
				}
			}
			this.strategyLoading = false;
		}, error => {
			this.strategyLoading = false;
			this.accountService.redirectToLogin(error);

		});
	}

	sectorLoading: boolean;
	getSectorList() {

		this.sectorLoading = true;
		this.miscService.getSectorList().subscribe(result => {
			let resp = result["body"];
			if (resp != null) {
				this.masterModel.sectorList = resp;
				let localModel = this.model;
				if (this.model.sectorDetail != null && this.model.sectorDetail.sectorID > 0) {
					this.model.sectorDetail = this.masterModel.sectorList.filter(function (element: any, index: any) { return element.sectorID == localModel.sectorDetail.sectorID; })[0];
				}
			}
			this.sectorLoading = false;
		}, error => {
			this.sectorLoading = false;
			this.accountService.redirectToLogin(error);

		});
	}

	currencyLoading: boolean;
	getCurrencyList() {

		this.currencyLoading = true;
		this.miscService.getCurrencyList().subscribe(result => {
			let resp = result["body"];// JSON.parse(result._body);
			if (resp != null) {
				this.masterModel.currencyList = resp.currencyList;
				let localModel = this.model;
				if (this.model.currencyDetail != null && this.model.currencyDetail.currencyID > 0) {
					this.model.currencyDetail = this.masterModel.currencyList.filter(function (element: any, index: any) { return element.currencyID == localModel.currencyDetail.currencyID; })[0];
				}
			}
			this.currencyLoading = false;
		}, error => {
			this.currencyLoading = false;
			this.accountService.redirectToLogin(error);

		});
	}

	countryLoading: boolean;
	getCountryList() {
		//debugger;
		this.countryLoading = true;
		this.miscService.getCountryList().subscribe(result => {
			let resp = result["body"];
			if (resp != null) {
				this.masterModel.countryList = resp;
				this.countryListClone = JSON.parse(JSON.stringify(resp));
				let localModel = this.model;
				if (this.model.geographyDetail != null && this.model.geographyDetail.country != null && this.model.geographyDetail.country.countryId > 0) {
					this.model.geographyDetail.country = this.masterModel.countryList.filter(function (element: any, index: any) { return element.countryId == localModel.geographyDetail.country.countryId; })[0];

				}

			}
			this.countryLoading = false;
		}, error => {
			this.countryLoading = false;
			this.accountService.redirectToLogin(error);

		});
	}

	regionLoading: boolean;
	getRegionList() {
		//debugger;
		this.regionLoading = true;
		this.miscService.getRegionList().subscribe(result => {
			let resp = result["body"];
			if (resp != null) {
				this.masterModel.regionList = resp;
				this.regionListClone = JSON.parse(JSON.stringify(resp));
				let localModel = this.model;
				if (this.model.geographyDetail != null && this.model.geographyDetail.region != null && this.model.geographyDetail.region.regionId > 0) {
					this.model.geographyDetail.region = this.masterModel.regionList.filter(function (element: any, index: any) { return element.regionId == localModel.geographyDetail.region.regionId; })[0];
				}
			}
			this.regionLoading = false;
		}, error => {
			this.regionLoading = false;
			this.accountService.redirectToLogin(error);

		});
	}

	save(f: any) {
		this.loading = true;
		if (this.title == "Create") {
			this.model.targetCommitment=parseFloat(this.model.targetCommitment);
			this.model.maximumCommitment=parseFloat(this.model.maximumCommitment);
			this.model.fundSize=parseFloat(this.model.fundSize);
			this.model.gpCommitment=parseFloat(this.model.gpCommitment);
			this.model.preferredReturnPercent=parseFloat(this.model.preferredReturnPercent);
			this.model.carriedInterestPercent=parseFloat(this.model.carriedInterestPercent);
			this.model.gpCatchupPercent=parseFloat(this.model.gpCatchupPercent);
			this.model.managementFee=parseFloat(this.model.managementFee);
			this.model.managementFeeOffset=parseFloat(this.model.managementFeeOffset);
			this.model.orgExpenses=parseFloat(this.model.orgExpenses);	
			this._fundService.createFund(this.model)
				.subscribe((data) => {
					if (data.code == "OK") {
						this.msgs = this.miscService.showAlertMessages('success', data.message);
						this.formReset(f);
					}
					else {
						this.msgs = this.miscService.showAlertMessages('error', data.message);
					}
					this.loading = false;
				}, error => {
					this.msgs = this.miscService.showAlertMessages('error', error);
					this.loading = false;
				});
		}
		else if (this.title == "Update") {
			this._fundService.updateFund(this.model)
				.subscribe((data) => {
					if (data.code == "OK") {
						this.msgs = this.miscService.showAlertMessages('success', data.message);
						this.formReset(f);
					}
					else {
						this.msgs = this.miscService.showAlertMessages('error', data.message);
					}
					this.changeDetectorRef.detectChanges();
					this.model.fundClosingDate = new Date(this.model.fundClosingDate);
					this.loading = false;
				}, error => {
					this.msgs = this.miscService.showAlertMessages('error', error);
					this.loading = false;
				});
		}

	}

	cancel() {
		this._router.navigate(['/fund-list']);
	}

	formReset(f: any) {
		f.resetForm();
		this.masterModel.regionList = JSON.parse(JSON.stringify(this.regionListClone));
		this.masterModel.countryList = JSON.parse(JSON.stringify(this.countryListClone));

		this.changeDetectorRef.detectChanges();
		this.masterDataLoadRequired = false;
		this.setDefaultValues();
	}
}







