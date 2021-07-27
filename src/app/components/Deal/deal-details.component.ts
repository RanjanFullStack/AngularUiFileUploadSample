import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { NgbModal, NgbModalOptions } from "@ng-bootstrap/ng-bootstrap";
import { Message } from "primeng/components/common/api";
import { MessageService } from "primeng/components/common/messageservice";
import { LazyLoadEvent } from "primeng/primeng";
import { AccountService } from "../../services/account.service";
import { DealService } from "../../services/deal.service";
import { FinancialValueUnitsEnum, MiscellaneousService } from "../../services/miscellaneous.service";
import { FeaturesEnum } from "../../services/permission.service";
import { PortfolioCompanyService } from "../../services/portfolioCompany.service";
import { SavePortfolioFundHoldingComponent } from "./portfolio-fundHolding.component";


@Component({
	selector: 'deal-details',
	templateUrl: './deal-details.component.html',
	providers: [SavePortfolioFundHoldingComponent, MessageService]
})


export class DealDetailsComponent implements OnInit {
	feature: typeof FeaturesEnum = FeaturesEnum;
	financialValueUnits: typeof FinancialValueUnitsEnum = FinancialValueUnitsEnum;
	msgs: Message[] = [];
	id: any;
	dataTable: any;
	masterFundHoldingModel: any = {};
	blockedPortfolioCompanyFundHoldingTable: any = [];
	portfolioCompanyFundHolding: any[] = [];
	portfolioCompanyFundHoldingClone: any[] = [];
	totalPortfolioCompanyFundHoldingRecords: any;
	blockedPortfolioCompanyProfitabilityTable: any = [];
	portfolioCompanyProfitability: any = [];
	portfolioCompanyProfitabilityClone: any[]=[];
	totalPortfolioCompanyProfitabilityRecords: any;
	model: any = {};
	fundHoldingModel: any = {};
    loading = false;
    pagerLength: any;
	msgTimeSpan: number;
	holdingValueUnit: FinancialValueUnitsEnum = FinancialValueUnitsEnum.Thousands;
	showHoldingValueDecimals: boolean = true;
	profitabilityValueUnit: FinancialValueUnitsEnum = FinancialValueUnitsEnum.Thousands;
	showProfitabilityValueDecimals: boolean = true;
	profitabilityMultiSortMeta: any[] = [{ field: "year", order: -1 }, { field: "quarter", order: -1 }];
	fundHoldingMultiSortMeta: any[] = [{ field: "year", order: -1 }, { field: "quarter", order: -1 }];
	
	constructor(
		private accountService: AccountService, private miscService: MiscellaneousService,
		private dealService: DealService, protected changeDetectorRef: ChangeDetectorRef, private _avRoute: ActivatedRoute, private modalService: NgbModal, private portfolioCompanyService: PortfolioCompanyService) {
		if (this._avRoute.snapshot.params["id"]) {
			this.id = this._avRoute.snapshot.params["id"];
		}
        this.pagerLength = this.miscService.getSmallPagerLength();
        this.msgTimeSpan = this.miscService.getMessageTimeSpan();
    }
    sourceURL: any;
	ngOnInit() {

        this.sourceURL = this.miscService.GetPriviousPageUrl();
		if (this.id != undefined) {
			this.getDealDetails();
		}

	}

    getDealDetails() {
       //debugger;
		this.loading = true;
		//get user details by user id
		this.getMasterPortfolioFundHoldingModel();
		this.dealService.getDealsList({ encryptedDealID: this.id, includeAllDetails:true })
			.subscribe(result => {
				let resp = result["body"];
				if (resp != null && result.code == "OK") {
					this.model = resp.dealList[0];
					this.fundHoldingModel.dealID = this.model.dealID
					this.fundHoldingModel.investementDate = new Date(this.model.investmentDate);
					this.loading = false;
					//this.getPortfolioCompanyFundHoldingList(null);
					//this.getPortfolioCompanyProfitabilityList(null);
				}
				else {
					if (result.message != "") {						
						this.msgs = this.miscService.showAlertMessages('error', resp.status.message);
					}
				}

				this.loading = false;
			}, error => {
				this.accountService.redirectToLogin(error);
				this.loading = false;
			});
	}

	getPortfolioCompanyFundHoldingList(event: any) {

		if (event == null) {
			event = { first: 0, rows: 10, globalFilter: null, sortField: "year-quarter", multiSortMeta: this.fundHoldingMultiSortMeta, sortOrder: -1 };
		}


		this.blockedPortfolioCompanyFundHoldingTable = true;
		this.dealService.getPortfolioCompanyFundHolding({ DealID: this.model.dealID, paginationFilter: event }).subscribe(result => {

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




	getPortfolioCompanyProfitabilityList(event: any) {

		if (event == null) {
			event = { first: 0, rows: 10, globalFilter: null, sortField: "year-quarter", multiSortMeta: this.profitabilityMultiSortMeta, sortOrder: -1 };
		}


		this.blockedPortfolioCompanyProfitabilityTable = true;
		this.portfolioCompanyService.getPortfolioCompanyProfitabilityList({ encryptedDealId: this.id, paginationFilter: event }).subscribe(result => {

			let resp = result["body"];// JSON.parse(result._body);
			if (resp != null && result.code == "OK") {
				this.portfolioCompanyProfitability = resp.portfolioCompanyProfitabilityList;
				this.portfolioCompanyProfitabilityClone = JSON.parse(JSON.stringify(this.portfolioCompanyProfitability))
				this.totalPortfolioCompanyProfitabilityRecords = resp.totalRecords;
			}
			else {
				this.portfolioCompanyProfitability = [];
				this.totalPortfolioCompanyProfitabilityRecords = 0;
			}
			this.blockedPortfolioCompanyProfitabilityTable = false;
		}, error => {
			this.blockedPortfolioCompanyProfitabilityTable = false;
			this.accountService.redirectToLogin(error);

		});
	}

	convertProfitabilityValueUnits() {

		setTimeout(function (local: any) {
			local.portfolioCompanyProfitability = [];
			local.portfolioCompanyProfitabilityClone.forEach(function (value: any) {
				var valueClone = JSON.parse(JSON.stringify(value));
				switch (+local.profitabilityValueUnit) {
					case FinancialValueUnitsEnum.Thousands:
						break;
					case FinancialValueUnitsEnum.Millions:
						valueClone.ebitda = (valueClone.ebitda / 1000).toFixed(2);
						valueClone.netDebt = (valueClone.netDebt / 1000).toFixed(2);
						valueClone.revenue = (valueClone.revenue / 1000).toFixed(2);
						break;
					case FinancialValueUnitsEnum.Billions:
						valueClone.ebitda = (valueClone.ebitda / 1000000).toFixed(2);
						valueClone.netDebt = (valueClone.netDebt / 1000000).toFixed(2);
						valueClone.revenue = (valueClone.revenue / 1000000).toFixed(2);
						break;
				}
				local.portfolioCompanyProfitability.push(valueClone);
			});
		}, 10, this)

	}



	loadPortfolioFundHoldingLazy(event: LazyLoadEvent) {

		this.getPortfolioCompanyFundHoldingList(event);
	}

	loadPortfolioProfitabilityLazy(event: LazyLoadEvent) {

		this.getPortfolioCompanyProfitabilityList(event);
	}

	getMasterPortfolioFundHoldingModel() {
		this.dealService.GetMasterPortfolioFundHoldingModel().subscribe(result => {
			this.masterFundHoldingModel = result["body"];
			
		}, error => {
			this.accountService.redirectToLogin(error);
			this.loading = false;
			})
	}
	modalOption: NgbModalOptions = {};
	currentModelRef: any
	open(fundHoldingModel: any) {
		this.modalOption.backdrop = 'static';
		this.modalOption.keyboard = false;
		this.modalOption.size = 'lg';
		this.modalOption.centered = true;

		let copy = JSON.parse(JSON.stringify(fundHoldingModel))
		this.currentModelRef = this.modalService.open(SavePortfolioFundHoldingComponent, this.modalOption);
		this.currentModelRef.componentInstance.model = copy;
		this.currentModelRef.componentInstance.fundHoldingList = this.portfolioCompanyFundHolding;
		this.currentModelRef.componentInstance.masterModel = this.masterFundHoldingModel;
		this.currentModelRef.componentInstance.dealModel = this.model;
		this.currentModelRef.componentInstance.onSave.subscribe((data:any) => {
			this.close(data);
		});
	}

	close(data:any) {
		
		this.getPortfolioCompanyFundHoldingList(event);
		this.currentModelRef.close();
		this.msgs = this.miscService.showAlertMessages('success', data.message);
		
	}
	
}