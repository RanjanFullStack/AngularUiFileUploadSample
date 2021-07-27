import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  ViewChild,
} from "@angular/core";
import { FormGroup } from "@angular/forms";
import { Message } from "primeng/components/common/api";
import { MessageService } from "primeng/components/common/messageservice";
import { isNumeric } from "rxjs/util/isNumeric";
import { AccountService } from "../../services/account.service";
import {
  ErrorMessage,
  MiscellaneousService,
  OrderTypesEnum,
  PeriodTypeEnum,
} from "../../services/miscellaneous.service";
import { FeaturesEnum } from "../../services/permission.service";
import { PortfolioCompanyService } from "../../services/portfolioCompany.service";

@Component({
  selector: "financials",
  templateUrl: "./portfolioCompany-financials.report.html",
  providers: [MessageService],
})
export class PortfolioCompanyFinancialsReportComponent
  implements OnInit, OnChanges, AfterViewInit {
  @ViewChild("menutabs") el: ElementRef;
  @Input() masterModel: any = {};
  reportForm: FormGroup;
  balanceSheetSearchFilter: any;
  profitAndLossSearchFilter: any;
  portfolioCompanyList: any[];
  portfolioCompanyListClone: any[];
  msgTimeSpan: number;
  portfolioCompanyLoading: boolean;
  periodListFilter: any;
  lastReportedOn: any;
  lastReportedOnList: any = [];
  peerComparisionLoading: boolean = false;
  yearRange: any;
  message: any;
  blankSpace: any = "&nbsp";
  msgs: Message[] = [];
  feature: typeof FeaturesEnum = FeaturesEnum;
  dateRange: any[];
  dataFilter: any = {};
  filterSection: boolean = true;

  loading: boolean = false;
  balanceSheetLoading: boolean = false;
  profitLossLoading: boolean = false;
  cashflowLoading: boolean = false;
  frozenBalanceSheetCols: any = [{ field: "KPI", header: "KPI" }];

  frozenProfitAndLossCols: any = [{ field: "KPI", header: "KPI" }];

  frozenCashFlowCols: any = [{ field: "KPI", header: "KPI" }];

  periodTypes: any;
  id: any;
  portfolioCompanyID: any;
  data: any[] = [];
  today: Date;
  portfolioCompanyNameList: any = "";
  portfolioCompanyNameListForChart: any[];
  portfolioCompanyNameListForChartArray: any[];

  objPCBalanceSheetItemList: any = [];
  portfolioCompanyBalanceSheetValuesList: any[];
  portfolioCompanyBalanceSheetValuesListClone: any[];
  totalCompanyBalanceSheetValuesRecords: number;
  blockedPCBalanceSheetValuesTable: boolean = false;
  expandedCompanyBalanceSheetItems: any[] = [];
  balanceSheetValuesMultiSortMeta: any[] = [
    { field: "year", order: -1 },
    { field: "month", order: -1 },
  ];

  objPCProfitAndLossItemList: any = [];
  portfolioCompanyProfitAndLossValuesList: any[];
  portfolioCompanyProfitAndLossValuesListClone: any[];
  totalCompanyProfitAndLossValuesRecords: number;
  blockedPCProfitAndLossValuesTable: boolean = false;
  expandedCompanyProfitAndLossItems: any[] = [];
  profitAndLossValuesMultiSortMeta: any[] = [
    { field: "year", order: -1 },
    { field: "month", order: -1 },
  ];

  objPCCashFlowItemList: any = [];
  portfolioCompanyCashFlowValuesList: any[];
  portfolioCompanyCashFlowValuesListClone: any[];
  totalCompanyCashFlowValuesRecords: number;
  blockedPCCashFlowValuesTable: boolean = false;
  expandedCompanyCashFlowItems: any[] = [];
  cashFlowValuesMultiSortMeta: any[] = [
    { field: "year", order: -1 },
    { field: "month", order: -1 },
  ];

  showActionCol: boolean = true;
  itemList = [];
  selectedItems = [];
  settings = {};
  model: any = {
    isAscending: false,
    portfolioCompany: null,
  };
  frozenCols: any = [{ field: "Month", header: "Month" }];
  SegmentTypeList: any[] = [];
  selectedSegmentType: any;
  constructor(
    private miscService: MiscellaneousService,
    private accountService: AccountService,
    private portfolioCompanyService: PortfolioCompanyService,
    protected changeDetectorRef: ChangeDetectorRef
  ) {
    this.msgTimeSpan = this.miscService.getMessageTimeSpan();
    var year = new Date();
    this.today = year;
    this.yearRange = "2000:" + year.getFullYear();
    this.periodTypes = [
      { type: PeriodTypeEnum.Last3Month },
      { type: PeriodTypeEnum.Last6Month },
      { type: PeriodTypeEnum.YearToDate },
      { type: PeriodTypeEnum.Last1Year },
      { type: PeriodTypeEnum.DateRange },
    ];

    this.model.periodType = { type: PeriodTypeEnum.Last1Year };
    this.model.orderType = [{ type: OrderTypesEnum.LatestOnLeft }];
    this.model.periodType = { type: PeriodTypeEnum.Last1Year };
    let lastSixthMonthDate = new Date();
    lastSixthMonthDate.setDate(1);
    lastSixthMonthDate.setMonth(lastSixthMonthDate.getMonth() - 6);
    let currentDateRange: any[] = [lastSixthMonthDate, new Date()];
    this.dateRange = currentDateRange;
    this.model.fromDate = lastSixthMonthDate;
    this.model.toDate = new Date();
  }
  ngOnInit() {
    this.getPortfolioCompanyList();
  }

  ngOnChanges() {}
  ngAfterViewInit() {}
  bindReportMasterModel() {
    this.portfolioCompanyList = this.masterModel.portfolioCompanyList;
    this.portfolioCompanyListClone = this.masterModel.portfolioCompanyList;
  }

  getPCBalanceSheetValues(
    event: any,
    searchFilter: any,
    companyId: any = undefined
  ) {
    if (event == null) {
      event = {
        first: 0,
        rows: 1000,
        globalFilter: null,
        sortField: "displayOrder",
        multiSortMeta: this.balanceSheetValuesMultiSortMeta,
        sortOrder: -1,
      };
    }

    if (searchFilter == null) {
      var sortOrder =
        this.model.orderType.type == OrderTypesEnum.LatestOnRight
          ? [
              { field: "year", order: 1 },
              { field: "month", order: 1 },
            ]
          : [
              { field: "year", order: -1 },
              { field: "month", order: -1 },
            ];
      searchFilter = {
        sortOrder: null,
        periodType: this.model.periodType.type,
      };
      if (searchFilter.periodType == "Date Range") {
        searchFilter.startPeriod = new Date(
          Date.UTC(
            this.model.startPeriod.getFullYear(),
            this.model.startPeriod.getMonth(),
            this.model.startPeriod.getDate()
          )
        );
        searchFilter.endPeriod = new Date(
          Date.UTC(
            this.model.endPeriod.getFullYear(),
            this.model.endPeriod.getMonth(),
            this.model.endPeriod.getDate()
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

    this.loading = true;

    this.balanceSheetSearchFilter = searchFilter;
    companyId = companyId == undefined ? this.id : companyId;
    this.blockedPCBalanceSheetValuesTable = true;
    this.portfolioCompanyService
      .getPCBalanceSheetValues({
        PortfolioCompanyID: companyId,
        paginationFilter: event,
        searchFilter: searchFilter,
        segmentType: this.selectedSegmentType,
      })
      .subscribe(
        (result) => {
          let resp = result;
          if (resp != null && resp.code == "OK") {
            this.portfolioCompanyBalanceSheetValuesList = resp.body;
            this.portfolioCompanyBalanceSheetValuesListClone = JSON.parse(
              JSON.stringify(this.portfolioCompanyBalanceSheetValuesList)
            );

            this.createPCBalanceSheetValuesLayOut(
              this.portfolioCompanyBalanceSheetValuesList
            );
            this.portfolioCompanyBalanceSheetValuesList.forEach(function (
              item
            ) {
              item.fullMonth =
                item.pcBalanceSheetValuesModel.month +
                " " +
                item.pcBalanceSheetValuesModel.year;
            });

            this.expandedCompanyBalanceSheetItems = [];
            if (this.portfolioCompanyBalanceSheetValuesList.length > 0) {
              this.expandedCompanyBalanceSheetItems.push(
                this.portfolioCompanyBalanceSheetValuesList[0]
              );
            }
            this.totalCompanyBalanceSheetValuesRecords = resp.body.totalRecords;
          } else {
            this.portfolioCompanyBalanceSheetValuesList = [];
            this.totalCompanyBalanceSheetValuesRecords = 0;
            this.createPCBalanceSheetValuesLayOut(
              this.portfolioCompanyBalanceSheetValuesList
            );
          }
          this.blockedPCBalanceSheetValuesTable = false;
          this.loading = false;

          this.changeDetectorRef.markForCheck();
        },
        (error) => {
          this.blockedPCBalanceSheetValuesTable = false;
          this.accountService.redirectToLogin(error);
          this.loading = false;
        }
      );
  }

  createPCBalanceSheetValuesLayOut(balanceSheetModel: any) {
    this.objPCBalanceSheetItemList = [];
    this.objPCBalanceSheetItemList.cols = [];
    this.objPCBalanceSheetItemList.Results = [];
    var local = this;

    this.createColumnForCompanyBalanceSheetItems(balanceSheetModel);
    balanceSheetModel.forEach(function (data: any) {
      var objKPI: any = {};
      var parent = data.pcBalanceSheetValuesModel;
      var child = data.childPCBalanceSheetValuesList;

      if (parent.balanceSheetLineItem != "") {
        var month = local.miscService.getMonthName(parent.month);

        var kpiIndex = -1;
        local.objPCBalanceSheetItemList.Results.every(function (
          elem: any,
          index: any
        ) {
          let balanceSheetLineItemName = parent.balanceSheetLineItem;

          if (
            elem.KPI === balanceSheetLineItemName &&
            elem.BalanceSheetLineItemId === parent.balanceSheetLineItemID
          ) {
            kpiIndex = index;
            return false;
          }
          return true;
        });

        if (kpiIndex == -1) {
          objKPI["KPI"] = parent.balanceSheetLineItem;
          objKPI["IsHeader"] = parent.isHeader;

          objKPI["BalanceSheetLineItemId"] = parent.balanceSheetLineItemID;
        }
        if (month != undefined) {
          var list = local.objPCBalanceSheetItemList.cols.filter(function (
            val: any
          ) {
            return val.field == month + " " + parent.year;
          });
          if (list == null || list.length == 0) {
            local.objPCBalanceSheetItemList.cols.push({
              field: month + " " + parent.year,
              header: month + " " + parent.year,
            });
          }

          if (kpiIndex >= 0) {
            local.objPCBalanceSheetItemList.Results[kpiIndex][
              month + " " + parent.year
            ] = parent.actualValue;
            local.objPCBalanceSheetItemList.Results[kpiIndex][
              "(Budget) " + month + " " + parent.year
            ] = parent.budgetValue;
          } else {
            objKPI[month + " " + parent.year] = parent.actualValue;
            objKPI["(Budget) " + month + " " + parent.year] =
              parent.budgetValue;

            local.objPCBalanceSheetItemList.Results.push(objKPI);
          }
        } else {
          if (objKPI.KPI != undefined && objKPI.KPI != "") {
            local.objPCBalanceSheetItemList.Results.push(objKPI);
          }
        }
      }

      if (child.length > 0) {
        child.forEach(function (childData: any) {
          var month = local.miscService.getMonthName(childData.month);
          objKPI = {};
          var childKpiIndex = -1;
          local.objPCBalanceSheetItemList.Results.every(function (
            elem: any,
            index: any
          ) {
            let balanceSheetLineItemName = childData.balanceSheetLineItem;

            balanceSheetLineItemName = "  - " + balanceSheetLineItemName;

            if (
              elem.KPI == balanceSheetLineItemName &&
              elem.ParentBalanceSheetLineItemId == childData.parentID
            ) {
              childKpiIndex = index;
              return false;
            }
            return true;
          });

          if (childKpiIndex == -1) {
            objKPI["KPI"] = "  - " + childData.balanceSheetLineItem;

            objKPI["ParentBalanceSheetLineItemId"] = childData.parentID;
            objKPI["BalanceSheetLineItemId"] = childData.balanceSheetLineItemID;
            objKPI["IsHeader"] = childData.isHeader;
          }
          var list = local.objPCBalanceSheetItemList.cols.filter(function (
            val: any
          ) {
            return val.field == month + " " + childData.year;
          });
          if (list == null || list.length == 0) {
            local.objPCBalanceSheetItemList.cols.push({
              field: month + " " + childData.year,
              header: month + " " + childData.year,
            });
          }

          if (childKpiIndex >= 0) {
            local.objPCBalanceSheetItemList.Results[childKpiIndex][
              month + " " + childData.year
            ] = childData.actualValue;

            local.objPCBalanceSheetItemList.Results[childKpiIndex][
              "(Budget) " + month + " " + childData.year
            ] = childData.budgetValue;
          } else {
            objKPI[month + " " + childData.year] = childData.actualValue;

            objKPI["(Budget) " + month + " " + childData.year] =
              childData.budgetValue;

            local.objPCBalanceSheetItemList.Results.push(objKPI);
          }
        });
      }
    });
    local.objPCBalanceSheetItemList.cols = local.objPCBalanceSheetItemList.cols.filter(
      (x) => x.header.split(" ")[0] !== "(Budget)"
    );

    balanceSheetModel.forEach(function (data: any) {
      var parent = data.pcBalanceSheetValuesModel;
      var month = local.miscService.getMonthName(parent.month);
      var list = local.objPCBalanceSheetItemList.cols.filter(function (
        val: any
      ) {
        return val.field == "(Budget) " + month + " " + parent.year;
      });
      if (list == null || list.length == 0) {
        local.objPCBalanceSheetItemList.cols.push({
          field: "(Budget) " + month + " " + parent.year,
          header: "(Budget) " + month + " " + parent.year,
        });
      }
    });
    this.objPCBalanceSheetItemList.cols.splice(0, 1);
    var budgetArray = this.objPCBalanceSheetItemList.cols.filter(
      (x) => x.field.split(" ")[0] === "(Budget)"
    );
    var actualArray = this.objPCBalanceSheetItemList.cols.filter(
      (x) => x.field.split(" ")[0] !== "(Budget)"
    );
    budgetArray.sort(this.sortByMonthYearDate);
    actualArray.sort(this.sortByMonthYearDate);

    this.objPCBalanceSheetItemList.cols = actualArray.concat(budgetArray);
  }

  createColumnForCompanyBalanceSheetItems(balanceSheetModel: any) {
    var local = this;
    balanceSheetModel.forEach(function (data: any) {
      var parent = data.pcBalanceSheetValuesModel;
      var month = local.miscService.getMonthName(parent.month);
      if (local.objPCBalanceSheetItemList.cols.length == 0) {
        local.objPCBalanceSheetItemList.cols.push({
          field: "KPI",
          header: "KPI",
        });
      }
      if (month != undefined) {
        var list = local.objPCBalanceSheetItemList.cols.filter(function (
          val: any
        ) {
          return val.field == month + " " + parent.year;
        });
        if (list == null || list.length == 0) {
          local.objPCBalanceSheetItemList.cols.push({
            field: month + " " + parent.year,
            header: "(Actual) " + month + " " + parent.year,
          });
          local.objPCBalanceSheetItemList.cols.push({
            field: "(Budget) " + month + " " + parent.year,
            header: "(Budget) " + month + " " + parent.year,
          });
        }
      }
    });
  }

  getPCProfitAndLossValues(
    event: any,
    searchFilter: any,
    companyId: any = undefined
  ) {
    if (event == null) {
      event = {
        first: 0,
        rows: 1000,
        globalFilter: null,
        sortField: "displayOrder",
        multiSortMeta: this.profitAndLossValuesMultiSortMeta,
        sortOrder: -1,
      };
    }

    if (searchFilter == null) {
      var sortOrder =
        this.model.orderType.type == OrderTypesEnum.LatestOnRight
          ? [
              { field: "year", order: 1 },
              { field: "month", order: 1 },
            ]
          : [
              { field: "year", order: -1 },
              { field: "month", order: -1 },
            ];
      searchFilter = {
        sortOrder: null,
        periodType: this.model.periodType.type,
      };
      if (searchFilter.periodType == "Date Range") {
        searchFilter.startPeriod = new Date(
          Date.UTC(
            this.model.startPeriod.getFullYear(),
            this.model.startPeriod.getMonth(),
            this.model.startPeriod.getDate()
          )
        );
        searchFilter.endPeriod = new Date(
          Date.UTC(
            this.model.endPeriod.getFullYear(),
            this.model.endPeriod.getMonth(),
            this.model.endPeriod.getDate()
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

    companyId = companyId == undefined ? this.id : companyId;
    this.blockedPCProfitAndLossValuesTable = true;
    this.portfolioCompanyService
      .getPCProfitAndLossValues({
        PortfolioCompanyID: companyId,
        paginationFilter: event,
        searchFilter: searchFilter,
        segmentType: this.selectedSegmentType,
      })
      .subscribe(
        (result) => {
          let resp = result;
          if (resp != null && resp.code == "OK") {
            this.portfolioCompanyProfitAndLossValuesList = resp.body;
            this.portfolioCompanyProfitAndLossValuesListClone = JSON.parse(
              JSON.stringify(this.portfolioCompanyProfitAndLossValuesList)
            );

            this.createPCProfitAndLossValuesLayOut(
              this.portfolioCompanyProfitAndLossValuesList
            );
            this.portfolioCompanyProfitAndLossValuesList.forEach(function (
              item
            ) {
              item.fullMonth =
                item.pcProfitAndLossValuesModel.month +
                " " +
                item.pcProfitAndLossValuesModel.year;
            });

            this.expandedCompanyProfitAndLossItems = [];
            if (this.portfolioCompanyProfitAndLossValuesList.length > 0) {
              this.expandedCompanyProfitAndLossItems.push(
                this.portfolioCompanyProfitAndLossValuesList[0]
              );
            }
            this.totalCompanyProfitAndLossValuesRecords =
              resp.body.totalRecords;
          } else {
            this.portfolioCompanyProfitAndLossValuesList = [];
            this.totalCompanyProfitAndLossValuesRecords = 0;
            this.createPCProfitAndLossValuesLayOut(
              this.portfolioCompanyProfitAndLossValuesList
            );
          }
          this.blockedPCProfitAndLossValuesTable = false;

          this.changeDetectorRef.markForCheck();
        },
        (error) => {
          this.blockedPCProfitAndLossValuesTable = false;
          this.accountService.redirectToLogin(error);
        }
      );
  }

  createPCProfitAndLossValuesLayOut(profitAndLossModel: any) {
    this.objPCProfitAndLossItemList = [];
    this.objPCProfitAndLossItemList.cols = [];
    this.objPCProfitAndLossItemList.Results = [];
    var local = this;

    this.createColumnForCompanyProfitAndLossItems(profitAndLossModel);
    profitAndLossModel.forEach(function (data: any) {
      var objKPI: any = {};
      var parent = data.pcProfitAndLossValuesModel;
      var child = data.childPCProfitAndLossValuesList;

      if (parent.profitAndLossLineItem != "") {
        var month = local.miscService.getMonthName(parent.month);

        var kpiIndex = -1;
        local.objPCProfitAndLossItemList.Results.every(function (
          elem: any,
          index: any
        ) {
          let profitAndLossLineItemName = parent.profitAndLossLineItem;
          let profitAndLossLineItemNameID = parent.profitAndLossLineItemID;
          if (
            elem.KPI === profitAndLossLineItemName &&
            elem.ProfitAndLossLineItemId === profitAndLossLineItemNameID
          ) {
            kpiIndex = index;
            return false;
          }
          return true;
        });

        if (kpiIndex == -1) {
          objKPI["KPI"] = parent.profitAndLossLineItem;
          objKPI["IsHeader"] = parent.isHeader;

          objKPI["KPIWithInfo"] =
            parent.profitAndLossLineItem + " (" + parent.valueInfo + ")";

          objKPI["ProfitAndLossLineItemId"] = parent.profitAndLossLineItemID;
        }
        if (month != undefined) {
          var list = local.objPCProfitAndLossItemList.cols.filter(function (
            val: any
          ) {
            return val.field == month + " " + parent.year;
          });
          if (list == null || list.length == 0) {
            local.objPCProfitAndLossItemList.cols.push({
              field: month + " " + parent.year,
              header: month + " " + parent.year,
            });
          }

          if (kpiIndex >= 0) {
            local.objPCProfitAndLossItemList.Results[kpiIndex][
              month + " " + parent.year
            ] = parent.actualValue;
            local.objPCProfitAndLossItemList.Results[kpiIndex][
              "(Budget) " + month + " " + parent.year
            ] = parent.budgetValue;
          } else {
            objKPI[month + " " + parent.year] = parent.actualValue;
            objKPI["(Budget) " + month + " " + parent.year] =
              parent.budgetValue;

            local.objPCProfitAndLossItemList.Results.push(objKPI);
          }
        } else {
          if (objKPI.KPI != undefined && objKPI.KPI != "") {
            local.objPCProfitAndLossItemList.Results.push(objKPI);
          }
        }
      }

      if (child.length > 0) {
        child.forEach(function (childData: any) {
          var month = local.miscService.getMonthName(childData.month);
          objKPI = {};
          var childKpiIndex = -1;
          local.objPCProfitAndLossItemList.Results.every(function (
            elem: any,
            index: any
          ) {
            let profitAndLossLineItemName = childData.profitAndLossLineItem;

            profitAndLossLineItemName = "  - " + profitAndLossLineItemName;

            if (
              elem.KPI == profitAndLossLineItemName &&
              elem.ParentProfitAndLossLineItemId == childData.parentID
            ) {
              childKpiIndex = index;
              return false;
            }
            return true;
          });

          if (childKpiIndex == -1) {
            objKPI["KPI"] = "  - " + childData.profitAndLossLineItem;

            objKPI["KPIWithInfo"] =
              "  - " +
              childData.profitAndLossLineItem +
              " (" +
              childData.valueInfo +
              ")";

            objKPI["ParentProfitAndLossLineItemId"] = childData.parentID;
            objKPI["ProfitAndLossLineItemId"] =
              childData.profitAndLossLineItemID;
            objKPI["IsHeader"] = childData.isHeader;
          }
          var list = local.objPCProfitAndLossItemList.cols.filter(function (
            val: any
          ) {
            return val.field == month + " " + childData.year;
          });
          if (list == null || list.length == 0) {
            local.objPCProfitAndLossItemList.cols.push({
              field: month + " " + childData.year,
              header: month + " " + childData.year,
            });
          }

          if (childKpiIndex >= 0) {
            local.objPCProfitAndLossItemList.Results[childKpiIndex][
              month + " " + childData.year
            ] = childData.actualValue;
            local.objPCProfitAndLossItemList.Results[childKpiIndex][
              "(Budget) " + month + " " + childData.year
            ] = childData.budgetValue;
          } else {
            objKPI[month + " " + childData.year] = childData.actualValue;
            objKPI["(Budget) " + month + " " + childData.year] =
              childData.budgetValue;
            local.objPCProfitAndLossItemList.Results.push(objKPI);
          }
        });
      }
    });
    local.objPCProfitAndLossItemList.cols = local.objPCProfitAndLossItemList.cols.filter(
      (x) => x.header.split(" ")[0] !== "(Budget)"
    );

    profitAndLossModel.forEach(function (data: any) {
      var parent = data.pcProfitAndLossValuesModel;
      var month = local.miscService.getMonthName(parent.month);
      var list = local.objPCProfitAndLossItemList.cols.filter(function (
        val: any
      ) {
        return val.field == "(Budget) " + month + " " + parent.year;
      });
      if (list == null || list.length == 0) {
        local.objPCProfitAndLossItemList.cols.push({
          field: "(Budget) " + month + " " + parent.year,
          header: "(Budget) " + month + " " + parent.year,
        });
      }
    });
    this.objPCProfitAndLossItemList.cols.splice(0, 1);
    var budgetArray = this.objPCProfitAndLossItemList.cols.filter(
      (x) => x.field.split(" ")[0] === "(Budget)"
    );
    var actualArray = this.objPCProfitAndLossItemList.cols.filter(
      (x) => x.field.split(" ")[0] !== "(Budget)"
    );
    budgetArray.sort(this.sortByMonthYearDate);
    actualArray.sort(this.sortByMonthYearDate);

    this.objPCProfitAndLossItemList.cols = actualArray.concat(budgetArray);
  }

  createColumnForCompanyProfitAndLossItems(profitAndLossModel: any) {
    var local = this;
    profitAndLossModel.forEach(function (data: any) {
      var parent = data.pcProfitAndLossValuesModel;
      var month = local.miscService.getMonthName(parent.month);
      if (local.objPCProfitAndLossItemList.cols.length == 0) {
        local.objPCProfitAndLossItemList.cols.push({
          field: "KPI",
          header: "KPI",
        });
      }
      if (month != undefined) {
        var list = local.objPCProfitAndLossItemList.cols.filter(function (
          val: any
        ) {
          return val.field == month + " " + parent.year;
        });
        if (list == null || list.length == 0) {
          local.objPCProfitAndLossItemList.cols.push({
            field: month + " " + parent.year,
            header: "(Actual) " + month + " " + parent.year,
          });
          local.objPCProfitAndLossItemList.cols.push({
            field: "(Budget) " + month + " " + parent.year,
            header: "(Budget) " + month + " " + parent.year,
          });
        }
      }
    });
  }

  getPCCashFlowValues(
    event: any,
    searchFilter: any,
    companyId: any = undefined
  ) {
    if (event == null) {
      event = {
        first: 0,
        rows: 1000,
        globalFilter: null,
        sortField: "displayOrder",
        multiSortMeta: this.cashFlowValuesMultiSortMeta,
        sortOrder: -1,
      };
    }

    if (searchFilter == null) {
      var sortOrder =
        this.model.orderType.type == OrderTypesEnum.LatestOnRight
          ? [
              { field: "year", order: 1 },
              { field: "month", order: 1 },
            ]
          : [
              { field: "year", order: -1 },
              { field: "month", order: -1 },
            ];
      searchFilter = {
        sortOrder: null,
        periodType: this.model.periodType.type,
      };
      if (searchFilter.periodType == "Date Range") {
        searchFilter.startPeriod = new Date(
          Date.UTC(
            this.model.startPeriod.getFullYear(),
            this.model.startPeriod.getMonth(),
            this.model.startPeriod.getDate()
          )
        );
        searchFilter.endPeriod = new Date(
          Date.UTC(
            this.model.endPeriod.getFullYear(),
            this.model.endPeriod.getMonth(),
            this.model.endPeriod.getDate()
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

    companyId = companyId == undefined ? this.id : companyId;
    this.blockedPCCashFlowValuesTable = true;
    this.portfolioCompanyService
      .getPCCashFlowValues({
        PortfolioCompanyID: companyId,
        paginationFilter: event,
        searchFilter: searchFilter,
        segmentType: this.selectedSegmentType,
      })
      .subscribe(
        (result) => {
          let resp = result;
          if (resp != null && resp.code == "OK") {
            this.portfolioCompanyCashFlowValuesList = resp.body;
            this.portfolioCompanyCashFlowValuesListClone = JSON.parse(
              JSON.stringify(this.portfolioCompanyCashFlowValuesList)
            );

            this.createPCCashFlowValuesLayOut(
              this.portfolioCompanyCashFlowValuesList
            );
            this.portfolioCompanyCashFlowValuesList.forEach(function (item) {
              item.fullMonth =
                item.pcCashFlowValuesModel.month +
                " " +
                item.pcCashFlowValuesModel.year;
            });

            this.expandedCompanyCashFlowItems = [];
            if (this.portfolioCompanyCashFlowValuesList.length > 0) {
              this.expandedCompanyCashFlowItems.push(
                this.portfolioCompanyCashFlowValuesList[0]
              );
            }
            this.totalCompanyCashFlowValuesRecords = resp.body.totalRecords;
          } else {
            this.portfolioCompanyCashFlowValuesList = [];
            this.totalCompanyCashFlowValuesRecords = 0;
            this.createPCCashFlowValuesLayOut(
              this.portfolioCompanyCashFlowValuesList
            );
          }
          this.blockedPCCashFlowValuesTable = false;

          this.changeDetectorRef.markForCheck();
        },
        (error) => {
          this.blockedPCCashFlowValuesTable = false;
          this.accountService.redirectToLogin(error);
        }
      );
  }

  createPCCashFlowValuesLayOut(cashFlowModel: any) {
    this.objPCCashFlowItemList = [];
    this.objPCCashFlowItemList.cols = [];
    this.objPCCashFlowItemList.Results = [];
    var local = this;

    this.createColumnForCompanyCashFlowItems(cashFlowModel);
    cashFlowModel.forEach(function (data: any) {
      var objKPI: any = {};
      var parent = data.pcCashFlowValuesModel;
      var child = data.childPCCashFlowValuesList;

      if (parent.cashFlowLineItem != "") {
        var month = local.miscService.getMonthName(parent.month);

        var kpiIndex = -1;
        local.objPCCashFlowItemList.Results.every(function (
          elem: any,
          index: any
        ) {
          let cashFlowLineItemName = parent.cashFlowLineItem;
          let cashFlowLineItemNameID = parent.cashFlowLineItemID;
          if (
            elem.KPI === cashFlowLineItemName &&
            elem.CashFlowLineItemId === cashFlowLineItemNameID
          ) {
            kpiIndex = index;
            return false;
          }
          return true;
        });

        if (kpiIndex == -1) {
          objKPI["KPI"] = parent.cashFlowLineItem;
          objKPI["IsHeader"] = parent.isHeader;

          objKPI["KPIWithInfo"] =
            parent.cashFlowLineItem + " (" + parent.valueInfo + ")";

          objKPI["CashFlowLineItemId"] = parent.cashFlowLineItemID;
        }
        if (month != undefined) {
          var list = local.objPCCashFlowItemList.cols.filter(function (
            val: any
          ) {
            return val.field == month + " " + parent.year;
          });
          if (list == null || list.length == 0) {
            local.objPCCashFlowItemList.cols.push({
              field: month + " " + parent.year,
              header: month + " " + parent.year,
            });
          }

          if (kpiIndex >= 0) {
            local.objPCCashFlowItemList.Results[kpiIndex][
              month + " " + parent.year
            ] = parent.actualValue;
            local.objPCCashFlowItemList.Results[kpiIndex][
              "(Budget) " + month + " " + parent.year
            ] = parent.budgetValue;
          } else {
            objKPI[month + " " + parent.year] = parent.actualValue;
            objKPI["(Budget) " + month + " " + parent.year] =
              parent.budgetValue;

            local.objPCCashFlowItemList.Results.push(objKPI);
          }
        } else {
          if (objKPI.KPI != undefined && objKPI.KPI != "") {
            local.objPCCashFlowItemList.Results.push(objKPI);
          }
        }
      }

      if (child.length > 0) {
        child.forEach(function (childData: any) {
          var month = local.miscService.getMonthName(childData.month);
          objKPI = {};
          var childKpiIndex = -1;
          local.objPCCashFlowItemList.Results.every(function (
            elem: any,
            index: any
          ) {
            let cashFlowLineItemName = childData.cashFlowLineItem;

            cashFlowLineItemName = "  - " + cashFlowLineItemName;

            if (
              elem.KPI == cashFlowLineItemName &&
              elem.ParentCashFlowLineItemId == childData.parentID
            ) {
              childKpiIndex = index;
              return false;
            }
            return true;
          });

          if (childKpiIndex == -1) {
            objKPI["KPI"] = "  - " + childData.cashFlowLineItem;

            objKPI["KPIWithInfo"] =
              "  - " +
              childData.cashFlowLineItem +
              " (" +
              childData.valueInfo +
              ")";

            objKPI["ParentCashFlowLineItemId"] = childData.parentID;
            objKPI["CashFlowLineItemId"] = childData.cashFlowLineItemID;
            objKPI["IsHeader"] = childData.isHeader;
          }
          var list = local.objPCCashFlowItemList.cols.filter(function (
            val: any
          ) {
            return val.field == month + " " + childData.year;
          });
          if (list == null || list.length == 0) {
            local.objPCCashFlowItemList.cols.push({
              field: month + " " + childData.year,
              header: month + " " + childData.year,
            });
          }

          if (childKpiIndex >= 0) {
            local.objPCCashFlowItemList.Results[childKpiIndex][
              month + " " + childData.year
            ] = childData.actualValue;
            local.objPCCashFlowItemList.Results[childKpiIndex][
              "(Budget) " + month + " " + childData.year
            ] = childData.budgetValue;
          } else {
            objKPI[month + " " + childData.year] = childData.actualValue;
            objKPI["(Budget) " + month + " " + childData.year] =
              childData.budgetValue;

            local.objPCCashFlowItemList.Results.push(objKPI);
          }
        });
      }
    });
    local.objPCCashFlowItemList.cols = local.objPCCashFlowItemList.cols.filter(
      (x) => x.header.split(" ")[0] !== "(Budget)"
    );

    cashFlowModel.forEach(function (data: any) {
      var parent = data.pcCashFlowValuesModel;
      var month = local.miscService.getMonthName(parent.month);
      var list = local.objPCCashFlowItemList.cols.filter(function (val: any) {
        return val.field == "(Budget) " + month + " " + parent.year;
      });
      if (list == null || list.length == 0) {
        local.objPCCashFlowItemList.cols.push({
          field: "(Budget) " + month + " " + parent.year,
          header: "(Budget) " + month + " " + parent.year,
        });
      }
    });
    this.objPCCashFlowItemList.cols.splice(0, 1);
    var budgetArray = this.objPCCashFlowItemList.cols.filter(
      (x) => x.field.split(" ")[0] === "(Budget)"
    );
    var actualArray = this.objPCCashFlowItemList.cols.filter(
      (x) => x.field.split(" ")[0] !== "(Budget)"
    );
    budgetArray.sort(this.sortByMonthYearDate);
    actualArray.sort(this.sortByMonthYearDate);

    this.objPCCashFlowItemList.cols = actualArray.concat(budgetArray);
  }

  createColumnForCompanyCashFlowItems(cashFlowModel: any) {
    var local = this;
    cashFlowModel.forEach(function (data: any) {
      var parent = data.pcCashFlowValuesModel;
      var month = local.miscService.getMonthName(parent.month);
      if (local.objPCCashFlowItemList.cols.length == 0) {
        local.objPCCashFlowItemList.cols.push({ field: "KPI", header: "KPI" });
      }
      if (month != undefined) {
        var list = local.objPCCashFlowItemList.cols.filter(function (val: any) {
          return val.field == month + " " + parent.year;
        });
        if (list == null || list.length == 0) {
          local.objPCCashFlowItemList.cols.push({
            field: month + " " + parent.year,
            header: "(Actual) " + month + " " + parent.year,
          });
          local.objPCCashFlowItemList.cols.push({
            field: "(Budget) " + month + " " + parent.year,
            header: "(Budget) " + month + " " + parent.year,
          });
        }
      }
    });
  }

  companyCurrency: any;
  companyCurrencySymbol: any;
  getPortfolioCompanyList() {
    this.portfolioCompanyList = null;
    this.model.selectedPortfolioCompany = null;

    this.portfolioCompanyLoading = true;
    this.miscService.getPortfolioCompanyList({}).subscribe(
      (result) => {
        let resp = result;
        if (resp != null && resp.code == "OK" && resp.body!=null) {
          this.portfolioCompanyList = resp.body.portfolioCompanyList;
          this.portfolioCompanyListClone = this.portfolioCompanyList;
        }
        setTimeout(
          function (local: any) {
            local.portfolioCompanyLoading = false;
          },
          5,
          this
        );
      },
      (error) => {
        this.accountService.redirectToLogin(error);
        this.portfolioCompanyLoading = false;
      }
    );
  }

  onCompanyChange() {
    this.objPCBalanceSheetItemList.Results = null;
    this.objPCBalanceSheetItemList.cols = null;
    this.objPCProfitAndLossItemList.Results = null;
    this.objPCProfitAndLossItemList.cols = null;
    this.objPCCashFlowItemList.Results = null;
    this.objPCCashFlowItemList.cols = null;
    this.SegmentTypeList = [];
    this.model.selectedSegmentType = undefined;
    this.id = this.model.portfolioCompany.encryptedPortfolioCompanyId;
    this.portfolioCompanyID = this.model.portfolioCompany.portfolioCompanyID;
    if (this.model.portfolioCompany.reportingCurrencyDetail != null) {
      this.companyCurrency = this.model.portfolioCompany.reportingCurrencyDetail.currency;
      this.companyCurrencySymbol = this.model.portfolioCompany.reportingCurrencyDetail.currencyCode;
      console.log(this.companyCurrencySymbol);
    }

    this.getSegmentTypeList();
  }

  getSegmentTypeList() {
    this.portfolioCompanyService
      .getSegmentTypeForFinancialsByCompanyID(this.portfolioCompanyID)
      .subscribe((result) => {
        let resp = result;
        if (resp != undefined && resp.code == "OK") {
          this.SegmentTypeList = resp.body.segmentTypeList;
        }
      });
  }

  onSegmentTypeChange() {}

  search(form: any) {
    this.objPCBalanceSheetItemList.Results = null;
    this.objPCBalanceSheetItemList.cols = null;
    this.objPCProfitAndLossItemList.Results = null;
    this.objPCProfitAndLossItemList.cols = null;
    this.objPCCashFlowItemList.Results = null;
    this.objPCCashFlowItemList.cols = null;
    this.validateKPIPeriod(this.model);
    if (
      form.invalid ||
      this.periodErrorMessage == ErrorMessage.MandatoryMessage
    ) {
      return;
    }
    if (this.periodErrorMessage == "") {
      let periodType =
        this.model.periodType != undefined ? this.model.periodType.type : null;
      var searchFilter = {
        sortOrder: null,
        periodType: periodType,
        startPeriod: this.model.startPeriod,
        endPeriod: this.model.endPeriod,
      };

      this.selectedSegmentType =
        this.model.selectedSegmentType == undefined
          ? null
          : this.model.selectedSegmentType.segmentType;

      this.getPCBalanceSheetValues(null, searchFilter, this.portfolioCompanyID);
      this.getPCProfitAndLossValues(
        null,
        searchFilter,
        this.portfolioCompanyID
      );
      this.getPCCashFlowValues(null, searchFilter, this.portfolioCompanyID);
    }
  }

  exportBalanceSheetLoading: boolean = false;
  exportBalanceSheetValues() {
    this.exportBalanceSheetLoading = true;
    let event = {
      first: 0,
      rows: 1000,
      globalFilter: null,
      sortField: "displayOrder",
      multiSortMeta: this.balanceSheetValuesMultiSortMeta,
      sortOrder: -1,
    };

    this.portfolioCompanyService
      .exportCompanyBalanceSheet({
        currency: this.companyCurrency,
        CurrencyCode: this.companyCurrencySymbol,
        companyName: this.model.portfolioCompany.companyName,
        portfolioCompanyID: this.model.portfolioCompany.portfolioCompanyID,
        paginationFilter: event,
        searchFilter: this.balanceSheetSearchFilter,
        segmentType: this.selectedSegmentType,
      })
      .subscribe(
        (response) => {
          this.miscService.downloadExcelFile(response);
          this.exportBalanceSheetLoading = false;
        },
        (error) => {
          this.exportBalanceSheetLoading = false;
          this.message = this.miscService.showAlertMessages(
            "error",
            ErrorMessage.SomethingWentWrong
          );
        }
      );
  }

  exportProfitLoading: boolean = false;
  exportProfitAndLossData() {
    this.exportProfitLoading = true;
    let event = {
      first: 0,
      rows: 1000,
      globalFilter: null,
      sortField: "displayOrder",
      multiSortMeta: this.profitAndLossValuesMultiSortMeta,
      sortOrder: -1,
    };

    this.portfolioCompanyService
      .exportCompanyProfitAndLoss({
        currency: this.companyCurrency,
        CurrencyCode: this.companyCurrencySymbol,
        companyName: this.model.portfolioCompany.companyName,
        portfolioCompanyID: this.model.portfolioCompany.portfolioCompanyID,
        paginationFilter: event,
        searchFilter: this.balanceSheetSearchFilter,
        segmentType: this.selectedSegmentType,
      })
      .subscribe(
        (response) => {
          this.miscService.downloadExcelFile(response);
          this.exportProfitLoading = false;
        },
        (error) => {
          this.exportProfitLoading = false;
          this.message = this.miscService.showAlertMessages(
            "error",
            ErrorMessage.SomethingWentWrong
          );
        }
      );
  }
  exportCashFlowLoading: boolean = false;
  exportCashFlowData() {
    this.exportCashFlowLoading = true;
    let event = {
      first: 0,
      rows: 1000,
      globalFilter: null,
      sortField: "displayOrder",
      multiSortMeta: this.cashFlowValuesMultiSortMeta,
      sortOrder: -1,
    };

    this.portfolioCompanyService
      .exportCompanyCashFlow({
        currency: this.companyCurrency,
        CurrencyCode: this.companyCurrencySymbol,
        companyName: this.model.portfolioCompany.companyName,
        portfolioCompanyID: this.model.portfolioCompany.portfolioCompanyID,
        paginationFilter: event,
        searchFilter: this.balanceSheetSearchFilter,
        segmentType: this.selectedSegmentType,
      })
      .subscribe(
        (response) => {
          this.miscService.downloadExcelFile(response);
          this.exportCashFlowLoading = false;
        },
        (error) => {
          this.exportCashFlowLoading = false;
          this.message = this.miscService.showAlertMessages(
            "error",
            ErrorMessage.SomethingWentWrong
          );
        }
      );
  }

  minDate: Date | null = null;

  onDateSelect() {
    this.model.fromDate = null;
    this.model.toDate = null;
    if (this.dateRange.length > 0) {
      let toDate = this.dateRange[1];
      if (toDate == null) {
        this.model.toDate = this.dateRange[0];
        this.minDate = new Date(this.model.toDate);
        this.minDate.setDate(this.minDate.getDate() + 1);
      } else {
        if (
          new Date(this.dateRange[0]).toDateString() ==
          new Date(this.dateRange[1]).toDateString()
        ) {
          this.dateRange.pop();
          this.model.toDate = this.dateRange[0];
          this.minDate = new Date(this.model.toDate);
          this.minDate.setDate(this.minDate.getDate() + 1);
        } else {
          this.model.fromDate = this.dateRange[0];
          this.model.toDate = this.dateRange[1];
          this.minDate = null;
        }
      }
    }
  }

  onDateClear() {
    this.minDate = null;
    this.dateRange = null;
    this.model.fromDate = null;
    this.model.toDate = null;
  }

  resetValidator(form: any) {
    this.objPCBalanceSheetItemList.Results = null;
    this.objPCBalanceSheetItemList.cols = null;
    this.objPCProfitAndLossItemList.Results = null;
    this.objPCProfitAndLossItemList.cols = null;
    this.objPCCashFlowItemList.Results = null;
    this.objPCCashFlowItemList.cols = null;
    var segment = this.model.selectedSegmentType;
    if (this.model.periodType.type == "Date Range") {
      this.reset(form);
      this.model.selectedSegmentType = segment;
    }
  }

  reset(form: any) {
    this.portfolioCompanyList = this.portfolioCompanyListClone;
    this.objPCBalanceSheetItemList.Results = null;
    this.objPCBalanceSheetItemList.cols = null;
    this.objPCProfitAndLossItemList.Results = null;
    this.objPCProfitAndLossItemList.cols = null;
    this.objPCCashFlowItemList.Results = null;
    this.objPCCashFlowItemList.cols = null;
    let periodType = this.model.periodType;

    let portfolioCompany = this.model.portfolioCompany;
    form.resetForm();
    this.changeDetectorRef.detectChanges();
    this.model = {
      isAscending: false,
      portfolioCompany: null,
    };
    this.minDate = null;
    this.model.periodType = periodType;
    form.controls["periodType"].setValue(periodType);
    this.model.portfolioCompany = portfolioCompany;
    form.controls["portfolioCompany"].setValue(portfolioCompany);
  }

  resetForm(form: any) {
    this.portfolioCompanyList = this.portfolioCompanyListClone;
    this.objPCBalanceSheetItemList.Results = null;
    this.objPCBalanceSheetItemList.cols = null;
    this.objPCProfitAndLossItemList.Results = null;
    this.objPCProfitAndLossItemList.cols = null;
    this.objPCCashFlowItemList.Results = null;
    this.objPCCashFlowItemList.cols = null;
    this.SegmentTypeList = [];
    form.resetForm();
    this.changeDetectorRef.detectChanges();
    this.model = {
      isAscending: false,
      portfolioCompany: null,
    };
    this.minDate = null;
    this.model.periodType = { type: PeriodTypeEnum.Last1Year };
    form.controls["periodType"].setValue(this.model.periodType);
  }
  periodErrorMessage: string = "";
  validateKPIPeriod(model: any) {
    if (
      model.startPeriod != "" &&
      model.startPeriod != undefined &&
      model.endPeriod != "" &&
      model.endPeriod != undefined
    ) {
      if (model.startPeriod > model.endPeriod) {
        this.periodErrorMessage = ErrorMessage.StartDateLessThanEndDate;
      } else {
        this.periodErrorMessage = "";
      }
    }
  }

  compare(a: any, b: any) {
    if (a.order < b.order) {
      return -1;
    }
    if (a.order > b.order) {
      return 1;
    }
    return 0;
  }

  isNumberCheck(str: any) {
    return isNumeric(str);
  }

  sortByMonthYearDate(a: any, b: any) {
    const Months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    var reA = /[^a-zA-Z]/g;
    var reN = /[^0-9]/g;
    var monthA = a.field.replace(reA, "").replace("Budget", "");
    var monthB = b.field.replace(reA, "").replace("Budget", "");
    var yearA = parseInt(a.field.replace(reN, ""), 10);
    var yearB = parseInt(b.field.replace(reN, ""), 10);
    if (yearA !== yearB) return yearA - yearB;
    return Months.indexOf(monthA) - Months.indexOf(monthB);
  }
}
