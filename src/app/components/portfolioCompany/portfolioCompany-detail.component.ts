import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { NgbModal, NgbModalOptions } from "@ng-bootstrap/ng-bootstrap";
import { NgxSpinnerService } from "ngx-spinner";
import { MenuItem } from "primeng/api";
import { LazyLoadEvent, MessageService } from "primeng/primeng";
import { isNumeric } from "rxjs/util/isNumeric";
import { AccountService } from "../../services/account.service";
import {
  DecimalDigitEnum,
  ErrorMessage,
  ExportTypeEnum,
  FinancialValueUnitsEnum,
  MiscellaneousService,
  OrderTypesEnum,
  PeriodTypeQuarterEnum,
} from "../../services/miscellaneous.service";
import { FeaturesEnum } from "../../services/permission.service";
import { PortfolioCompanyService } from "../../services/portfolioCompany.service";
import {
  ReportCategory,
  ReportService,
  ReportType,
} from "../../services/report.service";
import { SavePortfolioOperationalKPIComponent } from "./portfolioCompany-operationalKPI.component";
import { SavePortfolioProfitabilityComponent } from "./portfolioCompany-profitability.component";
import { UpdateInfoSectionComponent } from "./update-info-section.component";

@Component({
  selector: "portfolio-company-detail",
  templateUrl: "./portfolioCompany-detail.component.html",
  providers: [
    SavePortfolioProfitabilityComponent,
    SavePortfolioOperationalKPIComponent,
    MessageService,
  ],
})
export class PortfolioCompanyDetailComponent implements OnInit {
  feature: typeof FeaturesEnum = FeaturesEnum;
  financialValueUnits: typeof FinancialValueUnitsEnum = FinancialValueUnitsEnum;
  exportType: typeof ExportTypeEnum = ExportTypeEnum;
  dataTable: any;
  message: any;
  id: any;
  portfolioProfitabilityModel: any = {};
  portfolioOperationalKPIModel: any = {};
  geographicLocation: any = { isHeadquarter: false };
  sectorWiseOperationalKPIs: any[];
  financialKPIs: any[];
  investmentKPIs: any[];
  companyKPIs: any[];
  reportType: typeof ReportType = ReportType;
  reportCategory: typeof ReportCategory = ReportCategory;
  reportData: any = [];
  model: any = {
    geographicLocations: [],
    pcEmployees: [],
  };
  items: MenuItem[];
  ddlModel: any = {
    operationalKPIList: [],
    selectedOperationalKPI: "",
    financialKPIList: [],
    selectedFinancialKPI: "",
    investmentKPIList: [],
    selectedInvestmentKPI: "",
    companyKPIList: [],
    selectedCompanyKPI: "",
  };
  reportModel: any = {
    sectorwiseOperationalKPIs: [],
    portfolioCompany: null,
    selectedReportTypes: [
      this.reportType.CompanyFinancialKPIReport,
      this.reportType.CompanyOperationalKPIGrowth,
    ],
    chartMetadetaList: [
      {
        chartName: "Financial KPI",
        chartType: "LineMarkers",
        colNameX: "Quarter",
        colNameY: "% Change In Revenue",
      },
      {
        chartName: "Financial KPI",
        chartType: "ColumnClustered",
        colNameX: "Quarter",
        colNameY: "Revenue",
      },
    ],
  };
  headquarterLocation: any;

  msgTimeSpan: number;
  loading = false;
  blockedProfitabilityTable: boolean = false;
  portfolioProfitabilityList: any = [];
  portfolioCompanyProfitabilityClone: any[] = [];
  totalProfitabilityRecords: number = 0;
  portfolioCompanyOperationalKPIValuesList: any[];
  portfolioCompanyOperationalKPIValuesDataTable: any[];
  portfolioCompanyOperationalKPIValuesListCol: any[];
  totalCompanyOperationalKPIValuesRecords: number;
  blockedCompanyOperationalKPIValuesTable: boolean = false;
  expandedOperationalKPIs: any[] = [];
  pagerLength: any;
  financialReport_AsOfDate: any;
  operationalReport_AsOfDate: any;
  profitabilityValueUnit: any;
  investmentKpiValueUnit: any;
  impactKpiValueUnit: any;
  companyKpiValueUnit: any;
  showProfitabilityValueDecimals: boolean = true;
  profitabilityMultiSortMeta: any[] = [
    { field: "year", order: -1 },
    { field: "quarter", order: -1 },
  ];
  operationalKPIMultiSortMeta: any[] = [
    { field: "year", order: -1 },
    { field: "quarter", order: -1 },
  ];
  unitTypeList = [
    {
      typeId: FinancialValueUnitsEnum.Absolute,
      unitType: FinancialValueUnitsEnum[FinancialValueUnitsEnum.Absolute],
    },
    {
      typeId: FinancialValueUnitsEnum.Thousands,
      unitType: FinancialValueUnitsEnum[FinancialValueUnitsEnum.Thousands],
    },
    {
      typeId: FinancialValueUnitsEnum.Millions,
      unitType: FinancialValueUnitsEnum[FinancialValueUnitsEnum.Millions],
    },
    {
      typeId: FinancialValueUnitsEnum.Billions,
      unitType: FinancialValueUnitsEnum[FinancialValueUnitsEnum.Billions],
    },
  ];

  exportItems: MenuItem[];
  exportLoading: boolean = false;
  exportInvestmentKPILoading: boolean = false;
  exportCompanyKPILoading: boolean = false;
  exportImpactKPILoading: boolean = false;

  CompanyKPIOrginalData: any[] = [];
  CompanyKPIChartData: any[] = [];
  CompanyKPIChartCol: any = [];

  InvestmentKPIOrginalData: any[] = [];
  InvestmentKPIChartData: any[] = [];
  InvestmentKPIChartCol: any = [];
  InvestmentKPIUnit: string = "";

  constructor(
    private reportService: ReportService,
    private accountService: AccountService,
    private miscService: MiscellaneousService,
    private portfolioCompanyService: PortfolioCompanyService,
    private modalService: NgbModal,
    private _avRoute: ActivatedRoute,
    private spinner: NgxSpinnerService
  ) {
    if (this._avRoute.snapshot.params["id"]) {
      this.id = this._avRoute.snapshot.params["id"];
    }
    this.pagerLength = this.miscService.getSmallPagerLength();
    this.items = [
      {
        label: "Export",
        items: [
          {
            label: "Key Values",
            icon: "fa fa-file-excel-o",
            command: (event) => {
              this.exportProfitabilityKeyValues();
            },
          },
          {
            label: "Income Statement",
            icon: "fa fa-file-excel-o",
            command: (event) => {
              this.exportProfitabilityDetails();
            },
          },
        ],
      },
    ];
    this.exportItems = [
      {
        label: "LP Report",
        icon: "fa fa-file-pdf-o",
        command: () => {
          this.LPReport();
        },
      },
    ];
    this.modelInvestmentKpi.periodType = {
      type: PeriodTypeQuarterEnum.Last1Year,
    };
    this.modelInvestmentKpi.orderType = { type: OrderTypesEnum.LatestOnRight };
    this.modelInvestmentKpi.decimalPlaces = {
      type: DecimalDigitEnum.Zero,
      value: "1.0-0",
    };
    this.modelCompanyKpi.periodType = { type: PeriodTypeQuarterEnum.Last1Year };
    this.modelCompanyKpi.orderType = { type: OrderTypesEnum.LatestOnRight };
    this.modelCompanyKpi.decimalPlaces = {
      type: DecimalDigitEnum.Zero,
      value: "1.0-0",
    };
    this.modelImpactKpi.periodType = { type: PeriodTypeQuarterEnum.Last1Year };
    this.modelImpactKpi.orderType = { type: OrderTypesEnum.LatestOnRight };
    this.modelImpactKpi.decimalPlaces = {
      type: DecimalDigitEnum.Zero,
      value: "1.0-0",
    };
    this.profitabilityValueUnit = {
      typeId: FinancialValueUnitsEnum.Absolute,
      unitType: FinancialValueUnitsEnum[FinancialValueUnitsEnum.Absolute],
    };
    this.investmentKpiValueUnit = {
      typeId: FinancialValueUnitsEnum.Absolute,
      unitType: FinancialValueUnitsEnum[FinancialValueUnitsEnum.Absolute],
    };
    this.impactKpiValueUnit = {
      typeId: FinancialValueUnitsEnum.Absolute,
      unitType: FinancialValueUnitsEnum[FinancialValueUnitsEnum.Absolute],
    };
    this.companyKpiValueUnit = {
      typeId: FinancialValueUnitsEnum.Absolute,
      unitType: FinancialValueUnitsEnum[FinancialValueUnitsEnum.Absolute],
    };
  }
  sourceURL: any;
  ngOnInit() {
    this.sourceURL = this.miscService.GetPriviousPageUrl();
    this.getPortfolioCompanies();
    this.msgTimeSpan = this.miscService.getMessageTimeSpan();
    //this.getPortfolioCompanyOperationalKPIValues(null);
    //this.getPortfolioCompanyInvestmentKPIValues(event, null);
  }
  isNumberCheck(str: any) {
    //if (typeof str != "string") return false // we only process strings!
    // could also coerce to string: str = ""+str
    //return !isNaN(parseFloat(str));// && !isNaN(parseFloat(str))
    return isNumeric(str);
  }
  significantEventsSection: any;
  assessmentSection: any;
  exitPlansSection: any;
  impactSection: any;
  footNoteInvestmentSection: any;
  footNoteTradingSection: any;
  portfolioCompanyCommentaryDetails: any;
  getPortfolioCompanies() {
    if (this.id != undefined) {
      this.loading = true;
      //debugger;
      //get portfolio company details by id
      this.portfolioCompanyService
        .getPortfolioCompanyById({ Value: this.id })
        .subscribe(
          (result) => {
            let resp = result["body"];

            if (resp != null && result.code == "OK") {
              this.model = resp;
              this.portfolioCompanyCommentaryDetails =
                result.body.commentaryData;
              this.significantEventsSection =
                this.portfolioCompanyCommentaryDetails
                  .significantEventsSectionData != null
                  ? this.portfolioCompanyCommentaryDetails
                      .significantEventsSectionData.item4
                  : "";
              this.exitPlansSection =
                this.portfolioCompanyCommentaryDetails.exitPlansSectionData !=
                null
                  ? this.portfolioCompanyCommentaryDetails.exitPlansSectionData
                      .item4
                  : "";
              this.assessmentSection =
                this.portfolioCompanyCommentaryDetails.assessmentSectionData !=
                null
                  ? this.portfolioCompanyCommentaryDetails.assessmentSectionData
                      .item4
                  : "";
              this.impactSection =
                this.portfolioCompanyCommentaryDetails.impactSectionData != null
                  ? this.portfolioCompanyCommentaryDetails.impactSectionData
                      .item4
                  : "";
              this.portfolioInfoSectionModel.encryptedPortfolioCompanyId = this.model.encryptedPortfolioCompanyId;
              this.portfolioInfoSectionModel.portfolioCompanyID = this.model.portfolioCompanyID;

              this.headquarterLocation = this.model.geographicLocations.filter(
                function (element: any, index: any) {
                  return element.isHeadquarter == true;
                }
              )[0];
              this.model.geographicLocations = this.model.geographicLocations.filter(
                function (element: any, index: any) {
                  return element.isHeadquarter == false;
                }
              );
              this.reportModel.portfolioCompany = resp;
              this.portfolioProfitabilityModel.portfolioCompanyID = this.model.portfolioCompanyID;
              this.portfolioOperationalKPIModel.portfolioCompanyID = this.model.portfolioCompanyID;
              this.getCompanyWiseOperationalKPIs();
              this.getFinancialKPIs();
              this.getFinancialKPIs();
              this.getInvestmentKPIs();
              this.getCompanyKPIs();
              this.getCompanyFinancialReports();
              this.getPortfolioCompanyInvestmentKPIValues(null, null);
              this.getPCCompanyKPIValues(null, null);
              this.getPortfolioCompanyImpactKPIValues(null, null);
            } else {
              if (resp.status != null && resp.status.message != "") {
                this.message = this.miscService.showAlertMessages(
                  "error",
                  resp.status.message
                );
              }
            }
            this.loading = false;
          },
          (error) => {
            this.accountService.redirectToLogin(error);
            this.loading = false;
          }
        );
    }
  }

  getCompanyWiseOperationalKPIs() {
    this.miscService
      .GetCompanywiseOperationalKPIList(this.model.portfolioCompanyID)
      .subscribe(
        (result) => {
          let resp = result["body"];
          // if (resp != null && result.code == "OK" && resp.totalRecords != 0) {
          if (resp != null && result.code == "OK" && resp.length != 0) {
            this.sectorWiseOperationalKPIs = resp;
            var OperationalKPI = this.sectorWiseOperationalKPIs;
            this.ddlModel.operationalKPIList = OperationalKPI;
            this.ddlModel.selectedOperationalKPI = OperationalKPI[0];
            OperationalKPI[0].sector = null;
            this.reportModel.sectorwiseOperationalKPIs = [OperationalKPI[0]];
            this.onOperationalKPIChange();
          } else {
            if (result.message != "" && result.message != null) {
              this.message = this.miscService.showAlertMessages(
                "error",
                result.message
              );
            }
            //if (resp.status.message == null) {
            //    this.message = this.miscService.showAlertMessages('error', "Operational KPI data not found for this sector");
            //}
          }
          this.loading = false;
        },
        (error) => {
          this.accountService.redirectToLogin(error);
          this.loading = false;
        }
      );
  }

  getFinancialKPIs() {
    //debugger;
    this.miscService.GetFinancialKPIList().subscribe(
      (result) => {
        let resp = result["body"];
        if (resp != null && result.code == "OK") {
          // this.financialKPIs = resp.financialKPIList;
          this.financialKPIs = resp;
          var financialKPI = this.financialKPIs;
          (this.ddlModel.financialKPIList = financialKPI),
            (this.ddlModel.selectedFinancialKPI = financialKPI[0]);
        } else {
          if (result.message != null && result.message != "") {
            this.message = this.miscService.showAlertMessages(
              "error",
              resp.message
            );
          }
        }
        this.loading = false;
      },
      (error) => {
        this.accountService.redirectToLogin(error);
        this.loading = false;
      }
    );
  }

  getInvestmentKPIs() {
    //debugger;
    let local = this;
    let KPIQueryModel = {
      portfolioCompanyIds: this.model.portfolioCompanyID.toString(),
      kpiType: "Investment",
    };
    this.miscService.GetCompanyOrInvestmentKPIList(KPIQueryModel).subscribe(
      (result) => {
        let resp = result["body"];
        if (resp != null && result.code == "OK") {
          this.investmentKPIs = resp;
          var investmentKPIs = this.investmentKPIs;
          this.ddlModel.investmentKPIList = investmentKPIs;
          this.ddlModel.selectedInvestmentKPI = investmentKPIs[0];
          local.getInvestmentKPIReport();
        } else {
          if (result.message != null && result.message != "") {
            this.message = this.miscService.showAlertMessages(
              "error",
              resp.message
            );
          }
        }
        this.loading = false;
      },
      (error) => {
        this.accountService.redirectToLogin(error);
        this.loading = false;
      }
    );
  }

  getCompanyKPIs() {
    //debugger;
    let local = this;
    let KPIQueryModel = {
      portfolioCompanyIds: this.model.portfolioCompanyID.toString(),
      kpiType: "Company",
    };
    this.miscService.GetCompanyOrInvestmentKPIList(KPIQueryModel).subscribe(
      (result) => {
        let resp = result["body"];
        if (resp != null && result.code == "OK") {
          this.companyKPIs = resp;
          var companyKPIs = this.companyKPIs;
          this.ddlModel.companyKPIList = companyKPIs;
          this.ddlModel.selectedCompanyKPI = companyKPIs[0];
          local.getCompanyKPIReport();
        } else {
          if (result.message != null && result.message != "") {
            this.message = this.miscService.showAlertMessages(
              "error",
              resp.message
            );
          }
        }
        this.loading = false;
      },
      (error) => {
        this.accountService.redirectToLogin(error);
        this.loading = false;
      }
    );
  }

  getCompanyKPIReport() {
    let objQueryModel = JSON.parse(JSON.stringify(this.reportModel));
    let objCompanyKPIModel: any[] = [];
    let local = this;

    this.companyKPIs.forEach((item) => {
      objCompanyKPIModel.push({
        CompanyKPIID: item.kpiid,
        KPI: item.itemName,
        KPIInfo: item.kpiInfo,
      });
    });

    objQueryModel.selectedReportTypes = [this.reportType.CompanyKPIReport];
    objQueryModel["CompanyKPI"] = objCompanyKPIModel;
    objQueryModel["Filter"] = this.modelCompanyKpi.periodType.type;

    this.CompanyKPIOrginalData = [];
    this.CompanyKPIChartCol = [];
    this.reportService.getReportData(objQueryModel).subscribe(
      (result) => {
        let resp = result["body"];
        if (resp != null && result.code == "OK") {
          local.CompanyKPIOrginalData = resp[0].Results;
          local.CompanyKPIChartCol = resp[0].Columns;
          local.OnCompanyKPIChange();
        } else {
          if (result.message != null && result.message != "") {
          }
        }
        this.loading = false;
      },
      (error) => {
        this.accountService.redirectToLogin(error);
        this.loading = false;
      }
    );
  }

  getInvestmentKPIReport() {
    let objQueryModel = JSON.parse(JSON.stringify(this.reportModel));
    let objInvestmentKPIModel: any[] = [];
    let local = this;

    this.investmentKPIs.forEach((item) => {
      objInvestmentKPIModel.push({
        InvestmentKPIID: item.kpiid,
        KPI: item.itemName,
        KPIInfo: item.kpiInfo,
      });
    });

    objQueryModel.selectedReportTypes = [this.reportType.InvestmentKPIReport];
    objQueryModel["InvestmentKPI"] = objInvestmentKPIModel;
    objQueryModel["Filter"] = this.modelInvestmentKpi.periodType.type;

    this.InvestmentKPIOrginalData = [];
    this.InvestmentKPIChartCol = [];
    this.reportService.getReportData(objQueryModel).subscribe(
      (result) => {
        let resp = result["body"];
        if (resp != null && result.code == "OK") {
          local.InvestmentKPIOrginalData = resp[0].Results;
          local.InvestmentKPIChartCol = resp[0].Columns;
          local.OnInvestmentKPIChange();
        } else {
          if (result.message != null && result.message != "") {
          }
        }
        this.loading = false;
      },
      (error) => {
        this.accountService.redirectToLogin(error);
        this.loading = false;
      }
    );
  }

  getCompanyFinancialReports() {
    //debugger;
    console.log("Hello");
    this.reportService.getReportData(this.reportModel).subscribe(
      (result) => {
        //   this.selectedKPIs = this.model.sectorwiseOperationalKPIs;
        this.reportData = result["body"];
        var local = this;
        if (local.reportData.length > 0) {
          //local.clearChart();
          local.reportData.forEach(function (val: any, i: any) {
            let titles = local.reportService.ReportTypeList.filter(function (
              ele: any,
              i: any
            ) {
              return val.ReportType == ele.value;
            });

            if (
              val.ReportType == local.reportType.CompanyOperationalKPIGrowth
            ) {
              val.KPIReports = [];
              let kpiList = Array.from(
                new Set(val.Results.map((item: any) => item.KPI))
              );
              kpiList.forEach(function (el: any) {
                let kpiReport = val.Results.filter(function (rpt: any) {
                  return el == rpt.KPI;
                });
                var asOfDate = new Date(); //kpiReport.map(function (e: any) { return e.AsofDate; }).sort().reverse()[0];
                var d: any = {
                  data: kpiReport,
                  title: el,
                  operationlReport_AsOfDate: asOfDate,
                };
                if (kpiReport.length > 0) {
                  d.unit = kpiReport[0].Info;
                }
                val.KPIReports.push(d);
              });
              if (val.KPIReports.length > 0 && val.KPIReports[0].data != null)
                local.operationalReport_AsOfDate = val.KPIReports[0].data
                  .map(function (e: any) {
                    return e.AsofDate;
                  })
                  .sort()
                  .reverse()[0];
            }

            if (titles.length > 0) {
              val.title = titles[0].label;
              val.category = titles[0].category;
            }
            val.cols = [];
            val.Columns.forEach(function (value: any, i: any) {
              val.cols.push({ field: value, header: value });
            });

            val.shrinkSize = false;

            val.chartData = val.Results;
            if (
              val.chartData != undefined &&
              val.ReportType == local.reportType.CompanyFinancialKPIReport
            )
              local.financialReport_AsOfDate = val.chartData
                .map(function (e: any) {
                  return e.AsofDate;
                })
                .sort()
                .reverse()[0];

            //val.financialReport_AsOfDate = val.chartData.map(function (e: any) { return e.AsofDate; }).sort().reverse()[0];

            //local.createChart(local.xField, local.yField, local.data);
          });

          if (local.reportData != null && local.reportData.length > 0) {
            // local.model.chartMetadetaList = [{ chartName: local.reportData[0].title, chartType: "LineMarkers", colNameX: local.reportData[0].Columns[0], colNameY: local.reportData[0].Columns[2] },
            //{ chartName: local.reportData[0].title, chartType: "ColumnClustered", colNameX: local.reportData[0].Columns[0], colNameY: local.reportData[0].Columns[1] }];
          }
        }
        //}, 10, this)

        this.spinner.hide();
        this.CheckIfNoDataInReport();
        // this.model.userGroup = resp.userGroup;
      },
      (error) => {
        this.accountService.redirectToLogin(error);
        this.CheckIfNoDataInReport();
        this.spinner.hide();
      }
    );
  }

  onFinancialKPIChange() {
    //debugger;
    //	this.getCompanyFinancialReports();
  }

  OnCompanyKPIChange() {
    //filtering the KPI
    this.CompanyKPIChartData = [];
    this.CompanyKPIChartData = this.CompanyKPIOrginalData.filter(
      (x) => x["KPIId"] == this.ddlModel.selectedCompanyKPI.kpiid
    );
  }

  OnInvestmentKPIChange() {
    //filtering the KPI
    this.InvestmentKPIChartData = [];
    this.InvestmentKPIChartData = this.InvestmentKPIOrginalData.filter(
      (x) => x["KPIId"] == this.ddlModel.selectedInvestmentKPI.kpiid
    );
    if (this.InvestmentKPIChartData.length > 0) {
      this.InvestmentKPIUnit = this.InvestmentKPIChartData[0]["Info"];
    }
  }

  onOperationalKPIChange() {
    //debugger;
    this.operationalReport_AsOfDate = undefined;
    this.ddlModel.selectedOperationalKPI.sector = null;
    this.reportModel.sectorwiseOperationalKPIs = [
      this.ddlModel.selectedOperationalKPI,
    ];
    this.getCompanyFinancialReports();
  }

  CheckIfNoDataInReport() {
    if (this.reportData != null && this.reportData.length > 0) {
      let availableDataReports = this.reportData.filter(function (data: any) {
        return data.Results != null && data.Results.length > 0;
      });
      if (availableDataReports.length == 0) {
        this.reportService.setDataAvailabilityInReport(false);
      } else {
        this.reportService.setDataAvailabilityInReport(true);
      }
    } else {
      this.reportService.setDataAvailabilityInReport(false);
    }
  }

  getPortfolioProfitabilityRecords(event: any) {
    //debugger
    if (event == null) {
      event = {
        first: 0,
        rows: 10,
        globalFilter: null,
        sortField: "year-quarter",
        multiSortMeta: this.profitabilityMultiSortMeta,
        sortOrder: -1,
      };
    }

    this.blockedProfitabilityTable = true;
    this.portfolioCompanyService
      .getPortfolioCompanyProfitabilityList({
        portfolioCompanyID: this.model.portfolioCompanyID,
        paginationFilter: event,
      })
      .subscribe(
        (result) => {
          let resp = result["body"]; // JSON.parse(result._body);
          if (resp != null && result.code == "OK") {
            this.portfolioProfitabilityList =
              resp.portfolioCompanyProfitabilityList;
            this.portfolioCompanyProfitabilityClone = JSON.parse(
              JSON.stringify(this.portfolioProfitabilityList)
            );
            this.totalProfitabilityRecords = resp.totalRecords;
          }
          this.blockedProfitabilityTable = false;
        },
        (error) => {
          this.blockedProfitabilityTable = false;
          this.accountService.redirectToLogin(error);
        }
      );
  }

  convertProfitabilityValueUnits() {
    setTimeout(
      function (local: any) {
        local.portfolioProfitabilityList = [];
        local.portfolioCompanyProfitabilityClone.forEach(function (value: any) {
          var valueClone = JSON.parse(JSON.stringify(value));
          switch (local.profitabilityValueUnit.typeId) {
            case FinancialValueUnitsEnum.Absolute:
              break;
            case FinancialValueUnitsEnum.Thousands:
              valueClone.ebitda = (valueClone.ebitda / 1000).toFixed(2);
              valueClone.netDebt = (valueClone.netDebt / 1000).toFixed(2);
              valueClone.revenue = (valueClone.revenue / 1000).toFixed(2);
              break;
            case FinancialValueUnitsEnum.Millions:
              valueClone.ebitda = (valueClone.ebitda / 1000000).toFixed(2);
              valueClone.netDebt = (valueClone.netDebt / 1000000).toFixed(2);
              valueClone.revenue = (valueClone.revenue / 1000000).toFixed(2);
              break;
            case FinancialValueUnitsEnum.Billions:
              valueClone.ebitda = (valueClone.ebitda / 1000000000).toFixed(2);
              valueClone.netDebt = (valueClone.netDebt / 1000000000).toFixed(2);
              valueClone.revenue = (valueClone.revenue / 1000000000).toFixed(2);
              break;
          }
          local.portfolioProfitabilityList.push(valueClone);
        });
      },
      10,
      this
    );
  }

  colsOperationalKPI: any[] = [
    { field: "fullQuarter", header: "Quarter", sortField: "year-quarter" },
  ];
  getPortfolioCompanyOperationalKPIValues(event: any) {
    if (event == null) {
      event = {
        first: 0,
        rows: 10,
        globalFilter: null,
        sortField: "year-quarter",
        multiSortMeta: this.operationalKPIMultiSortMeta,
        sortOrder: -1,
      };
    }

    this.blockedCompanyOperationalKPIValuesTable = true;
    this.portfolioCompanyService
      .getPortfolioCompanyOperationalKPIValuesTranpose({
        portfolioCompanyID: this.model.portfolioCompanyID.toString(),
        paginationFilter: event,
      })
      .subscribe(
        (result) => {
          let resp = result["body"]; 
          if (resp != null && result.code == "OK") {
            
            this.LoadPortfolioCompanyOperationalKPIValuesData(resp);
            this.totalCompanyOperationalKPIValuesRecords = resp.totalRecords;
          }
          this.blockedCompanyOperationalKPIValuesTable = false;
        },
        (error) => {
          this.blockedCompanyOperationalKPIValuesTable = false;
          this.accountService.redirectToLogin(error);
        }
      );
  }

  LoadPortfolioCompanyOperationalKPIValuesData(response: any) {
    let arrData: any[];
    this.portfolioCompanyOperationalKPIValuesDataTable = [];

    this.portfolioCompanyOperationalKPIValuesList =
      response.portfolioCompanyOperationalKPIQuarterList;
    arrData = response.portfolioCompanyOperationalKPIQuarterDataTable;
    if (arrData.length > 0) {
      let colKey: any[] = Object.keys(arrData[0]);
      this.portfolioCompanyOperationalKPIValuesListCol = [];
      for (let index = 0; index < colKey.length; index++) {
        if (String(colKey[index]).toLowerCase() != "kpi info") {
          let styleClass = "";
          let strType = "";
          if (String(colKey[index]).toLowerCase().indexOf("kpi") >= 0) {
            styleClass = "table-data-left";
            strType = "string";
          } else {
            styleClass = "table-data-right";
            strType = "number";
          }
          this.portfolioCompanyOperationalKPIValuesListCol.push({
            field: colKey[index],
            header: String(colKey[index]).toUpperCase(),
            styleClass: styleClass,
            type: strType,
          });
        }
      }
      this.portfolioCompanyOperationalKPIValuesDataTable = arrData;
    }
  }

  loadOperationalKPILazy(event: LazyLoadEvent) {
    this.getPortfolioCompanyOperationalKPIValues(event);
  }

  loadProfitabilityLazy(event: LazyLoadEvent) {
    //debugger;
    this.getPortfolioProfitabilityRecords(event);
  }
  modalOption: NgbModalOptions = {};
  currentModelRef: any;
  open(profitabilityModel: any) {
    //debugger;
    this.modalOption.backdrop = "static";
    this.modalOption.keyboard = false;
    this.modalOption.size = "lg";
    this.modalOption.centered = true;
    let copy = JSON.parse(JSON.stringify(profitabilityModel));
    this.currentModelRef = this.modalService.open(
      SavePortfolioProfitabilityComponent,
      this.modalOption
    );
    this.currentModelRef.componentInstance.model = copy;
    this.currentModelRef.componentInstance.profitabilityList = this.portfolioProfitabilityList;
    this.currentModelRef.componentInstance.masterModel = this.portfolioProfitabilityModel;
    this.currentModelRef.componentInstance.onSave.subscribe((status: any) => {
      this.close(status);
    });
  }

  close(status: any) {
    this.getPortfolioProfitabilityRecords(null);
    this.currentModelRef.close();

    this.message = this.miscService.showAlertMessages(
      "success",
      status.message
    );
  }

  openKPIDialog(dr: any, bNew: boolean) {
    this.modalOption.backdrop = "static";
    this.modalOption.keyboard = false;
    this.modalOption.size = "lg";
    this.modalOption.centered = true;

    let kpiModel: any = {};
    if (bNew == true) {
      //New one
      kpiModel = dr;
    } else {
      for (
        let index = 0;
        index < this.portfolioCompanyOperationalKPIValuesList.length;
        index++
      ) {
        let tempKPIValue: any[] = this.portfolioCompanyOperationalKPIValuesList[
          index
        ]["portfolioCompanyOperationalKPIValues"];
        for (let index1 = 0; index1 < tempKPIValue.length; index1++) {
          let tempSector: any =
            tempKPIValue[index1]["sectorwiseOperationalKPI"];
          if (tempSector["kpi"] == dr["kpi"]) {
            kpiModel = this.portfolioCompanyOperationalKPIValuesList[index];
          }
        }
      }
    }
    let copy = JSON.parse(JSON.stringify(kpiModel));
    this.currentModelRef = this.modalService.open(
      SavePortfolioOperationalKPIComponent,
      this.modalOption
    );
    this.currentModelRef.componentInstance.sectorwiseOperationalKPIList = this.sectorWiseOperationalKPIs;
    this.currentModelRef.componentInstance.model = copy;
    this.currentModelRef.componentInstance.companyOperationalKPIList = this.portfolioCompanyOperationalKPIValuesList;

    this.currentModelRef.componentInstance.onSave.subscribe((status: any) => {
      this.closeKPIDialog(status);
    });
  }

  closeKPIDialog(status: any) {
    this.getPortfolioCompanyOperationalKPIValues(null);
    this.currentModelRef.close();

    this.message = this.miscService.showAlertMessages(
      "success",
      status.message
    );
  }

  globalFilter: string = "";
  exportProfitabilityKeyValues() {
    let event = {
      first: 0,
      rows: 10,
      globalFilter: this.globalFilter,
      sortField: "year-quarter",
      multiSortMeta: this.profitabilityMultiSortMeta,
      sortOrder: -1,
    };

    this.portfolioCompanyService
      .exportProfitabilityList({
        exportType: "key",
        portfolioCompanyID: this.model.portfolioCompanyID,
        paginationFilter: event,
      })
      .subscribe(
        (response) => {
          this.miscService.downloadExcelFile(response);
        },
        (error) => {
          this.message = this.miscService.showAlertMessages(
            "error",
            ErrorMessage.SomethingWentWrong
          );
        }
      );
  }
  exportProfitabilityDetails() {
    let event = {
      first: 0,
      rows: 10,
      globalFilter: this.globalFilter,
      sortField: "year-quarter",
      multiSortMeta: this.profitabilityMultiSortMeta,
      sortOrder: -1,
    };

    this.portfolioCompanyService
      .exportProfitabilityList({
        exportType: "details",
        portfolioCompanyID: this.model.portfolioCompanyID,
        paginationFilter: event,
      })
      .subscribe(
        (response) => {
          this.miscService.downloadExcelFile(response);
        },
        (error) => {
          this.message = this.miscService.showAlertMessages(
            "error",
            ErrorMessage.SomethingWentWrong
          );
        }
      );
  }

  /***************Investment KPI*************[Start]******************/
  frozenCols: any = [{ field: "KPI", header: "KPI" }];
  objInvestmentKPIList: any = [];
  investmentKPICols: any = [];
  modelInvestmentKpi: any = {};
  portfolioCompanyInvestmentKPIValuesList: any[];
  portfolioCompanyInvestmentKPIValuesListClone: any[];
  financialKpiSearchFilter: any;
  expandedInvestmentKPIs: any[] = [];
  totalCompanyInvestmentKPIValuesRecords: number;
  financialPeriodErrorMessage: string = "";

  financialKPIMultiSortMeta: any[] = [
    { field: "year", order: -1 },
    { field: "month", order: -1 },
  ];
  loadFinancialKPILazy(event: LazyLoadEvent) {
    this.getPortfolioCompanyInvestmentKPIValues(event, null);
  }
  convertInvestmentKPIValueUnits() {
    let financialValueUnitTable = this.investmentKpiValueUnit;
    let portfolioCompanyInvestmentKPIValuesListlocal = [];
    this.portfolioCompanyInvestmentKPIValuesList = [];
    let local = this;
    this.portfolioCompanyInvestmentKPIValuesListClone.forEach(function (
      value: any
    ) {
      var valueClone = JSON.parse(JSON.stringify(value));
      if (
        valueClone.kpiInfo != "%" &&
        valueClone.kpiInfo != "x" &&
        valueClone.kpiInfo != "#" &&
        valueClone.kpiInfo != "" &&
        valueClone.kpiActualValue != "" &&
        valueClone.kpiActualValue != null
      ) {
        switch (Number(financialValueUnitTable.typeId)) {
          case FinancialValueUnitsEnum.Absolute:
            break;
          case FinancialValueUnitsEnum.Thousands:
            valueClone.kpiActualValue =
              !isNaN(parseFloat(valueClone.kpiActualValue)) &&
              !isNaN(parseFloat(valueClone.kpiActualValue))
                ? valueClone.kpiActualValue / 1000
                : valueClone.kpiActualValue;
            break;
          case FinancialValueUnitsEnum.Millions:
            valueClone.kpiActualValue =
              !isNaN(parseFloat(valueClone.kpiActualValue)) &&
              !isNaN(parseFloat(valueClone.kpiActualValue))
                ? valueClone.kpiActualValue / 1000000
                : valueClone.kpiActualValue;
            break;
          case FinancialValueUnitsEnum.Billions:
            valueClone.kpiActualValue =
              !isNaN(parseFloat(valueClone.kpiActualValue)) &&
              !isNaN(parseFloat(valueClone.kpiActualValue))
                ? valueClone.kpiActualValue / 1000000000
                : valueClone.kpiActualValue;
            break;
        }
      }
      portfolioCompanyInvestmentKPIValuesListlocal.push(valueClone);
    });

    this.portfolioCompanyInvestmentKPIValuesList = portfolioCompanyInvestmentKPIValuesListlocal;
    this.createInvestmentKPILayOut(
      this.portfolioCompanyInvestmentKPIValuesList
    );
    this.portfolioCompanyInvestmentKPIValuesList.forEach(function (item) {
      item.fullMonth = item.quarter + " " + item.year;
    });
  }
  getPortfolioCompanyInvestmentKPIValues(event: any, searchFilter: any) {
    if (event == null) {
      event = {
        first: 0,
        rows: 1000,
        globalFilter: null,
        sortField: "FinancialKPI.KPI",
        multiSortMeta: this.financialKPIMultiSortMeta,
        sortOrder: -1,
      };
    }
    if (searchFilter == null) {
      var sortOrder =
        this.modelInvestmentKpi.orderType.type == OrderTypesEnum.LatestOnRight
          ? [
              { field: "year", order: 1 },
              { field: "quarter", order: 1 },
            ]
          : [
              { field: "year", order: -1 },
              { field: "quarter", order: -1 },
            ];
      searchFilter = {
        sortOrder: sortOrder,
        periodType: this.modelInvestmentKpi.periodType.type,
      };

      if (searchFilter.periodType == "Date Range") {
        searchFilter.startPeriod = new Date(
          Date.UTC(
            this.modelInvestmentKpi.startPeriod.getFullYear(),
            this.modelInvestmentKpi.startPeriod.getMonth(),
            this.modelInvestmentKpi.startPeriod.getDate()
          )
        );
        searchFilter.endPeriod = new Date(
          Date.UTC(
            this.modelInvestmentKpi.endPeriod.getFullYear(),
            this.modelInvestmentKpi.endPeriod.getMonth(),
            this.modelInvestmentKpi.endPeriod.getDate()
          )
        );
      }
    } else {
      if (searchFilter.periodType == "Date Range") {
        searchFilter.startPeriod = new Date(
          Date.UTC(
            searchFilter.startPeriod.getFullYear(),
            searchFilter.startPeriod.getMonth(),
            searchFilter.startPeriod.getDate()
          )
        );
        searchFilter.endPeriod = new Date(
          Date.UTC(
            searchFilter.endPeriod.getFullYear(),
            searchFilter.endPeriod.getMonth(),
            searchFilter.endPeriod.getDate()
          )
        );
      }
    }
    this.financialKpiSearchFilter = searchFilter;

    this.portfolioCompanyService
      .getPortfolioCompanyInvestmentKPIValues({
        portfolioCompanyID: this.model.portfolioCompanyID,
        paginationFilter: event,
        searchFilter: searchFilter,
      })
      .subscribe(
        (result) => {
          let resp = result;
          if (resp != null && resp.code == "OK") {
            this.portfolioCompanyInvestmentKPIValuesList =
              resp.body.pcInvestmentKPIQuarterlyValueList;

            this.portfolioCompanyInvestmentKPIValuesListClone = JSON.parse(
              JSON.stringify(this.portfolioCompanyInvestmentKPIValuesList)
            );
            this.convertInvestmentKPIValueUnits();

            this.expandedInvestmentKPIs = [];
            if (this.portfolioCompanyInvestmentKPIValuesList.length > 0) {
              this.expandedInvestmentKPIs.push(
                this.portfolioCompanyInvestmentKPIValuesList[0]
              );
            }
            this.totalCompanyInvestmentKPIValuesRecords =
              resp.body.totalRecords;
          } else {
            this.portfolioCompanyInvestmentKPIValuesList = [];
            this.totalCompanyInvestmentKPIValuesRecords = 0;
            this.createInvestmentKPILayOut(
              this.portfolioCompanyInvestmentKPIValuesList
            );
          }
        },
        (error) => {
          this.accountService.redirectToLogin(error);
        }
      );
  }
  createInvestmentKPILayOut(kpiModel: any) {
    this.objInvestmentKPIList = [];
    this.objInvestmentKPIList.cols = [];
    this.objInvestmentKPIList.Results = [];
    var local = this;
    kpiModel.forEach(function (data: any) {
      var objKPI: any = {};
      var quarter = data.quarter;
      if (local.objInvestmentKPIList.cols.length == 0) {
        local.objInvestmentKPIList.cols.push({ field: "KPI", header: "KPI" });
      }
      var kpiIndex = -1;
      local.objInvestmentKPIList.Results.every(function (
        elem: any,
        index: any
      ) {
        let kpiName = data.investmentKPI.kpi;
        let kpiNameWithInfo = data.investmentKPI.kpi;
        if (data.kpiInfo != null && data.kpiInfo != "") {
          kpiName = kpiName; // + " (" + data.kpiInfo + ")";
          kpiNameWithInfo = kpiName + " (" + data.kpiInfo + ")";
        }
        if (elem.KPI === kpiName && elem.KPIWithInfo === kpiNameWithInfo) {
          kpiIndex = index;
          return false;
        }
        return true;
      });

      if (kpiIndex == -1) {
        if (data.kpiInfo != null && data.kpiInfo != "") {
          objKPI["KPI"] = data.investmentKPI.kpi; // + " (" + data.kpiInfo + ")";
          objKPI["KPIWithInfo"] =
            data.investmentKPI.kpi + " (" + data.kpiInfo + ")";
        } else {
          objKPI["KPI"] = data.investmentKPI.kpi;
          objKPI["KPIWithInfo"] = data.investmentKPI.kpi;
        }
        objKPI["KpiId"] = data.investmentKPI.investmentKPIId;
        objKPI["KpiInfo"] = data.kpiInfo;
      }
      var list = local.objInvestmentKPIList.cols.filter(function (val: any) {
        return val.field == quarter + " " + data.year;
      });
      if (list == null || list.length == 0) {
        local.objInvestmentKPIList.cols.push({
          field: quarter + " " + data.year,
          header: quarter + " " + data.year,
        });
      }
      if (kpiIndex >= 0) {
        local.objInvestmentKPIList.Results[kpiIndex][
          quarter + " " + data.year
        ] =
          data.kpiInfo != "%"
            ? data.kpiActualValue
            : data.kpiActualValue === null
            ? data.kpiActualValue
            : data.kpiActualValue / 100; //add % symbol for percnatge value
      } else {
        objKPI[quarter + " " + data.year] =
          data.kpiInfo != "%"
            ? data.kpiActualValue
            : data.kpiActualValue === null
            ? data.kpiActualValue
            : data.kpiActualValue / 100; //add % symbol for percnatge value
        local.objInvestmentKPIList.Results.push(objKPI);
      }
    });

    this.objInvestmentKPIList.cols.splice(0, 1);
    this.investmentKPICols.push.apply(this.investmentKPICols, this.frozenCols);
    this.investmentKPICols.push.apply(
      this.investmentKPICols,
      this.objInvestmentKPIList.cols
    );
  }

  /***************Investment KPI*************[End]******************/
  /***************Company KPI*************[Start]******************/

  objCompanyKPIList: any = [];
  companyKPICols: any = [];
  modelCompanyKpi: any = {};
  portfolioCompanyCompanyKPIValuesList: any[];
  portfolioCompanyCompanyKPIValuesListClone: any[];
  companyValueUnitTable: FinancialValueUnitsEnum =
    FinancialValueUnitsEnum.Absolute;
  companyKpiSearchFilter: any;
  expandedCompanyKPIs: any[] = [];
  totalCompanyCompanyKPIValuesRecords: number;
  companyPeriodErrorMessage: string = "";

  companywiseKPIMultiSortMeta: any[] = [
    { field: "year", order: -1 },
    { field: "month", order: -1 },
  ];

  convertCompanyKPIValueUnits() {
    let companyValueUnitTable = this.companyKpiValueUnit;
    let portfolioCompanyKPIValuesListlocal = [];
    this.portfolioCompanyCompanyKPIValuesList = [];
    let local = this;
    this.portfolioCompanyCompanyKPIValuesListClone.forEach(function (
      value: any
    ) {
      let childPCCompanyKPIMonthlyValueListLocal = [];
      var valueClone = JSON.parse(JSON.stringify(value));
      if (valueClone.pcCompanyKPIMonthlyValueModel != null) {
        //	if (valueClone.pcCompanyKPIMonthlyValueModel.kpiInfo != "%" && valueClone.pcCompanyKPIMonthlyValueModel.kpiInfo != "x") {
        if (
          valueClone.pcCompanyKPIMonthlyValueModel.kpiInfo != "%" &&
          valueClone.pcCompanyKPIMonthlyValueModel.kpiInfo != "x" &&
          valueClone.pcCompanyKPIMonthlyValueModel.kpiInfo != "#" &&
          valueClone.pcCompanyKPIMonthlyValueModel.kpiInfo != "" &&
          valueClone.pcCompanyKPIMonthlyValueModel.kpiActualValue != "" &&
          valueClone.pcCompanyKPIMonthlyValueModel.kpiActualValue != null
        ) {
          switch (Number(companyValueUnitTable.typeId)) {
            case FinancialValueUnitsEnum.Absolute:
              valueClone.childPCCompanyKPIMonthlyValueList.forEach(function (
                childValue: any
              ) {
                var childValueClone = JSON.parse(JSON.stringify(childValue));
                childPCCompanyKPIMonthlyValueListLocal.push(childValueClone);
              });
              valueClone.childPCCompanyKPIMonthlyValueList = childPCCompanyKPIMonthlyValueListLocal;

              break;
            case FinancialValueUnitsEnum.Thousands:
              if (
                valueClone.pcCompanyKPIMonthlyValueModel != null &&
                valueClone.pcCompanyKPIMonthlyValueModel.length != 0
              )
                valueClone.pcCompanyKPIMonthlyValueModel.kpiActualValue =
                  valueClone.pcCompanyKPIMonthlyValueModel.kpiActualValue /
                  1000;
              valueClone.childPCCompanyKPIMonthlyValueList.forEach(function (
                childValue: any
              ) {
                var childValueClone = JSON.parse(JSON.stringify(childValue));
                childValueClone.kpiActualValue =
                  childValueClone.kpiActualValue / 1000;
                childPCCompanyKPIMonthlyValueListLocal.push(childValueClone);
              });
              valueClone.childPCCompanyKPIMonthlyValueList = childPCCompanyKPIMonthlyValueListLocal;
              break;
            case FinancialValueUnitsEnum.Millions:
              if (
                valueClone.pcCompanyKPIMonthlyValueModel != null &&
                valueClone.pcCompanyKPIMonthlyValueModel.length != 0
              )
                valueClone.pcCompanyKPIMonthlyValueModel.kpiActualValue =
                  valueClone.pcCompanyKPIMonthlyValueModel.kpiActualValue /
                  1000000;
              valueClone.childPCCompanyKPIMonthlyValueList.forEach(function (
                childValue: any
              ) {
                var childValueClone = JSON.parse(JSON.stringify(childValue));
                childValueClone.kpiActualValue =
                  childValueClone.kpiActualValue / 1000000;
                childPCCompanyKPIMonthlyValueListLocal.push(childValueClone);
              });
              valueClone.childPCCompanyKPIMonthlyValueList = childPCCompanyKPIMonthlyValueListLocal;
              break;
            case FinancialValueUnitsEnum.Billions:
              if (
                valueClone.pcCompanyKPIMonthlyValueModel != null &&
                valueClone.pcCompanyKPIMonthlyValueModel.length != 0
              )
                valueClone.pcCompanyKPIMonthlyValueModel.kpiActualValue =
                  valueClone.pcCompanyKPIMonthlyValueModel.kpiActualValue /
                  1000000000;
              valueClone.childPCCompanyKPIMonthlyValueList.forEach(function (
                childValue: any
              ) {
                var childValueClone = JSON.parse(JSON.stringify(childValue));
                childValueClone.kpiActualValue =
                  childValueClone.kpiActualValue / 1000000000;
                childPCCompanyKPIMonthlyValueListLocal.push(childValueClone);
              });
              valueClone.childPCCompanyKPIMonthlyValueList = childPCCompanyKPIMonthlyValueListLocal;
              break;
          }
        }
      }
      portfolioCompanyKPIValuesListlocal.push(valueClone);
    });

    this.portfolioCompanyCompanyKPIValuesList = portfolioCompanyKPIValuesListlocal;
    this.createCompanyKPILayOut(this.portfolioCompanyCompanyKPIValuesList);
    this.portfolioCompanyCompanyKPIValuesList.forEach(function (item) {
      item.fullMonth =
        item.pcCompanyKPIMonthlyValueModel.month +
        " " +
        item.pcCompanyKPIMonthlyValueModel.year;
    });
  }
  getPCCompanyKPIValues(event: any, searchFilter: any) {
    if (event == null) {
      event = {
        first: 0,
        rows: 1000,
        globalFilter: null,
        sortField: "CompanywiseKPI.KPI",
        multiSortMeta: this.companywiseKPIMultiSortMeta,
        sortOrder: -1,
      };
    }
    if (searchFilter == null) {
      var sortOrder =
        this.modelCompanyKpi.orderType.type == OrderTypesEnum.LatestOnRight
          ? [
              { field: "year", order: 1 },
              { field: "month", order: 1 },
            ]
          : [
              { field: "year", order: -1 },
              { field: "month", order: -1 },
            ];
      searchFilter = {
        sortOrder: sortOrder,
        periodType: this.modelCompanyKpi.periodType.type,
      };
      if (searchFilter.periodType == "Date Range") {
        searchFilter.startPeriod = new Date(
          Date.UTC(
            this.modelCompanyKpi.startPeriod.getFullYear(),
            this.modelCompanyKpi.startPeriod.getMonth(),
            this.modelCompanyKpi.startPeriod.getDate()
          )
        );
        searchFilter.endPeriod = new Date(
          Date.UTC(
            this.modelCompanyKpi.endPeriod.getFullYear(),
            this.modelCompanyKpi.endPeriod.getMonth(),
            this.modelCompanyKpi.endPeriod.getDate()
          )
        );
      }
    } else {
      if (searchFilter.periodType == "Date Range") {
        searchFilter.startPeriod = new Date(
          Date.UTC(
            searchFilter.startPeriod.getFullYear(),
            searchFilter.startPeriod.getMonth(),
            searchFilter.startPeriod.getDate()
          )
        );
        searchFilter.endPeriod = new Date(
          Date.UTC(
            searchFilter.endPeriod.getFullYear(),
            searchFilter.endPeriod.getMonth(),
            searchFilter.endPeriod.getDate()
          )
        );
      }
    }
    this.companyKpiSearchFilter = searchFilter;
    this.portfolioCompanyService
      .getPCCompanyKPIValues({
        portfolioCompanyID: this.model.portfolioCompanyID,
        paginationFilter: event,
        searchFilter: searchFilter,
      })
      .subscribe(
        (result) => {
          let resp = result; // JSON.parse(result._body);
          if (resp != null && resp.code == "OK") {
            this.portfolioCompanyCompanyKPIValuesList = resp.body;
            this.portfolioCompanyCompanyKPIValuesListClone = JSON.parse(
              JSON.stringify(this.portfolioCompanyCompanyKPIValuesList)
            );
            this.convertCompanyKPIValueUnits();
            // this.createCompanywiseKPILayOut(this.portfolioCompanyCompanywiseKPIValuesList);
            // this.portfolioCompanyCompanywiseKPIValuesList.forEach(function (item) {
            // 	item.fullMonth = item.month + ' ' + item.year;
            // });
            this.expandedCompanyKPIs = [];
            if (this.portfolioCompanyCompanyKPIValuesList.length > 0) {
              this.expandedCompanyKPIs.push(
                this.portfolioCompanyCompanyKPIValuesList[0]
              );
            }
            this.totalCompanyCompanyKPIValuesRecords = resp.body.totalRecords;
          } else {
            this.portfolioCompanyCompanyKPIValuesList = [];
            this.totalCompanyCompanyKPIValuesRecords = 0;
            this.createCompanyKPILayOut(
              this.portfolioCompanyCompanyKPIValuesList
            );
          }
        },
        (error) => {
          this.accountService.redirectToLogin(error);
        }
      );
  }
  createCompanyKPILayOut(kpiModel: any) {
    this.objCompanyKPIList = [];
    this.objCompanyKPIList.cols = [];
    this.objCompanyKPIList.Results = [];

    var local = this;
    //to check the headers for CAB only
    if (this.model.portfolioCompanyID != 2) {
      kpiModel.forEach(function (ele: any) {
        if (ele.pcCompanyKPIMonthlyValueModel.portfolioCompanyID != 2) {
          ele.pcCompanyKPIMonthlyValueModel.segmentType = "";
        }
      });
    }
    var noSegmentKPIModel = kpiModel.filter(function (data: any) {
      return (
        data.pcCompanyKPIMonthlyValueModel.segmentType == "" ||
        data.pcCompanyKPIMonthlyValueModel.segmentType == undefined
      );
    });

    // This function is created to get all the month and years for the column name
    //without making any changes in old logic
    this.createColumnForCompanyKPI(noSegmentKPIModel);

    noSegmentKPIModel.forEach(function (data: any) {
      var objKPI: any = {};
      var parent = data.pcCompanyKPIMonthlyValueModel;
      var child = data.childPCCompanyKPIMonthlyValueList;
      var dataKPIInfo =
        parent.kpiInfo === "$"
          ? local.model.reportingCurrencyDetail.currencyCode
          : parent.kpiInfo;
      //for parent
      if (parent.kpi != "") {
        var month = local.miscService.getMonthName(parent.month);

        var kpiIndex = -1;
        local.objCompanyKPIList.Results.every(function (elem: any, index: any) {
          let kpiName = parent.kpi;
          let kpiNameWithInfo = parent.kpi;
          if (parent.kpiInfo != null && parent.kpiInfo != "") {
            kpiName = kpiName; // + " (" + parent.kpiInfo + ")";
            kpiNameWithInfo = kpiName + " (" + dataKPIInfo + ")";
          }
          if (elem.KPI === kpiName && elem.KPIWithInfo === kpiNameWithInfo) {
            kpiIndex = index;
            return false;
          }
          return true;
        });

        if (kpiIndex == -1) {
          if (parent.kpiInfo != null && parent.kpiInfo != "") {
            objKPI["KPI"] = parent.kpi; // + " (" + parent.kpiInfo + ")";
            objKPI["KPIWithInfo"] = parent.kpi + " (" + dataKPIInfo + ")";
          } else {
            objKPI["KPI"] = parent.kpi;
            objKPI["KPIWithInfo"] = parent.kpi;
          }
          objKPI["KpiId"] = parent.companyKPIID;
        }
        if (month != undefined) {
          var list = local.objCompanyKPIList.cols.filter(function (val: any) {
            return val.field == month + " " + parent.year;
          });
          if (list == null || list.length == 0) {
            local.objCompanyKPIList.cols.push({
              field: month + " " + parent.year,
              header: month + " " + parent.year,
            });
          }

          if (kpiIndex >= 0) {
            local.objCompanyKPIList.Results[kpiIndex][
              month + " " + parent.year
            ] =
              parent.kpiInfo != "%"
                ? parent.kpiActualValue
                : parent.kpiActualValue != null
                ? parent.kpiActualValue / 100
                : parent.kpiActualValue; //add % symbol for percnatge value
            local.objCompanyKPIList.Results[kpiIndex][
              "(Budget) " + month + " " + parent.year
            ] =
              parent.kpiInfo != "%"
                ? parent.kpiBudgetValue
                : parent.kpiBudgetValue != null
                ? parent.kpiBudgetValue / 100
                : parent.kpiBudgetValue;
          } else {
            objKPI[month + " " + parent.year] =
              parent.kpiInfo != "%"
                ? parent.kpiActualValue
                : parent.kpiActualValue != null
                ? parent.kpiActualValue / 100
                : parent.kpiActualValue; //add % symbol for percnatge value
            objKPI["(Budget) " + month + " " + parent.year] =
              parent.kpiInfo != "%"
                ? parent.kpiBudgetValue
                : parent.kpiBudgetValue != null
                ? parent.kpiBudgetValue / 100
                : parent.kpiBudgetValue;
            local.objCompanyKPIList.Results.push(objKPI);
          }
        } else {
          if (objKPI.KPI != undefined && objKPI.KPI != "") {
            local.objCompanyKPIList.Results.push(objKPI);
          }
        }
      }
      //child
      if (child.length > 0) {
        child.forEach(function (childData: any) {
          var month = local.miscService.getMonthName(childData.month);
          objKPI = {};
          var childKpiIndex = -1;
          var childDataKpiInfo =
            childData.kpiInfo === "$"
              ? local.model.reportingCurrencyDetail.currencyCode
              : childData.kpiInfo;
          local.objCompanyKPIList.Results.every(function (
            elem: any,
            index: any
          ) {
            let kpiName = childData.kpi;
            var kpiNameWithInfo = childData.kpi;
            if (childData.kpiInfo != null && childData.kpiInfo != "") {
              kpiName = "  - " + kpiName; // + " (" + childDataKpiInfo + ")";
              kpiNameWithInfo =
                "  - " + kpiName + " (" + childDataKpiInfo + ")";
            } else {
              kpiName = "  - " + kpiName;
              kpiNameWithInfo = "  - " + kpiName;
            }
            if (
              elem.KPI == kpiName &&
              elem.ParentKPI == childData.parentKPIID &&
              elem.KPIWithInfo === kpiNameWithInfo
            ) {
              childKpiIndex = index;
              return false;
            }
            return true;
          });

          if (childKpiIndex == -1) {
            if (childData.kpiInfo != null && childData.kpiInfo != "") {
              objKPI["KPI"] = "  - " + childData.kpi; // + " (" + childDataKpiInfo + ")";
              objKPI["KPIWithInfo"] =
                "  - " + childData.kpi + " (" + childDataKpiInfo + ")";
            } else {
              objKPI["KPI"] = "  - " + childData.kpi;
              objKPI["KPIWithInfo"] = "  - " + childData.kpi;
            }
            objKPI["ParentKPI"] = childData.parentKPIID;
            objKPI["KpiId"] = childData.companyKPIID;
          }
          var list = local.objCompanyKPIList.cols.filter(function (val: any) {
            return val.field == month + " " + childData.year;
          });
          if (list == null || list.length == 0) {
            local.objCompanyKPIList.cols.push({
              field: month + " " + childData.year,
              header: month + " " + childData.year,
            });
          }

          if (childKpiIndex >= 0) {
            local.objCompanyKPIList.Results[childKpiIndex][
              month + " " + childData.year
            ] =
              childData.kpiInfo != "%"
                ? childData.kpiActualValue
                : childData.kpiActualValue != null
                ? childData.kpiActualValue / 100
                : childData.kpiActualValue; //add % symbol for percnatge value//childData.kpiValue;
            local.objCompanyKPIList.Results[childKpiIndex][
              "(Budget) " + month + " " + childData.year
            ] =
              childData.kpiInfo != "%"
                ? childData.kpiBudgetValue
                : childData.kpiBudgetValue != null
                ? childData.kpiBudgetValue / 100
                : childData.kpiBudgetValue;
          } else {
            objKPI[month + " " + childData.year] =
              childData.kpiInfo != "%"
                ? childData.kpiActualValue
                : childData.kpiActualValue != null
                ? childData.kpiActualValue / 100
                : childData.kpiActualValue; //add % symbol for percnatge value//childData.kpiValue;
            objKPI["(Budget) " + month + " " + childData.year] =
              childData.kpiInfo != "%"
                ? childData.kpiBudgetValue
                : childData.kpiBudgetValue != null
                ? childData.kpiBudgetValue / 100
                : childData.kpiBudgetValue;
            local.objCompanyKPIList.Results.push(objKPI);
          }
        });
      }
    });

    local.objCompanyKPIList.cols = local.objCompanyKPIList.cols.filter(
      (x) => x.header.split(" ")[0] !== "(Budget)"
    );

    noSegmentKPIModel.forEach(function (data: any) {
      var parent = data.pcCompanyKPIMonthlyValueModel;
      var month = local.miscService.getMonthName(parent.month);
      var list = local.objCompanyKPIList.cols.filter(function (val: any) {
        return val.field == "(Budget) " + month + " " + parent.year;
      });
      if (list == null || list.length == 0) {
        local.objCompanyKPIList.cols.push({
          field: "(Budget) " + month + " " + parent.year,
          header: "(Budget) " + month + " " + parent.year,
        });
      }
    });

    this.objCompanyKPIList.cols.splice(0, 1);
    this.companyKPICols.push.apply(this.companyKPICols, this.frozenCols);
    this.companyKPICols.push.apply(
      this.companyKPICols,
      this.objCompanyKPIList.cols
    );
  }
  createColumnForCompanyKPI(kpiModel: any) {
    var local = this;
    kpiModel.forEach(function (data: any) {
      var parent = data.pcCompanyKPIMonthlyValueModel;
      var month = local.miscService.getMonthName(parent.month);
      if (local.objCompanyKPIList.cols.length == 0) {
        local.objCompanyKPIList.cols.push({ field: "KPI", header: "KPI" });
      }
      if (month != undefined) {
        var list = local.objCompanyKPIList.cols.filter(function (val: any) {
          return val.field == month + " " + parent.year;
        });
        if (list == null || list.length == 0) {
          local.objCompanyKPIList.cols.push({
            field: month + " " + parent.year,
            header: "(Actual) " + month + " " + parent.year,
          });
          local.objCompanyKPIList.cols.push({
            field: "(Budget) " + month + " " + parent.year,
            header: "(Budget) " + month + " " + parent.year,
          });
        }
      }
    });
  }

  /***************Company KPI*************[End]******************/
  /***************Impact KPI*************[Start]******************/

  objImpactKPIList: any = [];
  impactKPICols: any = [];
  modelImpactKpi: any = {};
  portfolioCompanyImpactKPIValuesList: any[];
  portfolioCompanyImpactKPIValuesListClone: any[];
  impactValueUnitTable: FinancialValueUnitsEnum =
    FinancialValueUnitsEnum.Absolute;
  impactKpiSearchFilter: any;
  expandedImpactKPIs: any[] = [];
  totalCompanyImpactKPIValuesRecords: number;

  impactKPIMultiSortMeta: any[] = [
    { field: "year", order: -1 },
    { field: "month", order: -1 },
  ];

  convertImpactKPIValueUnits() {
    let impactValueUnitTable = this.impactKpiValueUnit;
    let portfolioCompanyImpactKPIValuesListlocal = [];
    let local = this;
    this.portfolioCompanyImpactKPIValuesList = [];
    this.portfolioCompanyImpactKPIValuesListClone.forEach(function (
      value: any
    ) {
      let childPCImpactKPIQuarterlyValueModelListLocal = [];
      var valueClone = JSON.parse(JSON.stringify(value));
      if (valueClone.pcImpactKPIQuarterlyValueModel != null) {
        //if (valueClone.pcImpactKPIQuarterlyValueModel.kpiInfo != "%" && valueClone.pcImpactKPIQuarterlyValueModel.kpiInfo != "x") {
        if (
          valueClone.pcImpactKPIQuarterlyValueModel.kpiInfo != "%" &&
          valueClone.pcImpactKPIQuarterlyValueModel.kpiInfo != "x" &&
          valueClone.pcImpactKPIQuarterlyValueModel.kpiInfo != "#" &&
          valueClone.pcImpactKPIQuarterlyValueModel.kpiInfo != "" &&
          valueClone.pcImpactKPIQuarterlyValueModel.kpiActualValue != "" &&
          valueClone.pcImpactKPIQuarterlyValueModel.kpiActualValue != null
        ) {
          switch (Number(impactValueUnitTable.typeId)) {
            case FinancialValueUnitsEnum.Absolute:
              valueClone.childPCImpactKPIQuarterlyValueModelList.forEach(
                function (childValue: any) {
                  var childValueClone = JSON.parse(JSON.stringify(childValue));
                  childPCImpactKPIQuarterlyValueModelListLocal.push(
                    childValueClone
                  );
                }
              );
              valueClone.childPCImpactKPIQuarterlyValueModelList = childPCImpactKPIQuarterlyValueModelListLocal;

              break;
            case FinancialValueUnitsEnum.Thousands:
              if (
                valueClone.pcImpactKPIQuarterlyValueModel != null &&
                valueClone.pcImpactKPIQuarterlyValueModel.length != 0
              )
                valueClone.pcImpactKPIQuarterlyValueModel.kpiActualValue =
                  valueClone.pcImpactKPIQuarterlyValueModel.kpiActualValue /
                  1000;
              valueClone.childPCImpactKPIQuarterlyValueModelList.forEach(
                function (childValue: any) {
                  var childValueClone = JSON.parse(JSON.stringify(childValue));
                  childValueClone.kpiActualValue =
                    childValueClone.kpiActualValue / 1000;
                  childPCImpactKPIQuarterlyValueModelListLocal.push(
                    childValueClone
                  );
                }
              );
              valueClone.childPCImpactKPIQuarterlyValueModelList = childPCImpactKPIQuarterlyValueModelListLocal;
              break;
            case FinancialValueUnitsEnum.Millions:
              if (
                valueClone.pcImpactKPIQuarterlyValueModel != null &&
                valueClone.pcImpactKPIQuarterlyValueModel.length != 0
              )
                valueClone.pcImpactKPIQuarterlyValueModel.kpiActualValue =
                  valueClone.pcImpactKPIQuarterlyValueModel.kpiActualValue /
                  1000000;
              valueClone.childPCImpactKPIQuarterlyValueModelList.forEach(
                function (childValue: any) {
                  var childValueClone = JSON.parse(JSON.stringify(childValue));
                  childValueClone.kpiActualValue =
                    childValueClone.kpiActualValue / 1000000;
                  childPCImpactKPIQuarterlyValueModelListLocal.push(
                    childValueClone
                  );
                }
              );
              valueClone.childPCImpactKPIQuarterlyValueModelList = childPCImpactKPIQuarterlyValueModelListLocal;
              break;
            case FinancialValueUnitsEnum.Billions:
              if (
                valueClone.pcImpactKPIQuarterlyValueModel != null &&
                valueClone.pcImpactKPIQuarterlyValueModel.length != 0
              )
                valueClone.pcImpactKPIQuarterlyValueModel.kpiActualValue =
                  valueClone.pcImpactKPIQuarterlyValueModel.kpiActualValue /
                  1000000000;
              valueClone.childPCImpactKPIQuarterlyValueModelList.forEach(
                function (childValue: any) {
                  var childValueClone = JSON.parse(JSON.stringify(childValue));
                  childValueClone.kpiActualValue =
                    childValueClone.kpiActualValue / 1000000000;
                  childPCImpactKPIQuarterlyValueModelListLocal.push(
                    childValueClone
                  );
                }
              );
              valueClone.childPCImpactKPIQuarterlyValueModelList = childPCImpactKPIQuarterlyValueModelListLocal;
              break;
          }
        }
      }
      portfolioCompanyImpactKPIValuesListlocal.push(valueClone);
    });

    this.portfolioCompanyImpactKPIValuesList = portfolioCompanyImpactKPIValuesListlocal;
    this.createImpactKPILayOut(this.portfolioCompanyImpactKPIValuesList);
    this.portfolioCompanyImpactKPIValuesList.forEach(function (item) {
      item.fullMonth =
        item.pcImpactKPIQuarterlyValueModel.quarter +
        " " +
        item.pcImpactKPIQuarterlyValueModel.year;
    });
  }

  getPortfolioCompanyImpactKPIValues(event: any, searchFilter: any) {
    if (event == null) {
      event = {
        first: 0,
        rows: 1000,
        globalFilter: null,
        sortField: "ImpactKPI.KPI",
        multiSortMeta: this.impactKPIMultiSortMeta,
        sortOrder: -1,
      };
    }
    if (searchFilter == null) {
      var sortOrder =
        this.modelImpactKpi.orderType.type == OrderTypesEnum.LatestOnRight
          ? [
              { field: "year", order: 1 },
              { field: "quarter", order: 1 },
            ]
          : [
              { field: "year", order: -1 },
              { field: "quarter", order: -1 },
            ];
      searchFilter = {
        sortOrder: sortOrder,
        periodType: this.modelImpactKpi.periodType.type,
      };
      if (searchFilter.periodType == "Date Range") {
        searchFilter.startPeriod = new Date(
          Date.UTC(
            this.modelImpactKpi.startPeriod.getFullYear(),
            this.modelImpactKpi.startPeriod.getMonth(),
            this.modelImpactKpi.startPeriod.getDate()
          )
        );
        searchFilter.endPeriod = new Date(
          Date.UTC(
            this.modelImpactKpi.endPeriod.getFullYear(),
            this.modelImpactKpi.endPeriod.getMonth(),
            this.modelImpactKpi.endPeriod.getDate()
          )
        );
      }
    } else {
      if (searchFilter.periodType == "Date Range") {
        searchFilter.startPeriod = new Date(
          Date.UTC(
            searchFilter.startPeriod.getFullYear(),
            searchFilter.startPeriod.getMonth(),
            searchFilter.startPeriod.getDate()
          )
        );
        searchFilter.endPeriod = new Date(
          Date.UTC(
            searchFilter.endPeriod.getFullYear(),
            searchFilter.endPeriod.getMonth(),
            searchFilter.endPeriod.getDate()
          )
        );
      }
    }
    this.impactKpiSearchFilter = searchFilter;
    this.portfolioCompanyService
      .getPortfolioCompanyImpactKPIValues({
        portfolioCompanyID: this.model.portfolioCompanyID,
        paginationFilter: event,
        searchFilter: searchFilter,
      })
      .subscribe(
        (result) => {
          let resp = result; // JSON.parse(result._body);
          if (resp != null && resp.code == "OK") {
            this.portfolioCompanyImpactKPIValuesList = resp.body;
            this.portfolioCompanyImpactKPIValuesListClone = JSON.parse(
              JSON.stringify(this.portfolioCompanyImpactKPIValuesList)
            );
            this.convertImpactKPIValueUnits();

            this.expandedImpactKPIs = [];
            if (this.portfolioCompanyImpactKPIValuesList.length > 0) {
              this.expandedImpactKPIs.push(
                this.portfolioCompanyImpactKPIValuesList[0]
              );
            }
            this.totalCompanyImpactKPIValuesRecords = resp.body.totalRecords;
          } else {
            this.portfolioCompanyImpactKPIValuesList = [];
            this.totalCompanyImpactKPIValuesRecords = 0;
            this.createImpactKPILayOut(
              this.portfolioCompanyImpactKPIValuesList
            );
          }
        },
        (error) => {
          this.accountService.redirectToLogin(error);
        }
      );
  }
  createImpactKPILayOut(kpiModel: any) {
    this.objImpactKPIList = [];
    this.objImpactKPIList.cols = [];
    this.objImpactKPIList.Results = [];
    var local = this;
    // This function is created to get all the month and years for the column name
    //without making any changes in old logic
    this.createColumnForImpactKPI(kpiModel);
    kpiModel.forEach(function (data: any) {
      var objKPI: any = {};
      var parent = data.pcImpactKPIQuarterlyValueModel;
      var child = data.childPCImpactKPIQuarterlyValueModelList;
      //for parent
      if (parent.impactKPI.kpi != "") {
        var quarter = parent.quarter;

        var kpiIndex = -1;
        local.objImpactKPIList.Results.every(function (elem: any, index: any) {
          let kpiName = parent.impactKPI.kpi;
          let kpiNameWithInfo = parent.impactKPI.kpi;
          if (parent.kpiInfo != null && parent.kpiInfo != "") {
            kpiName = kpiName;
            kpiNameWithInfo = kpiName + " (" + parent.kpiInfo + ")";
          }
          if (elem.KPI === kpiName && elem.KPIWithInfo === kpiNameWithInfo) {
            kpiIndex = index;
            return false;
          }
          return true;
        });

        if (kpiIndex == -1) {
          if (parent.kpiInfo != null && parent.kpiInfo != "") {
            objKPI["KPI"] = parent.impactKPI.kpi;
            objKPI["KPIWithInfo"] =
              parent.impactKPI.kpi + " (" + parent.kpiInfo + ")";
          } else {
            objKPI["KPI"] = parent.impactKPI.kpi;
            objKPI["KPIWithInfo"] = parent.impactKPI.kpi;
          }
          objKPI["KpiId"] = parent.impactKPI.impactKPIId;
          objKPI["IsParent"] = parent.impactKPI.isParent;
        }
        if (quarter != undefined) {
          var list = local.objImpactKPIList.cols.filter(function (val: any) {
            return val.field == quarter + " " + parent.year;
          });
          if (list == null || list.length == 0) {
            local.objImpactKPIList.cols.push({
              field: quarter + " " + parent.year,
              header: quarter + " " + parent.year,
            });
            //local.objImpactKPIList.cols.push({ field: "(Budget) " + quarter + " " + parent.year, header: "(Budget) " + quarter + " " + parent.year });
          }

          if (kpiIndex >= 0) {
            local.objImpactKPIList.Results[kpiIndex][
              quarter + " " + parent.year
            ] =
              parent.kpiInfo != "%"
                ? parent.kpiActualValue
                : parent.kpiActualValue / 100; //add % symbol for percnatge value
            // local.objImpactKPIList.Results[kpiIndex]["(Budget) " + quarter + " " + parent.year] = parent.kpiInfo != "%" ? parent.kpiBudgetValue : parent.kpiBudgetValue / 100;
          } else {
            objKPI[quarter + " " + parent.year] =
              parent.kpiInfo != "%"
                ? parent.kpiActualValue
                : parent.kpiActualValue / 100; //add % symbol for percnatge value
            //objKPI["(Budget) " + quarter + " " + parent.year] = parent.kpiInfo != "%" ? parent.kpiBudgetValue : parent.kpiBudgetValue / 100;
            local.objImpactKPIList.Results.push(objKPI);
          }
        } else {
          if (objKPI.KPI != undefined && objKPI.KPI != "") {
            local.objImpactKPIList.Results.push(objKPI);
          }
        }
      }
      //child
      if (child.length > 0) {
        var childCounter = 1;
        child.forEach(function (childData: any) {
          var quarter = childData.quarter;
          objKPI = {};
          var childKpiIndex = -1;
          var parentKPIIndex = -1;
          local.objImpactKPIList.Results.every(function (
            elem: any,
            index: any
          ) {
            let kpiName = childData.impactKPI.kpi;
            let kpiNameWithInfo = childData.impactKPI.kpi;
            if (childData.kpiInfo != null && childData.kpiInfo != "") {
              kpiName = "  - " + kpiName;
              kpiNameWithInfo =
                "  - " + kpiNameWithInfo + " (" + childData.kpiInfo + ")";
            } else {
              kpiName = "  - " + kpiName;
              kpiNameWithInfo = "  - " + kpiNameWithInfo;
            }
            if (
              elem.KPI == kpiName &&
              elem.ParentKPI == childData.impactKPI.parentId &&
              elem.KPIWithInfo == kpiNameWithInfo
            ) {
              childKpiIndex = index;
              return false;
            }
            // if(elem.KpiId==childData.parentKPIID){
            //   parentKPIIndex=index;
            // }
            return true;
          });

          if (childKpiIndex == -1) {
            if (childData.kpiInfo != null && childData.kpiInfo != "") {
              objKPI["KPI"] = "  - " + childData.impactKPI.kpi;
              objKPI["KPIWithInfo"] =
                "  - " +
                childData.impactKPI.kpi +
                " (" +
                childData.kpiInfo +
                ")";
            } else {
              objKPI["KPI"] = "  - " + childData.impactKPI.kpi;
              objKPI["KPIWithInfo"] = "  - " + childData.impactKPI.kpi;
            }
            objKPI["ParentKPI"] = childData.impactKPI.parentId;
            objKPI["KpiId"] = childData.impactKPIID;
            objKPI["IsParent"] = childData.impactKPI.isParent;
          }
          var list = local.objImpactKPIList.cols.filter(function (val: any) {
            return val.field == quarter + " " + childData.year;
          });
          if (list == null || list.length == 0) {
            local.objImpactKPIList.cols.push({
              field: quarter + " " + childData.year,
              header: quarter + " " + childData.year,
            });
            // local.objImpactKPIList.cols.push({ field: "(Budget) " + quarter + " " + childData.year, header: "(Budget) " + quarter + " " + childData.year });
          }

          if (childKpiIndex >= 0) {
            local.objImpactKPIList.Results[childKpiIndex][
              quarter + " " + childData.year
            ] =
              childData.kpiInfo != "%"
                ? childData.kpiActualValue
                : childData.kpiActualValue / 100; //add % symbol for percnatge value//childData.kpiValue;
            //local.objImpactKPIList.Results[childKpiIndex]["(Budget) " + quarter + " " + childData.year] = childData.kpiInfo != "%" ? childData.kpiBudgetValue : childData.kpiBudgetValue / 100;
          } else {
            objKPI[quarter + " " + childData.year] =
              childData.kpiInfo != "%"
                ? childData.kpiActualValue
                : childData.kpiActualValue / 100; //add % symbol for percnatge value//childData.kpiValue;
            //objKPI["(Budget) " + quarter + " " + childData.year] = childData.kpiInfo != "%" ? childData.kpiBudgetValue : childData.kpiBudgetValue / 100;

            local.objImpactKPIList.Results.forEach(function (
              elem: any,
              index: any
            ) {
              if (objKPI.ParentKPI == elem.KpiId) {
                parentKPIIndex = index;
              }
            });
            if (parentKPIIndex > -1) {
              local.objImpactKPIList.Results.splice(
                parentKPIIndex + childCounter,
                0,
                objKPI
              );
              childCounter++;
            } else {
              local.objImpactKPIList.Results.push(objKPI);
            }
          }
        });
      }
    });

    this.objImpactKPIList.cols.splice(0, 1);
    this.objImpactKPIList.cols.sort(this.sortByQuarterYear);
    this.impactKPICols.push.apply(this.impactKPICols, this.frozenCols);
    this.impactKPICols.push.apply(
      this.impactKPICols,
      this.objImpactKPIList.cols
    );
  }
  sortByQuarterYear(lhs: any, rhs: any) {
    var quarterToMonthMap = {
      Q1: 0,
      Q2: 3,
      Q3: 6,
      Q4: 9,
    };
    var lhsQuarterYear = lhs.field.split(" ");
    var rhsQuarterYear = rhs.field.split(" ");
    var lMonth = quarterToMonthMap[lhsQuarterYear[0]];
    var rMonth = quarterToMonthMap[rhsQuarterYear[0]];
    var lhsDate = new Date(lhsQuarterYear[1], lMonth);
    var rhsDate = new Date(rhsQuarterYear[1], rMonth);
    return lhsDate.getTime() - rhsDate.getTime();
  }
  // This function is created to get all the quarter and years for the column name
  createColumnForImpactKPI(kpiModel: any) {
    var local = this;
    kpiModel.forEach(function (data: any) {
      var parent = data.pcImpactKPIQuarterlyValueModel;
      var quarter = parent.quarter;
      if (local.objImpactKPIList.cols.length == 0) {
        local.objImpactKPIList.cols.push({ field: "KPI", header: "KPI" });
      }
      if (quarter != undefined) {
        var list = local.objImpactKPIList.cols.filter(function (val: any) {
          return val.field == quarter + " " + parent.year;
        });
        if (list == null || list.length == 0) {
          local.objImpactKPIList.cols.push({
            field: quarter + " " + parent.year,
            header: quarter + " " + parent.year,
          });
        }
      }
    });
  }
  /***************Impact KPI*************[End]******************/
  LPReport() {
    this.exportLoading = true;
    this.portfolioCompanyService.pdfExport({ Value: this.id }).subscribe(
      (results) => {
        this.miscService.downloadPDFFile(results);
        this.exportLoading = false;
      },
      (error) => {
        this.exportLoading = false;
        this.miscService.redirectToLogin(error);
      }
    );
  }
    exportInvestmentKpiValues() {
    let event = {
      first: 0,
      rows: 1000,
      globalFilter: null,
      sortField: "InvestmentKPI.KPI",
      multiSortMeta: this.financialKPIMultiSortMeta,
      sortOrder: -1,
    };
    let filter = {
      currency: "USD",
      decimaPlace: this.modelInvestmentKpi.decimalPlaces.type,
      valueType: this.investmentKpiValueUnit.typeId,
    };
    this.exportInvestmentKPILoading = true;
    this.portfolioCompanyService
      .exportInvestmentKPIList({
        portfolioCompanyDetail: { companyName: this.model.companyName },
        portfolioCompanyID: this.model.portfolioCompanyID.toString(),
        paginationFilter: event,
        searchFilter: this.financialKpiSearchFilter,
        kPIFilter: filter,
      })
      .subscribe(
        (response) => {
          this.miscService.downloadExcelFile(response);
          this.exportInvestmentKPILoading = false;
        },
        (error) => {
          this.message = this.miscService.showAlertMessages(
            "error",
            ErrorMessage.SomethingWentWrong
          );
          this.exportInvestmentKPILoading = false;
        }
      );
  }

  exportImpactKpiValues() {
    let event = {
      first: 0,
      rows: 1000,
      globalFilter: null,
      sortField: "ImpactKPI.KPI",
      multiSortMeta: this.financialKPIMultiSortMeta,
      sortOrder: -1,
    };
    let filter = {
      currency: this.model.reportingCurrencyDetail.currency,
      decimaPlace: this.modelImpactKpi.decimalPlaces.type,
      valueType: this.impactKpiValueUnit.typeId,
    };
    this.exportImpactKPILoading = true;
    this.portfolioCompanyService
      .exportImpactKPIList({
        portfolioCompanyDetail: { companyName: this.model.companyName },
        portfolioCompanyID: this.model.portfolioCompanyID.toString(),
        paginationFilter: event,
        searchFilter: this.impactKpiSearchFilter,
        kPIFilter: filter,
      })
      .subscribe(
        (response) => {
          this.miscService.downloadExcelFile(response);
          this.exportImpactKPILoading = false;
        },
        (error) => {
          this.exportImpactKPILoading = false;
          this.message = this.miscService.showAlertMessages(
            "error",
            ErrorMessage.SomethingWentWrong
          );
        }
      );
  }

  exportCompanyKpiValues() {
    let event = {
      first: 0,
      rows: 1000,
      globalFilter: null,
      sortField: "CompanywiseKPI.KPI",
      multiSortMeta: this.financialKPIMultiSortMeta,
      sortOrder: -1,
    };
    let filter = {
      currency: this.model.reportingCurrencyDetail.currency,
      decimaPlace: this.modelCompanyKpi.decimalPlaces.type,
      valueType: this.companyKpiValueUnit.typeId,
    };
    this.exportCompanyKPILoading = true;
    this.portfolioCompanyService
      .exportCompanywiseKPIList({
        portfolioCompanyDetail: this.model,
        portfolioCompanyID: this.model.portfolioCompanyID.toString(),
        paginationFilter: event,
        searchFilter: this.companyKpiSearchFilter,
        kPIFilter: filter,
      })
      .subscribe(
        (response) => {
          this.exportCompanyKPILoading = false;
          this.miscService.downloadExcelFile(response);
        },
        (error) => {
          this.exportCompanyKPILoading = false;
          this.message = this.miscService.showAlertMessages(
            "error",
            ErrorMessage.SomethingWentWrong
          );
        }
      );
  }

  portfolioInfoSectionModel: any = {};
  openInfoSectionDialog(portfolioInfoSectionModel: any, sectionName: any) {
    this.modalOption.backdrop = "static";
    this.modalOption.keyboard = false;
    this.modalOption.size = "lg";
    this.modalOption.centered = true;
    portfolioInfoSectionModel.sectionName = sectionName;
    let copy = JSON.parse(JSON.stringify(portfolioInfoSectionModel));
    this.currentModelRef = this.modalService.open(
      UpdateInfoSectionComponent,
      this.modalOption
    );
    //this.currentModelRef.componentInstance.financialKPIList = this.financialKPIsById;
    this.currentModelRef.componentInstance.model = copy;
    this.currentModelRef.componentInstance.sectionName = sectionName;

    this.currentModelRef.componentInstance.portfolioCompanyCommentaryDetails = this.portfolioCompanyCommentaryDetails;

    this.currentModelRef.componentInstance.onSave.subscribe((status: any) => {
      this.closeInfoSectionDialog(status);
    });
  }
  closeInfoSectionDialog(status: any) {
    //this.getPortfolioCompanyCommentarySections(undefined);
    this.getPortfolioCompanies();
    this.currentModelRef.close();

    this.message = this.miscService.showAlertMessages(
      "success",
      status.message
    );
  }
}
