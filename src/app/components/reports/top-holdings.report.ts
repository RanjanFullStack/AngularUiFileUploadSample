import {
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  ViewChild,
} from "@angular/core";
import { FormGroup, NgForm } from "@angular/forms";
import { NgxSpinnerService } from "ngx-spinner";
import { Message } from "primeng/components/common/api";
import { MessageService } from "primeng/components/common/messageservice";
import { SelectItem } from "primeng/components/common/selectitem";
import { AccountService } from "../../services/account.service";
import { MiscellaneousService } from "../../services/miscellaneous.service";
import {
  ReportCategory,
  ReportService,
  ReportType,
} from "../../services/report.service";
import { AbstractFilterStrategy } from "./reports";
import { FilterControlComponent } from "../custom-controls/filter-control.component";

@Component({
  selector: "top-holdings",
  templateUrl: "./top-holdings.report.html",
  providers: [MessageService],
})
export class TopHoldingsComponent
  extends AbstractFilterStrategy
  implements OnInit {
  @Input() masterModel: any = { filterSection: true };
  @ViewChild("form") form: NgForm;
  
  reportForm: FormGroup;
  fundList: any[];
  regionList: any[];
  countryList: any[];
  strategyList: any[];
  msgTimeSpan: number;
  fundsLoading: boolean;
  strategyLoading: boolean;
  regionLoading: boolean;
  countryLoading: boolean;
  fundHoldingStatusLoading: boolean;
  filterSection: boolean = true;
  yearRange: any;
  viewByList: SelectItem[];
  holdingsByList: SelectItem[];
  cols: any[] = [];
  msgs: Message[] = [];
  reportType: typeof ReportType = ReportType;
  reportData: any = [];

  model: any = {
    fundIds: [],
    strategyIds: [],
    regionIds: [],
    countryIds: [],
    fundHoldingStatusIds: [],
    isAscending: false,
    selectedReportTypes: [this.reportType.TopHoldingInvestmentCost],
    chartMetadetaList: [],
  };
  types: any = [
    { label: "Top", value: false, icon: "" },
    { label: "Bottom", value: true, icon: "" },
  ];

  today: Date;
  loading: boolean = false;

  constructor(
    private reportService: ReportService,
    private miscService: MiscellaneousService,
    private accountService: AccountService,
    protected changeDetectorRef: ChangeDetectorRef,
    private spinner: NgxSpinnerService
  ) {
    super();
    super.Init(4);
    this.msgTimeSpan = this.miscService.getMessageTimeSpan();
    var year = new Date();
    this.today = year;
    this.yearRange = "2000:" + year.getFullYear();

    let holdingsByList = this.reportService.ReportTypeList.filter(function (
      ele: any,
      i: any
    ) {
      return ele.category == ReportCategory.Holdings;
    });
    this.holdingsByList = JSON.parse(JSON.stringify(holdingsByList));
    this.holdingsByList = this.holdingsByList.filter(function (
      ele: any,
      i: any
    ) {
      delete ele.category;
      return ele;
    });
  }
  ngOnInit() {
    this.Init(0);
  }

  bindReportMasterModel() {
    this.filter.selectReport=null;
    this.fundList = this.masterModel.fundList;
    if (this.fundList) {
      this.fundListClone = JSON.parse(JSON.stringify(this.fundList));
      this.fundsLoading = false;
    }
    this.strategyList = this.masterModel.strategyList;
    if (this.strategyList) {
      this.strategyListClone = JSON.parse(JSON.stringify(this.strategyList));
      this.strategyLoading = false;
    }

    this.fundHoldingStatusList = this.masterModel.fundHoldingStatusList;
    if (this.fundHoldingStatusList) {
      this.fundHoldingStatusListClone = JSON.parse(
        JSON.stringify(this.fundHoldingStatusList)
      );
      this.fundHoldingStatusLoading = false;
    }

    this.regionList = this.masterModel.regionList;
    if (this.regionList) {
      this.regionListClone = JSON.parse(JSON.stringify(this.regionList));
      this.regionLoading = false;
    }

    this.countryList = this.masterModel.countryList;
    if (this.countryList) {
      this.countryListClone = JSON.parse(JSON.stringify(this.countryList));
      this.countryLoading = false;
    }

    this.resetForm(this.form);
    this.filterSection = true;
  }

  getTopHoldingReports() {
    
      this.reportService.getReportData(this.model).subscribe(
      (result) => {
        this.reportData = result["body"];
        var local = this;
        this.reportData.filter(function (report: any, reportIndex: any) {
          let reportType = local.reportService.ReportTypeList.filter(function (
            ele: any,
            i: any
          ) {
            return report.ReportType == ele.value;
          });
          if (reportType.length > 0) {
            report.ReportType = reportType[0].label;
          }
          report.cols = [];
          report.Columns.forEach(function (val: any, i: any) {
            report.cols.push({ field: val, header: val });
          });
          return report;
        });

        this.CheckIfNoDataInReport();
        this.spinner.hide();
        this.loading = false;
      },
      (error) => {
        this.accountService.redirectToLogin(error);
        this.CheckIfNoDataInReport();
        this.spinner.hide();
        this.loading = false;
      }
    );
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

  onRegionChange(event: any) {
    if (event.value != null && event.value.length > 0) {
      this.GetCountryListByRegionIds();

      var statusIdArray: any = [];
      this.fundList.forEach(function (fund: any) {
        fund.dealList.forEach(function (val: any) {
          if (val.portfolioCompanyFundHoldingList.length > 0) {
            val.portfolioCompanyFundHoldingList.forEach(function (
              fundStatus: any
            ) {
              if (
                fundStatus.fundHoldingStatus != null &&
                fundStatus.fundHoldingStatus.fundHoldingStatusID > 0
              ) {
                if (
                  statusIdArray.indexOf(
                    fundStatus.fundHoldingStatus.fundHoldingStatusID
                  ) == -1
                ) {
                  statusIdArray.push(
                    fundStatus.fundHoldingStatus.fundHoldingStatusID
                  );
                }
              }
            });
          }
        });
      });
      this.model.fundHoldingStatusIds = [];
      this.fundHoldingStatusList = this.fundHoldingStatusListClone.filter(
        function (status: any) {
          return statusIdArray.indexOf(status.fundHoldingStatusID) >= 0;
        }
      );
    } else {
      this.model.fundHoldingStatusIds = [];
      this.model.countryIds = [];
      this.countryList = JSON.parse(JSON.stringify(this.countryListClone));
      this.model.fundIds = [];
      this.fundList = JSON.parse(JSON.stringify(this.fundListClone));
      this.fundHoldingStatusList = JSON.parse(
        JSON.stringify(this.fundHoldingStatusListClone)
      );
    }
    this.DoEnableFilters();
  }

  onCountryChange(event: any) {
    if (event.value != null && event.value.length > 0) {
      this.model.fundIds = [];
      this.model.fundHoldingStatusIds = [];

      var countryIds = event.value
        .filter(function (country: any) {
          return country != null;
        })
        .map(function (country: any) {
          return country.countryId;
        });
      this.fundList = this.fundListClone.filter(function (fund: any) {
        return countryIds.indexOf(fund.geographyDetail.country.countryId) >= 0;
      });
      var statusIdArray: any = [];
      this.fundList.forEach(function (fund: any) {
        fund.dealList.forEach(function (val: any) {
          if (val.portfolioCompanyFundHoldingList.length > 0) {
            val.portfolioCompanyFundHoldingList.forEach(function (
              fundStatus: any
            ) {
              if (
                fundStatus.fundHoldingStatus != null &&
                fundStatus.fundHoldingStatus.fundHoldingStatusID > 0
              ) {
                if (
                  statusIdArray.indexOf(
                    fundStatus.fundHoldingStatus.fundHoldingStatusID
                  ) == -1
                ) {
                  statusIdArray.push(
                    fundStatus.fundHoldingStatus.fundHoldingStatusID
                  );
                }
              }
            });
          }
        });
      });
      this.model.fundHoldingStatusIds = [];
      this.fundHoldingStatusList = this.fundHoldingStatusListClone.filter(
        function (status: any) {
          return statusIdArray.indexOf(status.fundHoldingStatusID) >= 0;
        }
      );
    } else {
      this.model.fundIds = [];
      this.model.fundHoldingStatusIds = [];
      this.fundList = [];
      this.fundList = JSON.parse(JSON.stringify(this.fundListClone));
      this.fundHoldingStatusList = JSON.parse(
        JSON.stringify(this.fundHoldingStatusListClone)
      );
    }
    this.DoEnableFilters();
  }
  GetCountryListByRegionIds() {
    this.countryLoading = true;
    this.model.countryIds = [];
    this.countryList = [];
    this.model.fundIds = [];
    this.model.fundHoldingStatusIds = [];

    let regionIds =
      this.model.regionIds != undefined && this.model.regionIds.length > 0
        ? this.model.regionIds
        : [];
    this.miscService.getCountryListByRegionIds(regionIds).subscribe(
      (data) => {
        this.countryList = data["body"];
        this.countryLoading = false;
      },
      (error) => {
        this.countryLoading = false;
        this.accountService.redirectToLogin(error);
      }
    );
  }

  onStrategyChanged(event: any) {
    var local = this;

    if (event.value != null && event.value.length > 0) {
      var strategyIds = event.value
        .filter(function (strategy: any) {
          return strategy != null;
        })
        .map(function (strategy: any) {
          return strategy.strategyID;
        });
      this.model.fundIds = [];
      this.fundList = [];
      this.fundList = this.fundListClone.filter(function (fund: any) {
        return strategyIds.indexOf(fund.strategyDetail.strategyID) >= 0;
      });

      var regionIds = this.fundList
        .filter(function (fund: any) {
          return (
            fund.geographyDetail != null &&
            fund.geographyDetail.region != null &&
            fund.geographyDetail.region.regionId > 0
          );
        })
        .map(function (fund: any) {
          return fund.geographyDetail.region.regionId;
        });

      var statusIdArray: any = [];
      this.fundList.forEach(function (fund: any) {
        fund.dealList.forEach(function (val: any) {
          if (val.portfolioCompanyFundHoldingList.length > 0) {
            val.portfolioCompanyFundHoldingList.forEach(function (
              fundStatus: any
            ) {
              if (
                fundStatus.fundHoldingStatus != null &&
                fundStatus.fundHoldingStatus.fundHoldingStatusID > 0
              ) {
                if (
                  statusIdArray.indexOf(
                    fundStatus.fundHoldingStatus.fundHoldingStatusID
                  ) == -1
                ) {
                  statusIdArray.push(
                    fundStatus.fundHoldingStatus.fundHoldingStatusID
                  );
                }
              }
            });
          }
        });
      });
      this.model.fundHoldingStatusIds = [];
      this.fundHoldingStatusList = this.fundHoldingStatusListClone.filter(
        function (status: any) {
          return statusIdArray.indexOf(status.fundHoldingStatusID) >= 0;
        }
      );

      var countryIds = this.fundList
        .filter(function (fund: any) {
          return (
            fund.geographyDetail != null &&
            fund.geographyDetail.country != null &&
            fund.geographyDetail.country.countryId > 0
          );
        })
        .map(function (fund: any) {
          return fund.geographyDetail.country.countryId;
        });

      this.model.regionIds = [];
      this.regionList = [];
      this.regionList = this.regionListClone.filter(function (region: any) {
        return regionIds.indexOf(region.regionId) >= 0;
      });

      if (regionIds.length > 0) {
        this.GetCountryListByRegionIds();
      } else {
        this.model.countryIds = [];
        this.countryList = [];
        this.countryList = this.countryListClone.filter(function (
          country: any
        ) {
          return countryIds.indexOf(country.countryId) >= 0;
        });
      }
    } else {
      this.model.strategyIds = [];
      this.strategyList = JSON.parse(JSON.stringify(this.strategyListClone));
      this.model.regionIds = [];
      this.regionList = JSON.parse(JSON.stringify(this.regionListClone));
      this.model.countryIds = [];
      this.countryList = JSON.parse(JSON.stringify(this.countryListClone));
      this.model.fundIds = [];
      this.fundList = JSON.parse(JSON.stringify(this.fundListClone));
      this.model.fundHoldingStatusIds = [];
      this.fundHoldingStatusList = JSON.parse(
        JSON.stringify(this.fundHoldingStatusListClone)
      );
    }
    this.DoEnableFilters();
  }

  OnFundChanged(event: any) {
    this.DoEnableFilters();
  }
  OnStatusChanged(event: any) {
    this.DoEnableFilters();
  }
  search(form: any) {
    this.getTopHoldingReports();
  }

  showCostRelativeInvestments() {
    this.reportCategory = ReportCategory.InvestmentsByCost;
    this.setReportTypeList();
    this.model = {
      fundIds: [],
      strategyIds: [],
      regionIds: [],
      countryIds: [],
      isAscending: false,
      selectedReportTypes: [this.reportType.InvestmentsAboveCost],
    };
    this.showTopBottom = false;
    this.getTopHoldingReports();
    var local = this;
    setTimeout(function () {
      local.changeDetectorRef.detectChanges();
    }, 1);
  }

  showTopHoldings() {
    this.reportCategory = ReportCategory.Holdings;
    this.setReportTypeList();
    this.model = {
      fundIds: [],
      strategyIds: [],
      regionIds: [],
      countryIds: [],
      isAscending: false,
      selectedReportTypes: [this.reportType.TopHoldingInvestmentCost],
    };
    this.showTopBottom = true;
    this.getTopHoldingReports();
    var local = this;
    setTimeout(function () {
      local.changeDetectorRef.detectChanges();
    }, 1);
  }
  reportCategory: any;
  showTopBottom: boolean = true;
  setReportTypeList() {
    var local = this;
    let holdingsByList = this.reportService.ReportTypeList.filter(function (
      ele: any,
      i: any
    ) {
      return ele.category == local.reportCategory;
    });
    this.holdingsByList = JSON.parse(JSON.stringify(holdingsByList));
    this.holdingsByList = this.holdingsByList.filter(function (
      ele: any,
      i: any
    ) {
      delete ele.category;
      return ele;
    });
    this.model.selectedReportTypes = [this.holdingsByList[0].value];
  }

  LoadSavedFilter(item: any) {
    this.countryList=this.countryListClone;
    this.fundList=this.fundListClone
    super.LoadSavedFilter(item);
  }
  minDate: Date | null = null;

  onDateSelect() {
    if (this.dateRange.length > 0) {
      let toDate = this.dateRange[1];
      if (
        new Date(this.dateRange[0]).toDateString() ==
          new Date(this.dateRange[1]).toDateString() &&
        new Date(this.dateRange[0]).toDateString() ==
          new Date(this.today).toDateString()
      ) {
        this.model.fromDate = this.dateRange[0];
        this.model.toDate = this.dateRange[1];
      } else if (
        new Date(this.dateRange[0]).toDateString() ==
        new Date(this.today).toDateString()
      ) {
        this.model.fromDate = null;
        this.model.toDate = this.dateRange[0];
        this.minDate = this.today;
      } else if (toDate == null) {
        this.model.fromDate = null;
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
    this.DoEnableFilters();
  }
  onDateClear() {
    this.minDate = null;
    this.model.fromDate = null;
    this.model.toDate = null;
    this.DoEnableFilters();
  }

  showHideFilter() {
    this.masterModel.filterSection =
      this.masterModel.filterSection == true ? false : true;
  }

  changeReportType(e: any) {
    this.model.selectedReportTypes = [e.item];
    this.ReportId = this.model.selectedReportTypes[0];
    this.DoEnableFilters();
    this.getTopHoldingReports();
  }

  resetForm(form: any) {
    let reportTypes: any[] = [];
    if (this.model.selectedReportTypes != undefined) {
      reportTypes = JSON.parse(JSON.stringify(this.model.selectedReportTypes));
    }

    form.resetForm();
    this.changeDetectorRef.detectChanges();
    var selectedReport =
      this.reportCategory == ReportCategory.InvestmentsByCost
        ? this.reportType.InvestmentsAboveCost
        : this.reportType.TopHoldingInvestmentCost;
    this.model = {
      fundIds: [],
      strategyIds: [],
      regionIds: [],
      countryIds: [],
      isAscending: false,
      selectedReportTypes: [selectedReport],
    };
    if (reportTypes != null && reportTypes.length > 0) {
      this.model.selectedReportTypes = reportTypes;
    }
    this.minDate = null;
    this.getTopHoldingReports();
    this.DoEnableFilters();
  }

  isNumber(val: any) {
    return typeof val === "number";
  }
}
