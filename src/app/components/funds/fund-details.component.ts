import { Component, OnInit ,ViewChild} from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { AccountService } from "../../services/account.service";
import { FundService } from "../../services/funds.service";
import { FormBuilder } from "@angular/forms";
import { NgbModal, NgbModalOptions  } from "@ng-bootstrap/ng-bootstrap";
import { AddFundTrackRecordComponent } from "./fund-trackRecord.component";
import { ChangeDetectorRef } from "@angular/core";
 
import { DealService } from "../../services/deal.service";
import { LazyLoadEvent } from "primeng/primeng";
import { Message } from "primeng/components/common/api";
import { MessageService } from "primeng/components/common/messageservice";
import { MiscellaneousService, FinancialValueUnitsEnum } from "../../services/miscellaneous.service";
import { FeaturesEnum } from "../../services/permission.service";
import { ReportType, ReportService } from "../../services/report.service";


@Component({
	selector: 'fund-details',
	templateUrl: './fund-details.component.html',
	providers: [AddFundTrackRecordComponent, MessageService]
})


export class FundDetailsComponent implements OnInit {
	feature: typeof FeaturesEnum = FeaturesEnum;
	financialValueUnits: typeof FinancialValueUnitsEnum = FinancialValueUnitsEnum;
	msgs: Message[] = [];
	id: any;
	dataTable: any;
	deals: any = [];
	fundTrackRecords: any = [];
	fundTrackRecordsClone: any[] = [];
	portfolioCompanyFundHolding: any = [];
	portfolioCompanyFundHoldingClone: any[] = [];
    pagerLength: any;
	geographicLocation: any = { isHeadquarter: false };
	model: any = {};
	fundTrackRecordModel: any = {};
	loading = false;

	blockedDealsTable: boolean = false;
	totalDealRecords: number;
	blockedTrackRecordTable: boolean = false;
	blockedPortfolioCompanyFundHoldingTable: boolean = false;
	totalTrackRecords: number;
	totalPortfolioCompanyFundHoldingRecords: number;
	msgTimeSpan: any;

	currentFundHoldingQuarter: string;
	currentFundHoldingYear: number;
	displayCompanyFundHoldingsDialog: boolean = false;
	trackRecordValueUnit: FinancialValueUnitsEnum = FinancialValueUnitsEnum.Thousands;
	showTrackRecordValueDecimals: boolean = true;
	holdingValueUnit: FinancialValueUnitsEnum = FinancialValueUnitsEnum.Thousands;
	showHoldingValueDecimals: boolean = true;
	fundTrakRecordMultiSortMeta: any[] = [{ field: "year", order: -1 }, { field: "quarter", order: -1 }];
	fundHoldingMultiSortMeta: any[] = [{ field: "year", order: -1 }, { field: "quarter", order: -1 }];

	chart1Data: any[] = [{
		'Sector': 'Enregy',
		'Capital Invested': 45.25
	}, {
		'Sector': 'Financials',
		'Capital Invested': 35.01
	}, {
		'Sector': 'Metals & Mining',
		'Capital Invested': 85.78
	}, {
		'Sector': 'Industrials',
		'Capital Invested': 50.00
	}, {
		'Sector': 'Healthcare',
		'Capital Invested': 68.25
	}, {
		'Sector': 'Materials',
		'Capital Invested': 10.22
	}];

	chart2Data: any[] = [{
		'Sector': 'Enregy',
		'Total Value': 50.25
	}, {
		'Sector': 'Financials',
		'Total Value': 40.01
	}, {
		'Sector': 'Metals & Mining',
		'Total Value': 25.78
	}, {
		'Sector': 'Industrials',
		'Total Value': 30.00
	}, {
		'Sector': 'Healthcare',
		'Total Value': 69.25
	}, {
		'Sector': 'Materials',
		'Total Value': 80.22
	}];

	constructor(
		private accountService: AccountService, private miscService: MiscellaneousService,
		private fundService: FundService, protected changeDetectorRef: ChangeDetectorRef, private _dealService: DealService, private reportService: ReportService,
		private _avRoute: ActivatedRoute, private modalService: NgbModal) {
		if (this._avRoute.snapshot.params["id"]) {
			this.id = this._avRoute.snapshot.params["id"];
		}
		this.msgTimeSpan = this.miscService.getMessageTimeSpan();
        this.pagerLength = this.miscService.getSmallPagerLength();
    }
    sourceURL: any;
    ngOnInit() {
        this.sourceURL = this.miscService.GetPriviousPageUrl();
		if (this.id != undefined) {
			
			this.getFundDetails();
			
		}
	} 
	 
    getFundDetails() {
		
        //debugger;;
		this.loading = true;
		//get user details by user id
		// Value: this.id
		this.fundService.getFundById({  EncryptedFundId : this.id, PaginationFilter : null   })
			.subscribe(result => {
				let resp = result["body"] ;
				if (resp != null && result.code == "OK") {
					this.model = resp.fundList[0];
					this.getChartData();
					this.fundTrackRecordModel.fundDetailsID = this.model.fundID
					this.loading = false;
					this.getDeals(null);
					this.getFundTrackRecords(null);
				}
				else {
					if (resp.status != null && resp.status.message != "") {
						this.msgs = this.miscService.showAlertMessages('error', resp.status.message);
					}
				}

				this.loading = false;
			}, error => {
				this.accountService.redirectToLogin(error);
				this.loading = false;
			});
	}

	getDeals(event: any) {

		if (event == null) {
			event = { first: 0, rows: 10, globalFilter: null };
		}

        //debugger;;
		this.blockedDealsTable = true;
		this._dealService.getDealsList({ fundID: this.model.fundID, paginationFilter: event }).subscribe(result => {

			let resp = result["body"] ;// JSON.parse(result._body);
			if (resp != null && result.code == "OK") {
				this.deals = resp.dealList;
				this.totalDealRecords = resp.totalRecords;
			}
			else {
				this.deals = [];
				this.totalDealRecords = 0;
			}
			this.blockedDealsTable = false;
		}, error => {
			this.blockedDealsTable = false;
			this.accountService.redirectToLogin(error);

		});
	}

	getFundTrackRecords(event: any) {
        //debugger;
		if (event == null) {
			event = { first: 0, rows: 10, globalFilter: null, multiSortMeta: this.fundTrakRecordMultiSortMeta };
		}
        
		this.blockedTrackRecordTable = true;
		this.fundService.getFundTrackRecordList({ fundDetailsID: this.model.fundID, paginationFilter: event }).subscribe(result => {

			let resp = result["body"] ;// JSON.parse(result._body);
			if (resp != null && result.code == "OK") {
				this.fundTrackRecords = resp.fundTrackRecordList;
				this.fundTrackRecordsClone = JSON.parse(JSON.stringify(this.fundTrackRecords))
				this.totalTrackRecords = resp.totalRecords;
			}
			else {
				this.fundTrackRecords = [];
				this.totalTrackRecords = 0;
			}
			this.blockedTrackRecordTable = false;
		}, error => {
			this.blockedTrackRecordTable = false;
			this.accountService.redirectToLogin(error);

		});
	}

	convertTrackRecordValueUnits() {

		setTimeout(function (local: any) {
			local.fundTrackRecords = [];
			local.fundTrackRecordsClone.forEach(function (value: any) {
				var valueClone = JSON.parse(JSON.stringify(value));
				switch (+local.trackRecordValueUnit) {
					case FinancialValueUnitsEnum.Thousands:
						break;
					case FinancialValueUnitsEnum.Millions:
						valueClone.totalInvestedCost = (valueClone.totalInvestedCost / 1000).toFixed(2);
						valueClone.totalRealizedValue = (valueClone.totalRealizedValue / 1000).toFixed(2);
						valueClone.totalUnRealizedValue = (valueClone.totalUnRealizedValue / 1000).toFixed(2);
						valueClone.totalValue = (valueClone.totalValue / 1000).toFixed(2);
						break;
					case FinancialValueUnitsEnum.Billions:
						valueClone.totalInvestedCost = (valueClone.totalInvestedCost / 1000000).toFixed(2);
						valueClone.totalRealizedValue = (valueClone.totalRealizedValue / 1000000).toFixed(2);
						valueClone.totalUnRealizedValue = (valueClone.totalUnRealizedValue / 1000000).toFixed(2);
						valueClone.totalValue = (valueClone.totalValue / 1000000).toFixed(2);
						break;
				}
				local.fundTrackRecords.push(valueClone);
			});
		}, 10, this)

	}

	getPortfolioCompanyFundHoldingList(event: any) {
		this.portfolioCompanyFundHolding = [];
		if (event == null) {
			event = { first: 0, rows: 10, globalFilter: null, multiSortMeta: this.fundHoldingMultiSortMeta };
		}

		this.blockedPortfolioCompanyFundHoldingTable = true;
		this._dealService.getPortfolioCompanyFundHolding({ quarter: this.currentFundHoldingQuarter, year: this.currentFundHoldingYear, fundIds: [this.fundTrackRecordModel.fundDetailsID], DealID: this.model.dealID, paginationFilter: event }).subscribe(result => {

			let resp = result["body"];// JSON.parse(result._body);
			if (resp != null && result.code == "OK") {
				this.portfolioCompanyFundHolding = resp.portfolioCompanyFundHoldingList;
				this.portfolioCompanyFundHoldingClone = JSON.parse(JSON.stringify(this.portfolioCompanyFundHolding))
				this.totalPortfolioCompanyFundHoldingRecords = resp.totalRecords;
			}
			else {
				this.portfolioCompanyFundHolding = [];
				this.totalPortfolioCompanyFundHoldingRecords = 0;
			}
			this.blockedPortfolioCompanyFundHoldingTable = false;
		}, error => {
			this.blockedPortfolioCompanyFundHoldingTable = false;
			this.accountService.redirectToLogin(error);

		});
	}

	convertFundHoldingValueUnits() {

		setTimeout(function (local: any) {
			local.portfolioCompanyFundHolding = [];
			local.portfolioCompanyFundHoldingClone.forEach(function (value: any) {
				var valueClone = JSON.parse(JSON.stringify(value));
				switch (+local.holdingValueUnit) {
					case FinancialValueUnitsEnum.Thousands:
						break;
					case FinancialValueUnitsEnum.Millions:
						valueClone.investmentCost = (valueClone.investmentCost / 1000).toFixed(2);
						valueClone.realizedValue = (valueClone.realizedValue / 1000).toFixed(2);
						valueClone.unrealizedValue = (valueClone.unrealizedValue / 1000).toFixed(2);
						valueClone.totalValue = (valueClone.totalValue / 1000).toFixed(2);
						break;
					case FinancialValueUnitsEnum.Billions:
						valueClone.investmentCost = (valueClone.investmentCost / 1000000).toFixed(2);
						valueClone.realizedValue = (valueClone.realizedValue / 1000000).toFixed(2);
						valueClone.unrealizedValue = (valueClone.unrealizedValue / 1000000).toFixed(2);
						valueClone.totalValue = (valueClone.totalValue / 1000000).toFixed(2);
						break;
				}
				local.portfolioCompanyFundHolding.push(valueClone);
			});
		}, 10, this)

	}

	loadFundHoldingsLazy(event: LazyLoadEvent) {
		if (this.displayCompanyFundHoldingsDialog) {
			this.getPortfolioCompanyFundHoldingList(event);
		}
	}


	loadDealsLazy(event: LazyLoadEvent) {

		//this.getDeals(event);
	}

	loadTrackRecordsLazy(event: LazyLoadEvent) {

		//this.getFundTrackRecords(event);
	}

	modalOption: NgbModalOptions = {};
	currentModelRef :any
	open(trackRecordModel: any) {

		this.modalOption.backdrop = 'static';
		this.modalOption.keyboard = false;
		this.modalOption.size= 'lg';
		this.modalOption.centered = true;

		let copy = JSON.parse(JSON.stringify(trackRecordModel))
		this.currentModelRef = this.modalService.open(AddFundTrackRecordComponent, this.modalOption);
		this.currentModelRef.componentInstance.model = copy;
		this.currentModelRef.componentInstance.trackRecordList = this.fundTrackRecords;
		this.currentModelRef.componentInstance.onSave.subscribe((status:any) => {
			this.close(status);
		});
	}

	close(status: any) {
        this.getFundTrackRecords(null);
		this.currentModelRef.close();
		this.msgs = this.miscService.showAlertMessages('success', status.message);
		
	}


	openFunHoldingDetailForQuarter(fundTrackRecord: any) {
		this.currentFundHoldingQuarter = fundTrackRecord.quarter;
		this.currentFundHoldingYear = fundTrackRecord.year;
		this.displayCompanyFundHoldingsDialog = true;
		this.getPortfolioCompanyFundHoldingList(null);
	}


    sectorwiseHoldingValues: any;
    sectorwiseHoldingValues_AsOfDate: any;
    fundPerformanceData: any;
    fundPerformanceData_AsOfDate: any;
	chartDataLoading: boolean = false;
	getChartData() {
		this.chartDataLoading = true;
		let reportModel = { fundIds: [{ fundID: this.model.fundID }], selectedReportTypes: [ReportType.QuarterlyTVPI_IRR_FundDetails, ReportType.SectorwiseValues_FundDetails] }
		this.reportService.getReportData(reportModel)
			.subscribe(result => {
				var local = this;
				result["body"].forEach(function (report: any) {
					if (report.ReportType == ReportType.QuarterlyTVPI_IRR_FundDetails) {
                        local.fundPerformanceData = report.Results;
                        local.fundPerformanceData_AsOfDate = local.fundPerformanceData.map(function (e: any) { return e.ValuationDate; }).sort().reverse()[0];
					}

					if (report.ReportType == ReportType.SectorwiseValues_FundDetails) {
                        local.sectorwiseHoldingValues = report.Results;
                        local.sectorwiseHoldingValues_AsOfDate = local.sectorwiseHoldingValues.map(function (e: any) { return e.AsofDate; }).sort().reverse()[0];
					}
					
				});
				this.chartDataLoading = false;
			}, error => {
				this.accountService.redirectToLogin(error);
				this.chartDataLoading = false;
			});

	}

}