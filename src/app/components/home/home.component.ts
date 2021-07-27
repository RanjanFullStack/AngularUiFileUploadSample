import { Component, OnChanges, OnInit } from '@angular/core';
import { AccountService } from '../../services/account.service';
import { MiscellaneousService } from '../../services/miscellaneous.service';
import { ReportService, ReportType } from '../../services/report.service';


@Component({
    selector: 'home',
    templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit, OnChanges {
    model: any;
    reportData: any[];
    fundgrowthPieChartData: any[] = [];
    fundgrowthBarChartData: any[] = [];
    fundgrowthLineChartData: any[] = [];
    strategyUnrealizedValueData: any[] = [];
    strategyTotalValueData: any[] = [];
    sectorWiseAttributionData: any[] = [];
    sectorData: any[] = [];
    sectorWiseInvestements_AsOfDate: any;
    sectorWiseAttribution_AsOfDate: any;
    regionWiseInvestements_AsOfDate: any;
    strategyTotalValueData_AsOfDate: any;
    strategyUnrealizedValue_AsOfDate: any;
    top10PC_AsOfDate: any;
    regionData: any[] = [];
    topCompanyData: any[] = [];
    regionList: any[] = [];
    defaultFund: any;
    selectedRegion: string = "Americas";
    totalFunds: any;
    totalPortfolioCompanies: any;
    totalInvestedCapital: any;
    totalRealizedValue: any;
    totalUnrealizedValue: any;
    totalValue: any;
    dataLoaded: boolean = false;
    isWorldMapVisible: boolean = true;
    constructor(private reportService: ReportService, private miscService: MiscellaneousService, private accountService: AccountService) {
        this.getTotalCounts();
    }
    ngOnChanges() {

    }
    ngOnInit() {

        this.model = { selectedReportTypes: [ReportType.SectorWiseInvestmentAndGrowth_DB, ReportType.RegionWiseInvestementAndGrowth_DB, ReportType.Top10CompanyByTotalValue_DB, ReportType.TotalValueByStrategy_DB, ReportType.UnrealizedValueByStrategy_DB, ReportType.AttributionBySector], regionIds: [{ regionId: 5 }] }
        this.miscService.getJSON("assets/config.json").subscribe(data => {
            this.isWorldMapVisible = data.IsWorldMapVisibleOnDashboard == "true";
            if (!this.isWorldMapVisible) {
                let index = this.model.selectedReportTypes.indexOf(ReportType.AttributionBySector);
                this.model.selectedReportTypes.splice(index, 1);
            }
            this.getFundWiseGrowthReports();
        }, error => console.log(error));

        this.getRegionList();


    }

    getFundWiseGrowthReports() {


        this.reportService.getReportData(this.model)
            .subscribe(result => {
                
                this.reportData = result["body"];
                var local = this;
                if (this.reportData != null) {
                    this.reportData.forEach(function (report: any, reportIndex: any) {
                        //debugger
                        if (report.ReportType == ReportType.SectorWiseInvestmentAndGrowth_DB) {
                            local.sectorData = report.Results;
                            local.sectorWiseInvestements_AsOfDate = local.sectorData.map(function (e: any) { return e.AsOfDate; }).sort().reverse()[0];
                        }

                        if (report.ReportType == ReportType.RegionWiseInvestementAndGrowth_DB) {
                            local.regionData = report.Results;
                            //debugger;
                            // local.regionData[0]["Total Value"] = 15.79;                                 //TODO: Remove this hardcoded value
                            local.regionWiseInvestements_AsOfDate = local.regionData.map(function (e: any) { return e.AsOfDate; }).sort().reverse()[0];

                        }
                        if (report.ReportType == ReportType.Top10CompanyByTotalValue_DB) {
                            local.topCompanyData = report.Results;// local.miscService.sortArrayDesc(report.Results, "TotalValue"); ;
                            local.top10PC_AsOfDate = local.topCompanyData.map(function (e: any) { return e.AsOfDate; }).sort().reverse()[0];
                        }
                        if (report.ReportType == ReportType.TotalValueByStrategy_DB) {
                            local.strategyTotalValueData = report.Results;
                            local.strategyTotalValueData_AsOfDate = local.strategyTotalValueData.map(function (e: any) { return e.AsOfDate; }).sort().reverse()[0];
                        }
                        if (report.ReportType == ReportType.UnrealizedValueByStrategy_DB) {
                            local.strategyUnrealizedValueData = report.Results;
                            local.strategyUnrealizedValue_AsOfDate = local.strategyUnrealizedValueData.map(function (e: any) { return e.AsOfDate; }).sort().reverse()[0];
                        }
                        if (report.ReportType == ReportType.AttributionBySector) {
                            local.sectorWiseAttributionData = report.Results;
                            local.sectorWiseAttribution_AsOfDate = local.sectorWiseAttributionData.map(function (e: any) {
                                return e.AsOfDate;
                            }).sort().reverse()[0];
                        }

                    });
                }
                this.dataLoaded = true;

                // this.model.userGroup = resp.userGroup;
            }, error => {
                this.accountService.redirectToLogin(error);

            });

    }

    getRegionList() {
        this.miscService.getRegionList().subscribe(result => {
            if (result != null) {
                this.regionList = result["body"];
            }
        }, error => {
            this.accountService.redirectToLogin(error);

        });
    }

    getTotalCounts() {
        this.reportService.getTotalCounts()
            .subscribe(result => {

                var local = this;
                result["body"].totalCounts.forEach(function (val: any) {
                    if (val.moduleName == "Fund") {
                        local.totalFunds = val.count;
                    }
                    if (val.moduleName == "TotalPortfolioCompany") {
                        local.totalPortfolioCompanies = val.count;
                    }
                    if (val.moduleName == "TotalValue") {
                        local.totalValue = (val.count / 1000).toFixed(2);// change to Million //15.79;
                    }
                    if (val.moduleName == "TotalInvestment") {
                        local.totalInvestedCapital = (val.count / 1000).toFixed(2);// change to Million
                    }
                    if (val.moduleName == "TotalRealizedValue") {
                        local.totalRealizedValue = (val.count / 1000).toFixed(2);// change to Million
                    }
                    if (local.totalValue != null && local.totalRealizedValue != null) {
                        local.totalUnrealizedValue = local.totalValue - local.totalRealizedValue;
                    }
                });
            }, error => {
                this.accountService.redirectToLogin(error);

            });
    }

    onMapRegionChanged(event: any) {
        this.selectedRegion = event;

        

        var regionIds = this.regionList.filter(function (val) {
            return val.region == event;
        })

        this.model = { selectedReportTypes: [ReportType.AttributionBySector], regionIds: regionIds }
        this.reportService.getReportData(this.model)
            .subscribe(result => {

                this.reportData = result["body"];
                var local = this;
                this.reportData.forEach(function (report: any, reportIndex: any) {

                    local.sectorWiseAttributionData = [];
                    if (report.ReportType == ReportType.AttributionBySector) {
                        local.sectorWiseAttributionData = report.Results;
                    }

                });
                this.dataLoaded = true;
            }, error => {
                this.accountService.redirectToLogin(error);

            });
    }

    chart3DData: any[] = [
        { name: 'Direct', count: 2742 },
        { name: 'Facebook', count: 2242 },
        { name: 'Pinterest', count: 3112 },
        { name: 'Search', count: 937 },
        { name: 'Others', count: 1450 }
    ];



    labels: any[] = [
        { name: 'Direct', count: 2742 },
        { name: 'Facebook', count: 2242 },
        { name: 'Pinterest', count: 3112 },
        { name: 'Search', count: 937 },
        { name: 'Others', count: 1450 }
    ];


    selectedSlice: any = [
        {
            familyType: 'red', slice:
                { type: 'red', amount: 100 }
        },

        {
            familyType: 'green', slice:
                { type: 'green', amount: 20 }
        },
        {
            familyType: 'yellow', slice:
                { type: 'yellow', amount: 30 }
        },

        {
            familyType: 'pink', slice:
                { type: 'pink', amount: 40 }
        },
    ];

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

    chart3Data: any[] = [{
        'Year': '2010',
        'Companies': 10,
        '% Growth': null
    }, {
        'Year': '2011',
        'Companies': 12,
        '% Growth': 20.00
    }, {
        'Year': '2012',
        'Companies': 18,
        '% Growth': 50.00
    }, {
        'Year': '2013',
        'Companies': 20,
        '% Growth': 11.11
    }, {
        'Year': '2014',
        'Companies': 30,
        '% Growth': 50.00
    }, {
        'Year': '2015',
        'Companies': 25,
        '% Growth': -16.66
    }, {
        'Year': '2016',
        'Companies': 35,
        '% Growth': 40.00
    }, {
        'Year': '2017',
        'Companies': 38,
        '% Growth': 8.57
    }, {
        'Year': '2018',
        'Companies': 50,
        '% Growth': 31.58
    }];



    data: any[] = [

        { Date: "125", a: "2", b: "4", c: "5", d: "3" },
        { Date: "126", a: "6", b: "5", c: "8", d: "5" },
        { Date: "127", a: "7", b: "6", c: "5", d: "2" },
    ]

}
