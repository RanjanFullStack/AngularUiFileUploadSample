﻿import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { Message } from 'primeng/components/common/api';
import { MessageService } from 'primeng/components/common/messageservice';
import { AccountService } from '../../services/account.service';
import { DealService } from '../../services/deal.service';
import { FundService } from '../../services/funds.service';
import { MiscellaneousService } from '../../services/miscellaneous.service';
import { PortfolioCompanyService } from '../../services/portfolioCompany.service';
import { NgbDateParserFormatter_uk } from '../../shared/NgbDateParserFormatter_uk';
 


@Component({
	selector: 'createfund',
	templateUrl: './save-deals.component.html',
	providers: [
		{ provide: NgbDateParserFormatter, useClass: NgbDateParserFormatter_uk }, MessageService
	]
})


export class SaveDealComponent implements OnInit {
	model: any = {};
	title: string = "Create";
	resetText: string = "Reset";
	id: string;
	msgs: Message[] = [];
	masterModel: any = {};
	geographyModel: any;
	msgTimeSpan: number;
	masterDataLoadRequired: boolean = true;
	loading: boolean = false;
	datemodel: NgbDateStruct;
	yearRange: string = "";
	today: Date;
	
	constructor(private _avRoute: ActivatedRoute, private miscService: MiscellaneousService, private fundService: FundService, private portfolioService: PortfolioCompanyService,
		private _dealService: DealService, private _router: Router, protected changeDetectorRef: ChangeDetectorRef, private accountService: AccountService) {
		if (this._avRoute.snapshot.params["id"]) {
			this.id = this._avRoute.snapshot.params["id"];
			this.title = "Update";
			this.resetText = "Reload";
		}
		this.msgTimeSpan = this.miscService.getMessageTimeSpan();
		var year = new Date();
		this.today = year;
		this.yearRange = "2000:" + year.getFullYear();
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
			//get user details by user id
			
			this._dealService.getDealsList({ encryptedDealID: this.id, includeAllDetails: true })
				.subscribe(result => {
					let resp = result["body"] ;// JSON.parse(result_body);
					if (resp != null && result.code == "OK") {
						this.model = resp.dealList[0];
						this.model.investmentDate = new Date(this.model.investmentDate);

						if (this.masterDataLoadRequired) {
							this.getMasterList();
						}

					}
					else {
						if (result.message != "") {
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
			if (this.masterDataLoadRequired) {
				this.getMasterList();
				//this.getDealBoardSeatList();
				//this.getDealExitMethodList();
				//this.getDealInvestmentStageList();
				//this.getDealSecurityTypeList();
				//this.getDealSourcingList();
				//this.getDealTransactionRoleList();
				//this.getDealValuationMethodologyList();
				//this.getFundList();
				//this.getPortfolioList();
				//this.getProfessionalsList();
				//this.getCurrencyList();
			}
		}
	}

	getMasterList() {
		
		this.currencyLoading = true;
		this.dealBoardSeatLoading = true;
		this.dealExitMethodLoading = true;
		this.dealInvestmentStageLoading = true;
		this.dealSecurityTypeLoading = true;
		this.dealSourcingLoading = true;
		this.dealTransactionRoleLoading = true;
		this.dealValuationMethodologyLoading = true;
		this.fundsLoading = true;
		this.portfolioCompanyLoading = true;
		this.professionalListLoading = true;
		this._dealService.getMasterDealModel().subscribe(result => {
			let resp = result["body"];// JSON.parse(result._body);
			
           //debugger;
			if (resp != null) {
				this.masterModel.currencyList = resp.currencyList;
				let localModel = this.model;
				if (this.model != null && this.model.reportingCurrencyID > 0) {
					this.model.currencyDetail = this.masterModel.currencyList.filter(function (element: any, index: any) { return element.currencyID == localModel.reportingCurrencyID; })[0];
				}

				this.masterModel.dealBoardSeatList = resp.dealBoardSeatList;
				if (this.model != null && this.model.dealBoardSeatID > 0) {
					this.model.dealBoardSeatDetail = this.masterModel.dealBoardSeatList.filter(function (element: any, index: any) { return element.dealBoardSeatID == localModel.dealBoardSeatID; })[0];
				}

				this.masterModel.dealExitMethodList = resp.dealExitMethodList;
				if (this.model != null && this.model.dealExitMethodID > 0) {
					this.model.dealExitMethodDetail = this.masterModel.dealExitMethodList.filter(function (element: any, index: any) { return element.dealExitMethodID == localModel.dealExitMethodID; })[0];
				}

				this.masterModel.dealInvestmentStageList = resp.dealInvestmentStageList;
				if (this.model != null && this.model.dealInvestmentStageID > 0) {
					this.model.dealInvestmentStageDetail = this.masterModel.dealInvestmentStageList.filter(function (element: any, index: any) { return element.dealInvestmentStageID == localModel.dealInvestmentStageID; })[0];
				}

				this.masterModel.dealSecurityTypeList = resp.dealSecurityTypeList;
				if (this.model != null && this.model.dealSecurityTypeID > 0) {
					this.model.dealSecurityTypeDetail = this.masterModel.dealSecurityTypeList.filter(function (element: any, index: any) { return element.dealSecurityTypeID == localModel.dealSecurityTypeID; })[0];
				}

				this.masterModel.dealSourcingList = resp.dealSourcingList;
				if (this.model != null && this.model.dealSourcingID > 0) {
					this.model.dealSourcingDetail = this.masterModel.dealSourcingList.filter(function (element: any, index: any) { return element.dealSourcingID == localModel.dealSourcingID; })[0];
				}

				this.masterModel.dealTransactionRoleList = resp.dealTransactionRoleList;
				if (this.model != null && this.model.dealTransactionRoleID > 0) {
					this.model.dealTransactionRoleDetail = this.masterModel.dealTransactionRoleList.filter(function (element: any, index: any) { return element.dealTransactionRoleID == localModel.dealTransactionRoleID; })[0];
				}

				this.masterModel.dealValuationMethodologyList = resp.dealValuationMethodologyList;
				if (this.model != null && this.model.dealValuationMethodologyID > 0) {
					this.model.dealValuationMethodologyDetail = this.masterModel.dealValuationMethodologyList.filter(function (element: any, index: any) { return element.dealValuationMethodologyID == localModel.dealValuationMethodologyID; })[0];
				}

				this.masterModel.fundList = resp.fundList;
				if (this.model != null && this.model.fundID > 0) {
					this.model.fundDetails = this.masterModel.fundList.filter(function (element: any, index: any) { return element.fundID == localModel.fundDetails.fundID; })[0];
				}

				this.masterModel.portfolioCompanyList = resp.portfolioCompanyList;
				if (this.model != null && this.model.portfolioCompanyID > 0) {
					this.model.portfolioCompanyDetails = this.masterModel.portfolioCompanyList.filter(function (element: any, index: any) { return element.portfolioCompanyID == localModel.portfolioCompanyDetails.portfolioCompanyID; })[0];
				}

				this.masterModel.sourcingProfessionalList = resp.sourcingProfessionalList;				
				if (this.model != null && this.model.employeeId > 0) {
					this.model.sourcingProfessionalDetail = this.masterModel.sourcingProfessionalList.filter(function (element: any, index: any) { return element.employeeId == localModel.sourcingProfessionalDetail.employeeId; })[0];
				}

				this.masterModel.leadProfessionalList = resp.leadProfessionalList;
				if (this.model != null && this.model.employeeId > 0) {
					this.model.leadProfessionalDetail = this.masterModel.leadProfessionalList.filter(function (element: any, index: any) { return element.employeeId == localModel.leadProfessionalDetail.employeeId; })[0];
                }
                
			}
			this.currencyLoading = false;
			this.dealBoardSeatLoading = false;
			this.dealExitMethodLoading = false;
			this.dealInvestmentStageLoading = false;
			this.dealSecurityTypeLoading = false;
			this.dealSourcingLoading = false;
			this.dealTransactionRoleLoading = false;
			this.dealValuationMethodologyLoading = false;
			this.fundsLoading = false;
			this.portfolioCompanyLoading = false;
			this.professionalListLoading = false;
		}, error => {
			this.currencyLoading = true;
			this.dealBoardSeatLoading = true;
			this.dealExitMethodLoading = true;
			this.dealInvestmentStageLoading = true;
			this.dealSecurityTypeLoading = true;
			this.dealSourcingLoading = true;
			this.dealTransactionRoleLoading = true;
			this.dealValuationMethodologyLoading = true;
			this.fundsLoading = true;
			this.portfolioCompanyLoading = true;
			this.professionalListLoading = true;
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

	dealBoardSeatLoading: boolean;
	getDealBoardSeatList() {
		this.dealBoardSeatLoading = true;
		this.miscService.getDealBoardSeatList().subscribe(result => {
			let resp = result["body"] ;
			if (resp != null && result.code == "OK") {
				this.masterModel.dealBoardSeatList = resp.dealBoardSeatList;
				let localModel = this.model;
				if (this.model.dealBoardSeatList != null && this.model.dealBoardSeatList.dealBoardSeatID > 0) {
					this.model.dealBoardSeatDetail = this.masterModel.dealBoardSeatList.filter(function (element: any, index: any) { return element.dealBoardSeatID == localModel.dealBoardSeatDetail.dealBoardSeatID; })[0];
				}
			}
			this.dealBoardSeatLoading = false;
		}, error => {
			this.accountService.redirectToLogin(error);
			this.dealBoardSeatLoading = false;
		})
	}

	dealExitMethodLoading: boolean;
	getDealExitMethodList() {
		this.dealExitMethodLoading = true;
		this.miscService.getDealExitMethodList().subscribe(result => {
			let resp = result["body"] ;
			if (resp != null && result.code == "OK") {
				this.masterModel.dealExitMethodList = resp.dealExitMethodList;
				let localModel = this.model;
				if (this.model.dealExitMethodDetail != null && this.model.dealExitMethodDetail.dealExitMethodID > 0) {
					this.model.dealExitMethodDetail = this.masterModel.dealExitMethodList.filter(function (element: any, index: any) { return element.dealExitMethodID == localModel.dealExitMethodDetail.dealExitMethodID; })[0];
				}
			}
			this.dealExitMethodLoading = false;
		}, error => {
			this.accountService.redirectToLogin(error);
			this.dealExitMethodLoading = false;
		})
	}

	dealInvestmentStageLoading: boolean;
	getDealInvestmentStageList() {
		this.dealInvestmentStageLoading = true;
		this.miscService.getDealInvestmentStageList().subscribe(result => {
			let resp = result["body"];
			if (resp != null && result.code == "OK") {
				this.masterModel.dealInvestmentStageList = resp.dealInvestmentStageList;
				let localModel = this.model;
				if (this.model.dealInvestmentStageDetail != null && this.model.dealInvestmentStageDetail.dealInvestmentStageID > 0) {
					this.model.dealInvestmentStageDetail = this.masterModel.dealInvestmentStageList.filter(function (element: any, index: any) { return element.dealInvestmentStageID == localModel.dealInvestmentStageDetail.dealInvestmentStageID; })[0];
				}
			}
			this.dealInvestmentStageLoading = false;
		}, error => {
			this.accountService.redirectToLogin(error);
			this.dealInvestmentStageLoading = false;
		})
	}

	dealSecurityTypeLoading: boolean;
	getDealSecurityTypeList() {
		this.dealSecurityTypeLoading = true;
		this.miscService.getDealSecurityTypeList().subscribe(result => {
			let resp = result["body"] ;
			if (resp != null && result.code == "OK") {
				this.masterModel.dealSecurityTypeList = resp.dealSecurityTypeList;
				let localModel = this.model;
				if (this.model.dealSecurityTypeDetail != null && this.model.dealSecurityTypeDetail.dealSecurityTypeID > 0) {
					this.model.dealSecurityTypeDetail = this.masterModel.dealSecurityTypeList.filter(function (element: any, index: any) { return element.dealSecurityTypeID == localModel.dealSecurityTypeDetail.dealSecurityTypeID; })[0];
				}
			}
			this.dealSecurityTypeLoading = false;
		}, error => {
			this.accountService.redirectToLogin(error);
			this.dealSecurityTypeLoading = false;
		})
	}

	dealSourcingLoading: boolean;
	getDealSourcingList() {
		this.dealSourcingLoading = true;
		this.miscService.getDealSourcingList().subscribe(result => {
			let resp = result["body"] ;
			if (resp != null && result.code == "OK") {
				this.masterModel.dealSourcingList = resp.dealSourcingList;
				let localModel = this.model;
				if (this.model.dealSourcingDetail != null && this.model.dealSourcingDetail.dealSourcingID > 0) {
					this.model.dealSourcingDetail = this.masterModel.dealSourcingList.filter(function (element: any, index: any) { return element.dealSourcingID == localModel.dealSourcingDetail.dealSourcingID; })[0];
				}
			}
			this.dealSourcingLoading = false;
		}, error => {
			this.accountService.redirectToLogin(error);
			this.dealSourcingLoading = false;
		})
	}

	dealTransactionRoleLoading: boolean;
	getDealTransactionRoleList() {
		this.dealTransactionRoleLoading = true;
		this.miscService.getDealTransactionRoleList().subscribe(result => {
			let resp = result["body"] ;
			if (resp != null && result.code == "OK") {
				this.masterModel.dealTransactionRoleList = resp.dealTransactionRoleList;
				let localModel = this.model;
				if (this.model.dealTransactionRoleDetail != null && this.model.dealTransactionRoleDetail.dealTransactionRoleID > 0) {
					this.model.dealTransactionRoleDetail = this.masterModel.dealTransactionRoleList.filter(function (element: any, index: any) { return element.dealTransactionRoleID == localModel.dealTransactionRoleDetail.dealTransactionRoleID; })[0];
				}
			}
			this.dealTransactionRoleLoading = false;
		}, error => {
			this.accountService.redirectToLogin(error);
			this.dealTransactionRoleLoading = false;
		})
	}

	dealValuationMethodologyLoading: boolean;
	getDealValuationMethodologyList() {
		this.dealValuationMethodologyLoading = true;
		this.miscService.getDealValuationMethodologyList().subscribe(result => {
			let resp = result["body"] ;
			if (resp != null && result.code == "OK") {
				this.masterModel.dealValuationMethodologyList = resp.dealValuationMethodologyList;
				let localModel = this.model;
				if (this.model.dealValuationMethodologyDetail != null && this.model.dealValuationMethodologyDetail.dealValuationMethodologyID > 0) {
					this.model.dealValuationMethodologyDetail = this.masterModel.dealValuationMethodologyList.filter(function (element: any, index: any) { return element.dealValuationMethodologyID == localModel.dealValuationMethodologyDetail.dealValuationMethodologyID; })[0];
				}
			}
			this.dealValuationMethodologyLoading = false;
		}, error => {
			this.accountService.redirectToLogin(error);
			this.dealValuationMethodologyLoading = false;
		})
	}

	fundsLoading: boolean;
	getFundList() {
		this.fundsLoading = true;
		this.fundService.getFundNamesList({}).subscribe(result => {
			let resp = result["body"] ;
			if (resp != null && result.code == "OK") {
				this.masterModel.fundList = resp.fundList;
				let localModel = this.model;
				if (this.model.fundDetails != null && this.model.fundDetails.fundID > 0) {
					this.model.fundDetails = this.masterModel.fundList.filter(function (element: any, index: any) { return element.fundID == localModel.fundDetails.fundID; })[0];
				}
			}
			this.fundsLoading = false;
		}, error => {
			this.accountService.redirectToLogin(error);
			this.fundsLoading = false;
		})
	}

	portfolioCompanyLoading: boolean;
	getPortfolioList() {

		this.portfolioCompanyLoading = true;
		this.portfolioService.getPortfolioCompanyList({}).subscribe(result => {
			let resp = result["body"] ;
			if (resp != null && result.code == "OK") {
				this.masterModel.portfolioCompanyList = resp.portfolioCompanyList;
				let localModel = this.model;
				if (this.model.portfolioCompanyDetails != null && this.model.portfolioCompanyDetails.portfolioCompanyID > 0) {
					this.model.portfolioCompanyDetails = this.masterModel.portfolioCompanyList.filter(function (element: any, index: any) { return element.portfolioCompanyID == localModel.portfolioCompanyDetails.portfolioCompanyID; })[0];
				}
			}
			this.portfolioCompanyLoading = false;
		}, error => {
			this.portfolioCompanyLoading = false;
			this.accountService.redirectToLogin(error);

		});
	}

	professionalListLoading: boolean;
	getProfessionalsList() {

		this.professionalListLoading = true;
		this.miscService.getPortfolioCompanyEmployeesList().subscribe(result => {
			let resp = result["body"] ;
			if (resp.length == 1) {
				if (resp[0] != null && resp[0] != "") {
					this.professionalListLoading = false;
					return;
				}
			}

			this.masterModel.sourcingProfessionalList = resp;
			this.masterModel.leadProfessionalList = resp;
			let localModel = this.model;

			if (this.model.sourcingProfessionalDetail != null && this.model.sourcingProfessionalDetail.employeeId > 0) {
				this.model.sourcingProfessionalDetail = this.masterModel.sourcingProfessionalList.filter(function (element: any, index: any) { return element.employeeId == localModel.sourcingProfessionalDetail.employeeId; })[0];
			}
			if (this.model.leadProfessionalDetail != null && this.model.leadProfessionalDetail.employeeId > 0) {
				this.model.leadProfessionalDetail = this.masterModel.leadProfessionalList.filter(function (element: any, index: any) { return element.employeeId == localModel.leadProfessionalDetail.employeeId; })[0];
			}
			this.professionalListLoading = false;
		}, error => {
			this.professionalListLoading = false;
			this.accountService.redirectToLogin(error);

		});
	}

    save(f: any) {

        this.loading = true;
        var emptyDropDown = this.getEmptyDropDownsIfExist();
        if (emptyDropDown != "") {
            this.msgs = this.miscService.showAlertMessages('error', emptyDropDown + " drop down cannot be empty");
            return;
		}
		this.model.entryMultiple=parseFloat(this.model.entryMultiple);
		this.model.entryOwnershipPercent=parseFloat(this.model.entryOwnershipPercent);
		this.model.currentExitOwnershipPercent=parseFloat(this.model.currentExitOwnershipPercent);
		this.model.enterpriseValue=parseFloat(this.model.enterpriseValue);
		
		this._dealService.saveDeal(this.model)
			.subscribe((data) => {
				
                if (data.code == "OK") {
                    this.formReset(f);
					this.msgs = this.miscService.showAlertMessages('success', data.message);
				}
				else {
					this.msgs = this.miscService.showAlertMessages('error', data.message);
				}
				this.loading = false;

			}, error => {
				this.msgs = this.miscService.showAlertMessages('error', error)
				this.loading = false;
			})

	}


    private getEmptyDropDownsIfExist() {
        if (this.model.dealBoardSeatDetail.boardSeat == null) {
            return "Board Seat";
        }
        else if (this.model.dealExitMethodDetail.exitMethod == null) {
            return "Exit Method";
        }
        else if (this.model.dealInvestmentStageDetail.investmentStage == null) {
            return "Investment Stage";
        }
        else if (this.model.dealSecurityTypeDetail.securityType == null) {
            return "Security Type";
        }
        else if (this.model.dealSourcingDetail.dealSourcing == null) {
            return "Deal Sourcing";
        }
        else if (this.model.dealTransactionRoleDetail.transactionRole == null) {
            return "Transaction Role";
        }
        else if (this.model.dealValuationMethodologyDetail.valuationMethodology == null) {
            return "Valuation Methodology";
        }
        else {
            return "";
        }
    }

	formReset(f: any) {
		f.resetForm();
		this.changeDetectorRef.detectChanges();
		this.masterDataLoadRequired = true;
		this.setDefaultValues();

	}
}







