import { Component, ViewChild } from "@angular/core";
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
import { ActivatedRoute } from "@angular/router";
import * as moment from 'moment';
import { Message } from "primeng/components/common/api";
import { MessageService } from "primeng/components/common/messageservice";
import { AccountService } from "../../services/account.service";
import { CashflowService } from "../../services/cashflow.service";
import { FileUploadService } from "../../services/file-upload.service";
import { FundService } from "../../services/funds.service";
import { MiscellaneousService } from "../../services/miscellaneous.service";
import { FeaturesEnum } from '../../services/permission.service';


@Component({
	selector: 'cashflow',
	templateUrl: './cashflow.component.html',
	providers: [MessageService],
	styleUrls: ['./cashflow.component.css']
})

export class CashflowComponent {
	feature: typeof FeaturesEnum = FeaturesEnum;
	progress: number;
	message: string;
	msgTimeSpan: number;
	fileUploadSubscription: any;
	cashflowData: any = [];
	cashflowCalculationData: any = [];
	currentQuarter: string = "";
	realizeData: any = [];
	unRealizeData: any = [];
	cashflowFileId: any;
	showUploadSection: boolean = true;
	msgs: Message[] = [];
	loading: boolean;
	totalRecords: number;
	cancel: boolean = false;
	enableSaveButton: any = true;
	interval: any = 0;
	ProgressCancel: boolean = true;
	showCancelButton: boolean = true;

	FileProgresStatus: string = "Cancel File Progress";
	@ViewChild('fileUploader') fileUploader: any = {};
	messageClass: string = "bulkMessage";
	safeHtml: SafeHtml;
	uploadedFiles: any[] = [];
	value: number = 0;
	fundList: any[] = [];
	selectedFund: any;
	isOverwriteHoldings: boolean = false;
	fundHoldingUpdateDetails: any;
	fundName: any;
	//  cashFlowByIdData: any[] = [];
	frozenCols: any = [
		{ field: 'Date', header: 'Date' },
		{ field: 'Transaction Type', header: 'Transaction Type' }
	];
	frozenRows: any = [];
	fundData: any = {};
	realizedColIndex = 0;
	unrealizedColIndex = 0;

	constructor(private messageService: MessageService, private _avRoute: ActivatedRoute, private sanitizer: DomSanitizer, private miscService: MiscellaneousService, private cashflowService: CashflowService,
		private accountService: AccountService, private fileUploadService: FileUploadService, private fundService: FundService) {
		this.msgTimeSpan = this.miscService.getMessageTimeSpan();
		if (this._avRoute.snapshot.params["id"]) {
			this.cashflowFileId = this._avRoute.snapshot.params["id"];
			this.showUploadSection = false;
		}

	}

	checkIfValidDate(date: any) {

		return moment(date, 'MM/DD/YYYY', true).isValid();
	}

	ngOnInit() {

		this.getFundList();
		if (this.cashflowFileId != undefined) {
			var cashFlowByIdData = {
				cashFlowId: this.cashflowFileId,
				pageName: "List"
			};
			// this.getCashflowDeatils(this.cashflowFileId,"List");
			this.getCashflowDeatils(cashFlowByIdData);
		} else {
			this.getFundList();
		}

	}
	onUpload(event: any) {
		
		for (let file of event.files) {
			
			this.uploadCashflow(file);
		}
	}

	saveDataFlag() {
		

		this.loading = true;
		if (!this.isOverwriteHoldings) {
			this.fundHoldingUpdateDetails.cashflowCalculationDetails = this.fundHoldingUpdateDetails.cashflowCalculationDetails.filter(function (item: any) {
				return item.existingFundHoldingId == 0 && item.dealId != null && item.dealId > 0;
			})
		}
		else {
			this.fundHoldingUpdateDetails.cashflowCalculationDetails = this.fundHoldingUpdateDetails.cashflowCalculationDetails.filter(function (item: any) {
				return item.dealId != null && item.dealId > 0;
			})
		}
		this.cashflowService.saveCashflowData(this.fundHoldingUpdateDetails)
			.subscribe((data) => {
				if (data.code == "OK") {
					this.enableSaveButton = true;
					this.displayUpdateConfirmationDialog = false;
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

	CashflowDataExport(event: any) {
		this.loading = true;
		var exportData = {
			exportCol: this.realizeData.cols,
			exportVal: this.realizeData.Results,
			fundName: this.fundName
		};
		this.cashflowService.exportCashflowData(exportData)
			.subscribe((response) => {
				this.miscService.downloadExcelFile(response)
			}, error => {
				this.msgs = this.miscService.showAlertMessages('error', error)
				this.loading = false;
			})

	}

	uploadCashflow(file: any) {
		
		this.value = 0;
		file.showCancelButton = true;
		this.ProgressCancel = false;
		this.safeHtml = "";
		this.fileUploader;
		this.cancel = false;
		if (file.length === 0) {
			this.safeHtml = "Error :- No file selected. Please select a file.";
			this.messageClass = "errorMessage";
			this.ProgressCancel = true;

			return;
		}
		if (!this.selectedFund) {
			this.msgs = this.miscService.showAlertMessages('error', 'Please select a fund');
			this.ProgressCancel = true;

			return;
		}

		this.interval = setInterval(() => {
			if (this.value < 80) {
				this.value = this.value + Math.floor(Math.random() * 10) + 1;
			}
			//if (this.value >= 10) {
			
			//START
			try {
				
				if (!(this.cancel)) {
					const formData = new FormData();
					// formData.append("MODULENAME", this.moduleName);
					formData.append(file.name, file);
					formData.append("fundId", this.selectedFund.fundID);

					this.cancel = true;
					this.FileProgresStatus = "File Processing...";
					this.fileUploadService.importCashflowDetails(formData).subscribe(result => {
						try {
							let resp = result["body"];
							
							this.value = 100;
							this.ProgressCancel = true;
							clearInterval(this.interval);
							if (resp != null) {
								if (resp.validationStatus.isValid) {
									// let res = JSON.parse(result.message);
									let res = (result.body);
									this.messageClass = "bulkMessage";
									//this.safeHtml = this.sanitizer.bypassSecurityTrustHtml(
									//    //result.message
									//    result[0].statusDescription
									//)
									this.uploadedFiles.push(file);
									if (result.code == "OK") {
										var cashFlowByIdData = {
											cashFlowId: res.encryptedCashflowFileID,
											pageName: "Upload"
										};
										this.enableSaveButton = null;
										this.cashflowFileId = res.encryptedCashflowFileID;
										this.showUploadSection = true;

										let quarterDetails = res.cashflowCalculationDetails.filter(function (item: any) {
											return item.quarter != null;
										})
										if (quarterDetails.length > 0) {
											this.currentQuarter = quarterDetails[0].quarter + " " + quarterDetails[0].quarterYear;
										}
										this.cashflowCalculationData = res.cashflowCalculationDetails.filter(function (item: any) {
											return item.existingFundHoldingId > 0
										})
										this.fundHoldingUpdateDetails = { encryptedCashflowFileID: res.encryptedCashflowFileID, fund: res.fund, cashflowCalculationDetails: JSON.parse(JSON.stringify(res.cashflowCalculationDetails)) }

										this.getCashflowDeatils(cashFlowByIdData);
										this.msgs = this.miscService.showAlertMessages('success', 'File uploaded successfully');
									}
									this.value = 100;
									this.ProgressCancel = true;
								}
								else {
									
									if (resp.validationStatus.isValid == undefined) {
										this.messageClass = "errorMessage";
										this.enableSaveButton = true;
										this.cashflowFileId = undefined;
										this.safeHtml = this.sanitizer.bypassSecurityTrustHtml(
											resp.validationStatus.statusDescription
										)

										this.msgs = this.miscService.showAlertMessages('error', 'Please see the error list');
									}
									else {
										//If there is long error list 
										this.messageClass = "errorMessage";
										this.enableSaveButton = true;
										this.cashflowFileId = undefined;
										this.safeHtml = this.sanitizer.bypassSecurityTrustHtml(
											//result.message
											resp.validationStatus.statusDescription
										)

										this.msgs = this.miscService.showAlertMessages('error', 'Please see the error list');
									}
									this.value = 100;
									this.ProgressCancel = true;
								}
							} else {
								this.messageClass = "errorMessage";
								this.enableSaveButton = true;
								this.cashflowFileId = undefined;
								//this.messageService.add({ severity: 'error', summary: 'Error', detail: 'please check the file' });
								this.msgs = this.miscService.showAlertMessages('error', 'Please see the error list');
								//  this.safeHtml = "Error :- please check the file";
								this.value = 100;
								this.ProgressCancel = true;
							}

						}
						catch (e) {
							
							this.messageClass = "errorMessage";
							this.enableSaveButton = true;
							this.cashflowFileId = undefined;
							//this.messageService.add({ severity: 'error', summary: 'Error', detail: 'please check the file' });
							this.msgs = this.miscService.showAlertMessages('error', 'Please see the error list');
							//  this.safeHtml = "Error :- please check the file";
							this.value = 100;
							this.ProgressCancel = true;

						}
					}, error => {
						this.enableSaveButton = true;
						this.miscService.redirectToLogin(error);
						this.ProgressCancel = false;

					});
				}
			}
			catch (e) {
				this.msgs = this.miscService.showAlertMessages('error', 'Please see the error list');

				this.messageClass = "errorMessage";
			}

			//}

		}, 2000);



	}

	//getCashflowDeatils(fileId: any, pageName: any) {
	getCashflowDeatils(fileId: any) {
		this.cashflowService.getCashFlowDeatils(fileId).subscribe(result => {
			let resp = result["body"];
			var local = this;
			var objCashFlowRealizeList: any = [];
			var objCashFlowUnRealizeList: any = [];
			objCashFlowRealizeList.Results = [];
			objCashFlowUnRealizeList.Results = [];
			if (resp != null && result.code == 'OK') {
				this.cashflowData = resp.cashflowDateWiseSummary;
				this.fundName = resp.fund.fundName;
				//this.selectedFund = this.fundList.filter(function (element: any) { return element.fundID == resp.fund.fundID; })[0];			

				objCashFlowRealizeList.cols = [];
				objCashFlowUnRealizeList.cols = [];
				// objCashFlowRealizeList.cols.push({ field: "Date", header: "Date" });
				//  objCashFlowUnRealizeList.cols.push({ field: "Date", header: "Date" });
				//objCashFlowUnRealizeList.cols.push({ field: "TransactionType", header: "Transaction Type" });
				//objCashFlowRealizeList.cols.push({ field: "TransactionType", header: "Transaction Type" });

				this.cashflowData.forEach(function (data: any, index: any) {
					var objCashFlowRealize: any = {};
					var objCashFlowUnRealize: any = {};

					objCashFlowRealize["Date"] = objCashFlowUnRealize["Date"] = local.miscService.formatDate(data.transactionDate);
					objCashFlowRealize["Transaction Type"] = data.transactionType

					// for realized property column
					data.cashFlowCompanyList.forEach(function (comp: any) {

						if (comp.isRealizedValue) {
							objCashFlowRealize[comp.portfolioCompanyName] = comp.transactionValue;
							var list = objCashFlowRealizeList.cols.filter(function (val: any) {
								return val.field == comp.portfolioCompanyName;
							});
							if (list == null || list.length == 0) {
								objCashFlowRealizeList.cols.push({ field: comp.portfolioCompanyName, header: comp.portfolioCompanyName });
							}
						}

						// for unrealized property column
						if (!comp.isRealizedValue) {
							// add balnk column as a separater
							let blankHeader = null;
							if (objCashFlowRealizeList.cols.length > 0) {
								blankHeader = objCashFlowRealizeList.cols.filter(function (colValue: any) {
									return colValue.field == "";
								});
							}
							if (blankHeader == null || blankHeader.length == 0) {
								objCashFlowRealizeList.cols.push({ field: "", header: "" });
							}

							if (objCashFlowRealize[comp.portfolioCompanyName + " "] == undefined) {
								objCashFlowRealize[comp.portfolioCompanyName + " "] = comp.transactionValue;
							} else {
								objCashFlowRealize[comp.portfolioCompanyName + " "] = comp.transactionValue;
							}
							var list = objCashFlowRealizeList.cols.filter(function (val: any) {
								//return val.field == comp.portfolioCompanyName || val.field == comp.portfolioCompanyName + " ";
								return val.field == comp.portfolioCompanyName + " ";
							});
							if (list == null || list.length == 0) {

								objCashFlowRealizeList.cols.push({ field: comp.portfolioCompanyName + " ", header: comp.portfolioCompanyName + " " });
							}
						}

					});

					objCashFlowRealize["Total Realized"] = data.totalRealizeValue;
					objCashFlowRealize["Total Unrealized"] = data.totalUnrealizeValue;
					objCashFlowRealize["Total"] = data.totalRealizeUnrealizeValue;
					objCashFlowRealize["Total Fees / Expenses"] = data.totalFundFees;
					objCashFlowRealize["Total Less Fund Expenses/Fees"] = data.totalRealizeUnrealizeAndFundFeesValue;

					objCashFlowRealizeList.Results.push(objCashFlowRealize);

				});
				// this.totalRecords = resp.totalRecords;

				var separatorIndex = -1;
				objCashFlowRealizeList.cols.forEach(function (val: any, i: any) {
					if (val.field == "") {
						separatorIndex = i;
					}
				});
				if (separatorIndex == -1) {
					objCashFlowRealizeList.cols.splice(objCashFlowRealizeList.cols.length, 0, { field: "Total Realized", header: "Total Realized" });
				}
				else if (separatorIndex > 1) {
					objCashFlowRealizeList.cols.splice(separatorIndex, 0, { field: "Total Realized", header: "Total Realized" });

				}
				if (separatorIndex > -1) {
					objCashFlowRealizeList.cols.push({ field: "Total Unrealized", header: "Total Unrealized" });
				}
				objCashFlowRealizeList.cols.push({ field: "", header: "" });
				objCashFlowRealizeList.cols.push({ field: "Total", header: "Total" });
				objCashFlowRealizeList.cols.push({ field: "Total Fees / Expenses", header: "Total Fees / Expenses" });
				objCashFlowRealizeList.cols.push({ field: "Total Less Fund Expenses/Fees", header: "Total Less Fund Expenses/Fees" });




				var calulationModel = resp.cashflowCalculationDetails;
				var objCashFlowCapitalInvested: any = {};
				var objCashFlowRealized: any = {};
				var objCashFlowUnrealized: any = {};
				var objCashFlowTotal: any = {};
				var objCashFlowIRR: any = {};
				var objCashFlowMultiple: any = {};




				calulationModel.forEach(function (value: any) {
					///*************Capital Invested *************************//
					objCashFlowCapitalInvested["Date"] = "Capital Invested"

					if (value.isRealizedValue) {
						objCashFlowCapitalInvested[value.portfolioCompanyName] = value.capitalInvested
					}
					else {
						objCashFlowCapitalInvested[value.portfolioCompanyName + " "] = value.capitalInvested
					}
					//   totalRealizeCalRealizeCapitalInvested += value.capitalInvested;
					///************* Realized Value *************************//
					objCashFlowRealized["Date"] = "Realized Value"

					if (value.isRealizedValue) {
						objCashFlowRealized[value.portfolioCompanyName] = value.realizedValue
					}
					else {
						objCashFlowRealized[value.portfolioCompanyName + " "] = value.realizedValue
					}

					///************* Unrealized Value *************************//
					objCashFlowUnrealized["Date"] = "Unrealized Value"

					if (value.isRealizedValue) {
						objCashFlowUnrealized[value.portfolioCompanyName] = value.unrealizedValue
					}
					else {
						objCashFlowUnrealized[value.portfolioCompanyName + " "] = value.unrealizedValue
					}

					///************* Total Value *************************//
					objCashFlowTotal["Date"] = "Total Value"

					if (value.isRealizedValue) {
						objCashFlowTotal[value.portfolioCompanyName] = value.totalValue
					}
					else {
						objCashFlowTotal[value.portfolioCompanyName + " "] = value.totalValue
					}

					///************* IRR *************************//
					objCashFlowIRR["Date"] = "IRR"

					if (value.isRealizedValue) {
						objCashFlowIRR[value.portfolioCompanyName] = (value.irr * 100).toFixed(2) + "%"
					}
					else {
						objCashFlowIRR[value.portfolioCompanyName + " "] = (value.irr * 100).toFixed(2) + "%"
					}

					///************* TVPI *************************//
					objCashFlowMultiple["Date"] = "TVPI"

					if (value.isRealizedValue) {
						objCashFlowMultiple[value.portfolioCompanyName] = value.multiple
					}
					else {
						objCashFlowMultiple[value.portfolioCompanyName + " "] = value.multiple
					}

				});

				var totalCalulationModel = resp.totalCalculationDetails;

				//Total Realized
				objCashFlowRealized["Total Realized"] = 0;
				//Total Unrealized
				objCashFlowRealized["Total Unrealized"] = 0;
				//Total Realized
				objCashFlowUnrealized["Total Realized"] = 0;
				//Total Unrealized
				objCashFlowUnrealized["Total Unrealized"] = 0;
				//Total Realized
				objCashFlowTotal["Total Realized"] = 0;
				//Total Unrealized
				objCashFlowTotal["Total Unrealized"] = 0;
				//Total Realized
				objCashFlowIRR["Total Realized"] = 0;
				//Total Unrealized
				objCashFlowIRR["Total Unrealized"] = 0;
				//Total Realized
				objCashFlowMultiple["Total Realized"] = 0;
				//Total Unrealized
				objCashFlowMultiple["Total Unrealized"] = 0;


				objCashFlowRealizeList.Results.push(objCashFlowCapitalInvested);
				objCashFlowRealizeList.Results.push(objCashFlowRealized);
				objCashFlowRealizeList.Results.push(objCashFlowUnrealized);
				objCashFlowRealizeList.Results.push(objCashFlowTotal);
				objCashFlowRealizeList.Results.push(objCashFlowIRR);
				objCashFlowRealizeList.Results.push(objCashFlowMultiple);

				objCashFlowRealizeList.Results.forEach(function (result: any) {
					if (result.Date == "Capital Invested" || result.Date == "Realized Value" || result.Date == "Unrealized Value" || result.Date == "Total Value" || result.Date == "IRR" || result.Date == "TVPI") {
						totalCalulationModel.forEach(function (totalData: any) {
							if (result.Date == "Capital Invested") {
								if (totalData.calculationType == "Realize") {
									result["Total Realized"] = totalData.totalCapitalInvested
								}
								else if (totalData.calculationType == "Unrealize") {
									result["Total Unrealized"] = totalData.totalCapitalInvested
								}
								else if (totalData.calculationType == "TotalRealizeUnrealize") {
									result["Total"] = totalData.totalCapitalInvested
								}
								else if (totalData.calculationType == "TotalLessFundExpensesFees") {
									result["Total Less Fund Expenses/Fees"] = totalData.totalCapitalInvested
								}

							}
							if (result.Date == "Realized Value") {
								if (totalData.calculationType == "Realize") {
									result["Total Realized"] = totalData.totalRealizedValue
								}
								else if (totalData.calculationType == "Unrealize") {
									result["Total Unrealized"] = totalData.totalRealizedValue
								}
								else if (totalData.calculationType == "TotalRealizeUnrealize") {
									result["Total"] = totalData.totalRealizedValue
								}
								else if (totalData.calculationType == "TotalLessFundExpensesFees") {
									result["Total Less Fund Expenses/Fees"] = totalData.totalRealizedValue
								}

							}
							if (result.Date == "Unrealized Value") {
								if (totalData.calculationType == "Realize") {
									result["Total Realized"] = totalData.totalUnrealizedValue
								}
								else if (totalData.calculationType == "Unrealize") {
									result["Total Unrealized"] = totalData.totalUnrealizedValue
								}
								else if (totalData.calculationType == "TotalRealizeUnrealize") {
									result["Total"] = totalData.totalUnrealizedValue
								}
								else if (totalData.calculationType == "TotalLessFundExpensesFees") {
									result["Total Less Fund Expenses/Fees"] = totalData.totalUnrealizedValue
								}

							}
							if (result.Date == "Total Value") {
								if (totalData.calculationType == "Realize") {
									result["Total Realized"] = totalData.totalofTotalValue
								}
								else if (totalData.calculationType == "Unrealize") {
									result["Total Unrealized"] = totalData.totalofTotalValue
								}
								else if (totalData.calculationType == "TotalRealizeUnrealize") {
									result["Total"] = totalData.totalofTotalValue
								}
								else if (totalData.calculationType == "TotalLessFundExpensesFees") {
									result["Total Less Fund Expenses/Fees"] = totalData.totalofTotalValue
								}

							}
							if (result.Date == "IRR") {
								if (totalData.calculationType == "Realize") {
									result["Total Realized"] = (totalData.totalIRR * 100).toFixed(2) + "%"
								}
								else if (totalData.calculationType == "Unrealize") {
									result["Total Unrealized"] = (totalData.totalIRR * 100).toFixed(2) + "%"
								}
								else if (totalData.calculationType == "TotalRealizeUnrealize") {
									result["Total"] = (totalData.totalIRR * 100).toFixed(2) + "%"
								}
								else if (totalData.calculationType == "TotalLessFundExpensesFees") {
									result["Total Less Fund Expenses/Fees"] = (totalData.totalIRR * 100).toFixed(2) + "%"
								}

							}
							if (result.Date == "TVPI") {
								if (totalData.calculationType == "Realize") {
									result["Total Realized"] = totalData.totalMultiple
								}
								else if (totalData.calculationType == "Unrealize") {
									result["Total Unrealized"] = totalData.totalMultiple
								}
								else if (totalData.calculationType == "TotalRealizeUnrealize") {
									result["Total"] = totalData.totalMultiple
								}
								else if (totalData.calculationType == "TotalLessFundExpensesFees") {
									result["Total Less Fund Expenses/Fees"] = totalData.totalMultiple
								}

							}
						});
					}
				});

				if (objCashFlowRealizeList.Results.length == 0) {
					objCashFlowRealizeList.cols = [];
				}
				//get column index
				objCashFlowRealizeList.cols.filter(function (v: any, k: any) {
					if (v.field == "Total Realized") {
						local.realizedColIndex = k;
					}
					if (v.field == "Total Unrealized") {
						local.unrealizedColIndex = k;
					}
				});
				this.realizeData = objCashFlowRealizeList;
				this.getFundData(this.realizeData.Results);
			}
			else {
				this.cashflowData = [];
				this.totalRecords = 0;
			}


		}, error => {
			this.enableSaveButton = true;
			this.accountService.redirectToLogin(error);

		});
	}

	getFundData(cashfloData: any) {
		let local = this;
		cashfloData.forEach(function (val: any) {
			if (val.Date == "Capital Invested") {
				local.fundData["Capital Invested"] = val.Total;
			}
			if (val.Date == "Realized Value") {
				local.fundData["Realized Value"] = val.Total;
			}
			if (val.Date == "Unrealized Value") {
				local.fundData["Unrealized Value"] = val.Total;
			}
			if (val.Date == "Total Value") {
				local.fundData["Total Value"] = val.Total;
			}
			if (val.Date == "TVPI") {
				local.fundData["Gross TVPI"] = val.Total;
				local.fundData["Net TVPI"] = val["Total Less Fund Expenses/Fees"];
			}
			if (val.Date == "IRR") {
				local.fundData["Gross IRR"] = val.Total;
				local.fundData["Net IRR"] = val["Total Less Fund Expenses/Fees"];
			}

			/***********Frozen Rows***************/
			//if (val.Date == "Capital Invested" || val.Date == "Realized Value" || val.Date == "Unrealized Value" || val.Date == "Total Value" || val.Date == "TVPI" || val.Date == "IRR") {
			//    local.frozenRows.push(val);
			//}


		});

	}


	fundsLoading: boolean;
	getFundList() {
		this.fundsLoading = true;
		this.fundService.getFundNamesList({}).subscribe(result => {
			let resp = result["body"];
			if (resp != null && result.code == "OK") {
				this.fundList = resp.fundList;
			}
			this.fundsLoading = false;
		}, error => {
			this.accountService.redirectToLogin(error);
			this.fundsLoading = false;
		})
	}
	displayUpdateConfirmationDialog: boolean = false;
	openConfirmationModal() {
		
		var dealsToUpdate = this.fundHoldingUpdateDetails.cashflowCalculationDetails.filter(function (item: any) {
			return item.dealId != null && item.dealId > 0;
		})
		if (dealsToUpdate.length > 0) {
			this.displayUpdateConfirmationDialog = true;
		}
		else {
			this.saveDataFlag();
		}

	}

	onFundChange(event: any) {

		this.cashflowData = [];
		this.cashflowFileId = undefined;
		this.realizeData = [];
		this.unRealizeData = [];
		this.fundName = "";
		this.onCancel(event);
		this.enableSaveButton = true;
	}
	onCancel(event: any) {
		
		this.value = 0;
		this.cancel = true;
		clearInterval(this.interval);
		this.ProgressCancel = true;
	}

	DownloadTemplate() {
		
		this.fileUploadService.exportTemplates({ moduleType: 'CashFlow' }).subscribe(response => {
			if (response.ok) {
				this.miscService.downloadExcelFile(response);
			}
			else {
				this.msgs = this.miscService.showAlertMessages('error', "File is not downloaded.");
			}
			this.loading = false;
			// this.queryPreview("export");
		},
			error => {
				this.msgs = this.miscService.showAlertMessages('error', "Something went wrong. Please check the query and try again.");
				this.loading = false;
				// this.queryPreview("export");
			});
	}
}