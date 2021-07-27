import { ChangeDetectorRef, Component, Input, OnChanges, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { NgxSpinnerService } from "ngx-spinner";
import { Message } from "primeng/components/common/api";
import { MessageService } from "primeng/components/common/messageservice";
import { SelectItem } from "primeng/components/common/selectitem";
import { AccountService } from "../../services/account.service";
import { FundService } from "../../services/funds.service";
import { MiscellaneousService } from "../../services/miscellaneous.service";
import { PortfolioCompanyService } from "../../services/portfolioCompany.service";
import { ReportCategory, ReportService, ReportType } from "../../services/report.service";



@Component({
	selector: 'company-financials',
	templateUrl: './company-financials.report.html',
	//	template: `
	//      <h2>Bar Chart</h2>
	//<div #divBarChart ></div>
	//    `,
	providers: [MessageService]
})

export class CompanyFinancialsReportComponent implements OnInit, OnChanges {
	@Input() masterModel: any = {};
	reportForm: FormGroup;
	fundList: any[];
	portfolioCompanyList: any[];
	regionList: any[];
	countryList: any[];
	strategyList: any[];
	msgTimeSpan: number;
	fundsLoading: boolean;
	strategyLoading: boolean;
	regionLoading: boolean;
	countryLoading: boolean;
	portfolioCompanyLoading: boolean;
	sectorWiseOperationalKPIsLoading: boolean;
	yearRange: any;
	viewByList: SelectItem[];
	holdingsByList: SelectItem[];
	cols: any[] = [];
	msgs: Message[] = [];
	reportType: typeof ReportType = ReportType;
	reportCategory: typeof ReportCategory = ReportCategory;
	reportData: any = [];
	dateRange: any[];
	filterSection: boolean = true;
	showKPIFilter: boolean = false;
	hostElement: any;
	svg: any;
	data: any[] = [];
	xField: any = "";
	yField: any = "";
	today: Date;
    sectorWiseOperationalKPIs: any[] = [];
    financialReport_AsOfDate: any;
	model: any = {
		fundIds: [],
		strategyIds: [],
		regionIds: [],
		countryIds: [],
		isAscending: false,
		portfolioCompany: null,
		selectedReportTypes: [this.reportType.CompanyRevenueGrowth],
		chartMetadetaList: []
	};
    loading : boolean = false;
	constructor(private reportService: ReportService, private miscService: MiscellaneousService, private accountService: AccountService, private fundService: FundService, 
		private portfolioCompanyService: PortfolioCompanyService, protected changeDetectorRef: ChangeDetectorRef, private spinner: NgxSpinnerService) {

		this.msgTimeSpan = this.miscService.getMessageTimeSpan();
		var year = new Date();
		this.today = year;
		this.yearRange = "2000:" + year.getFullYear();
		this.setReportTypeList();
	}
	ngOnInit() {
		//this.getTopHoldingReports();
	}
	ngOnChanges() {
	}

	bindReportMasterModel() {
		this.fundList = this.masterModel.fundList;
		this.fundsLoading = false;
		this.strategyList = this.masterModel.strategyList;
		this.strategyLoading = false;
		this.regionList = this.masterModel.regionList;
		this.regionLoading = false;
		this.countryList = this.masterModel.countryList;
		this.countryLoading = false;
		this.portfolioCompanyList = this.masterModel.portfolioCompanyList;
		this.portfolioCompanyLoading = false;
		
		this.setReportTypeList();
		this.getCompanyFinancialReports();
		this.masterModel.filterSection = true;
	}

	getCompanyFinancialReports() {
		this.loading = true;
		this.reportService.getReportData(this.model)
			.subscribe(result => {
				this.selectedKPIs = this.model.sectorwiseOperationalKPIs;
				this.reportData = result["body"];
				var local = this;
              
				if (local.reportData.length > 0) {
					local.reportData.forEach(function (val: any, i: any) {
						let titles = local.reportService.ReportTypeList.filter(function (ele: any, i: any) {
							return val.ReportType == ele.value;
						})

						if (val.ReportType == local.reportType.CompanyOperationalKPIGrowth) {
                            val.KPIReports = [];
                            let asOfDate = '';
							let kpiList = Array.from(new Set(val.Results.map((item: any) => item.KPI)));
							kpiList.forEach(function (el:any) {
								let kpiReport=val.Results.filter(function (rpt: any) {
									return el == rpt.KPI;
                                })
                                asOfDate = kpiReport.map(function (e: any) { return e.AsofDate; }).sort().reverse()[0];
                                var d: any = { data: kpiReport, title: el, asOfDate: asOfDate};
								if (kpiReport.length > 0) {
									d.unit = kpiReport[0].Info;
								}
								val.KPIReports.push(d);
                            })

						}

						if (titles.length > 0) {
							val.title = titles[0].label;
							val.category = titles[0].category;
						}
						val.cols = [];
						val.Columns.forEach(function (value: any, i: any) {
							val.cols.push({ field: value, header: value });
						})

						val.shrinkSize = false;
						
                        val.chartData = val.Results;
                        if (val.chartData != undefined && local.reportType.CompanyFinancialKPIReport)
                            local.financialReport_AsOfDate = val.chartData.map(function (e: any) { return e.AsofDate; }).sort().reverse()[0];

					});

					if (local.reportData != null && local.reportData.length > 0) {
						local.model.chartMetadetaList = [{ chartName: local.reportData[0].title, chartType: "LineMarkers", colNameX: local.reportData[0].Columns[0], colNameY: local.reportData[0].Columns[2] },
							{ chartName: local.reportData[0].title, chartType: "ColumnClustered", colNameX: local.reportData[0].Columns[0], colNameY: local.reportData[0].Columns[1] }];
					}
				}

				this.spinner.hide();
				this.CheckIfNoDataInReport();
				this.loading = false;
			}, error => {
				this.accountService.redirectToLogin(error);
				this.CheckIfNoDataInReport();
				this.spinner.hide();
				this.loading = false;
			});
	}

	CheckIfNoDataInReport() {
		if (this.reportData != null && this.reportData.length > 0) {
			let availableDataReports = this.reportData.filter(function (data: any) {
				return data.Results != null && data.Results.length > 0
			})
			if (availableDataReports.length == 0) {
				this.reportService.setDataAvailabilityInReport(false);
			}
			else {
				this.reportService.setDataAvailabilityInReport(true);
			}
		}
		else {
			this.reportService.setDataAvailabilityInReport(false);
		}
	}


	getFundList() {
		this.fundsLoading = true;
		this.fundService.getFundsList({}).subscribe(result => {
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

	getStrategyList() {

		this.strategyLoading = true;
		this.miscService.getStrategyList().subscribe(result => {
			let resp = result["body"];// JSON.parse(result._body);
			if (resp != null && result.code == "OK") {
				this.strategyList = resp.strategyList;
			}
			this.strategyLoading = false;
		}, error => {
			this.strategyLoading = false;
			this.accountService.redirectToLogin(error);

		});
	}

	getRegionList() {

		this.regionLoading = true;
		this.miscService.getRegionList().subscribe(result => {
			let resp = result["body"];
			this.regionList = result["body"];
			//}
			this.regionLoading = false;
		}, error => {
			this.regionLoading = false;
			this.accountService.redirectToLogin(error);

		});
	}

	getCountryList() {

		this.countryLoading = true;
		this.miscService.getCountryList().subscribe(result => {
			let resp = result["body"];
			this.countryList = result["body"];
			this.countryLoading = false;
		}, error => {
			this.countryLoading = false;
			this.accountService.redirectToLogin(error);

		});
	}

	

	onRegionChange() {
		this.GetCountryListByRegionIds();
	}

	GetCountryListByRegionIds() {

		this.countryLoading = true;
		this.model.countryIds = [];
		this.countryList = [];
		let regionIds = (this.model.regionIds != undefined && this.model.regionIds.length > 0) ? this.model.regionIds : [];
		this.miscService.getCountryListByRegionIds(regionIds)
			.subscribe((data) => {
				this.countryList = data["body"];
				this.countryLoading = false;
			}, error => { this.countryLoading = false; this.accountService.redirectToLogin(error); })
	}

    getOperationalKPIs() {
		this.sectorWiseOperationalKPIsLoading = true;
		this.portfolioCompanyService.GetOperationalKPIList(this.model.portfolioCompany.portfolioCompanyID)
			.subscribe(result => {
				let resp = result["body"];
				if (resp != null && result.code == "OK") {
					this.sectorWiseOperationalKPIs = resp;
					
				}
				this.sectorWiseOperationalKPIsLoading = false;
				
			}, error => {
				this.accountService.redirectToLogin(error);
				this.sectorWiseOperationalKPIsLoading = false;
				
			});
	}

    onCompanyChange() {
		this.getOperationalKPIs();
		if (!this.showKPIFilter) {
			this.getCompanyFinancialReports();
		}
		else {
		}
	}

	onKPIChange() {
	}
	selectedKPIs: any[] = [];
    search(form: any) {
		this.getCompanyFinancialReports();
	}

    changeReportType(e: any) {
		if (e.item == this.reportType.CompanyOperationalKPIGrowth) {
			this.showKPIFilter = true;
		}
		else {
			this.showKPIFilter = false;
		}
		this.model.selectedReportTypes = [e.item];
		this.getCompanyFinancialReports();
	}



	setReportTypeList() {

		let holdingsByList = this.reportService.ReportTypeList.filter(function (ele: any, i: any) {
			return ele.category == ReportCategory.CompanyFinancials
		})
		this.holdingsByList = JSON.parse(JSON.stringify(holdingsByList));
		this.holdingsByList = this.holdingsByList.filter(function (ele: any, i: any) {
			delete ele.category;
			return ele;
		})

		this.model.selectedReportTypes = [this.holdingsByList[0].value];

	}
	minDate: Date | null = null;

	onDateSelect() {
		this.model.fromDate = null;
		this.model.toDate = null;
		if (this.dateRange.length > 0) {
			let toDate = this.dateRange[1];
			if( new Date(this.dateRange[0]).toDateString() == ( new Date(this.dateRange[1])).toDateString() && new Date(this.dateRange[0]).toDateString() == ( new Date(this.today)).toDateString()){
                this.model.fromDate =this.dateRange[0];
                this.model.toDate = this.dateRange[1];
            }
            else if( new Date(this.dateRange[0]).toDateString() == ( new Date(this.today)).toDateString()){
                this.model.fromDate = null;
                this.model.toDate = this.dateRange[0];
                this.minDate = this.today;
            }
			else if (toDate == null) {
				this.model.fromDate = null;
				this.model.toDate = this.dateRange[0];
				this.minDate = (new Date(this.model.toDate));
				this.minDate.setDate(this.minDate.getDate() + 1); 
			}
			else {
				if ((new Date(this.dateRange[0])).toDateString() == (new Date(this.dateRange[1])).toDateString()) {
					this.dateRange.pop();
					this.model.toDate = this.dateRange[0];
					this.minDate = (new Date(this.model.toDate));
					this.minDate.setDate(this.minDate.getDate() + 1);
				}
				else {
					this.model.fromDate = this.dateRange[0];
					this.model.toDate = this.dateRange[1];
					this.minDate = null;
				}
			}
		}
	}

	onDateClear() {
		this.minDate = null;
		//this.dateRange = [];
		this.model.fromDate = null;
		this.model.toDate = null;
	}

    resetForm(form: any) {
		let reportTypes: any[] = [];
		if (this.model.selectedReportTypes != undefined) {
			reportTypes = JSON.parse(JSON.stringify(this.model.selectedReportTypes));
		}

		form.resetForm();
		this.changeDetectorRef.detectChanges();

		this.model = {
			fundIds: [],
			strategyIds: [],
			regionIds: [],
			countryIds: [],
			isAscending: false,
			portfolioCompany: null,
			selectedReportTypes: [this.reportType.CompanyRevenueGrowth]
		};
		if (reportTypes != null && reportTypes.length > 0) {
			this.model.selectedReportTypes = reportTypes;
		}

		this.minDate = null;
		this.getCompanyFinancialReports();
	}

	showHideFilter() {
		this.masterModel.filterSection = this.masterModel.filterSection == true ? false : true;

	}


}