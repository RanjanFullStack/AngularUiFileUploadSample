import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
} from "@angular/core";
import { FormGroup, NgForm } from "@angular/forms";
import { ResizedEvent } from "angular-resize-event/resized-event";
import * as d3 from "d3";
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
  selector: "attribution-reports",
  templateUrl: "./attribution.report.html",
  providers: [MessageService],
})
export class AttributionReportsComponent
  extends AbstractFilterStrategy
  implements OnInit {
  reportForm: FormGroup;
  @Input() masterModel: any = {};
  @ViewChild("form") form: NgForm;
  @ViewChild("pDialog") pDialog: ElementRef;
  @ViewChild("filter") filter: FilterControlComponent;
  fundList: any[];
  fundListClone: any[];
  regionList: any[];
  regionListClone: any[];
  countryList: any[];
  countryListClone: any[];
  strategyList: any[];
  strategyListClone: any[];
  msgTimeSpan: number;
  fundsLoading: boolean;
  strategyLoading: boolean;
  regionLoading: boolean;
  countryLoading: boolean;
  filterSection: boolean = true;
  showRangeFilter: boolean = false;
  yearRange: any;
  viewByList: SelectItem[];
  holdingsByList: SelectItem[];
  cols: any[] = [];
  msgs: Message[] = [];
  reportType: typeof ReportType = ReportType;
  reportData: any = [];
  dateRange: any[];
  today: Date;
  rangeInvalid: boolean = false;
  partsRequired: boolean = false;
  isReportDataVisible: boolean = false;
  model: any = {
    fundIds: [],
    strategyIds: [],
    regionIds: [],
    countryIds: [],
    isAscending: false,
    selectedReportTypes: [this.reportType.AttributionBySector],
    chartMetadetaList: [],
  };
  types: any = [
    { label: "Top", value: false, icon: "" },
    { label: "Bottom", value: true, icon: "" },
  ];
  loading: boolean = false;
  constructor(
    private reportService: ReportService,
    private miscService: MiscellaneousService,
    private accountService: AccountService,
    protected changeDetectorRef: ChangeDetectorRef,
    private spinner: NgxSpinnerService
  ) {
    super();
    this.msgTimeSpan = this.miscService.getMessageTimeSpan();
    var year = new Date();
    this.today = year;
    this.yearRange = "2000:" + year.getFullYear();
    this.setReportTypeList();
  }
  ngOnChanges() {}
  ngOnInit() {
    this.Init(14);
  }

  LoadSavedFilter(item: any) {
    this.countryList = this.countryListClone;
    this.fundList = this.fundListClone;
    let reportFilters = item.reportFilters;
    if (reportFilters !== undefined) {
      this.model.strategyIds = this.strategyListClone.filter((s) => {
        return (
          this.GetItems("Strategy", reportFilters).indexOf(s.strategy) >= 0
        );
      });
      this.model.regionIds = this.regionListClone.filter((s) => {
        return this.GetItems("Region", reportFilters).indexOf(s.region) >= 0;
      });
      this.model.countryIds = this.countryListClone.filter((s) => {
        return this.GetItems("Country", reportFilters).indexOf(s.country) >= 0;
      });
      this.model.fundIds = this.fundListClone.filter((s) => {
        return this.GetItems("Fund", reportFilters).indexOf(s.fundName) >= 0;
      });
      let ToDate = this.GetItems("EvaluationDate", reportFilters);
      this.model.toDate = null;
      this.model.fromDate = null;
      this.dateRange=null;
      if (ToDate.length > 0) {
        ToDate = ToDate[0].split("=");
        this.model.toDate  = new Date(ToDate[0]);
        this.dateRange = [];
        this.dateRange.push(new Date(ToDate[0]));
        if (ToDate.length > 1) {
          this.model.toDate = new Date(ToDate[1]);
          this.dateRange.push(new Date(ToDate[1]));
        }
      } else {
        this.model.toDate == null;
      }
    }
  }
  DoEnableFilters() {
    this.Filter.ReportID = this.model.selectedReportTypes[0];
    if (this.model.fundHoldingStatusIds === undefined)
      this.model.fundHoldingStatusIds = []; //patch
    if (
      this.model.strategyIds.length > 0 ||
      this.model.regionIds.length > 0 ||
      this.model.countryIds.length > 0 ||
      this.model.fundIds.length > 0 ||
      this.model.fundHoldingStatusIds.length > 0 ||
      this.model.toDate !== undefined
    ) {
      this.Filter.reportFilters = [];
      if (this.model.strategyIds.length > 0)
        this.Filter.reportFilters.push({
          FilterName: "Strategy",
          FilterValues: this.model.strategyIds
            .map((s) => s.strategy)
            .toString(),
        });
      if (this.model.regionIds.length > 0)
        this.Filter.reportFilters.push({
          FilterName: "Region",
          FilterValues: this.model.regionIds.map((s) => s.region).toString(),
        });
      if (this.model.countryIds.length > 0)
        this.Filter.reportFilters.push({
          FilterName: "Country",
          FilterValues: this.model.countryIds.map((s) => s.country).toString(),
        });
      if (this.model.fundIds.length > 0) {
        this.Filter.reportFilters.push({
          FilterName: "Fund",
          FilterValues: this.model.fundIds.map((s) => s.fundName).toString(),
        });
      }
      if (this.model.fundHoldingStatusIds.length > 0) {
        this.Filter.reportFilters.push({
          FilterName: "Status",
          FilterValues: this.model.fundHoldingStatusIds
            .map((s) => s.status)
            .toString(),
        });
      }
      if (this.model.toDate != undefined) {
        var tempDate = this.model.toDate;
        if (this.model.fromDate !== null && this.model.fromDate !== undefined) {
          tempDate = this.model.fromDate + "=" + this.model.toDate;
        }
        this.Filter.reportFilters.push({
          FilterName: "EvaluationDate",
          FilterValues: tempDate,
        });
      }
      this.IsEnabled = true;
      if (this.filter.selectReport != null) {
        this.filter.IsItemSelected = true;
        this.filter.IsEnabled=true;
      }
    } else {
      this.IsEnabled = false;
      this.Filter.reportFilters = [];
    }
  }
  bindReportMasterModel() {
    this.filter.selectReport = null;
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
    this.setReportTypeList();
    this.resetForm(this.form);
    this.masterModel.filterSection = false;
    //this.getAttributionReports();
  }

  getAttributionReports() {
    this.rangeInvalid = false;
    this.partsRequired = false;

    if (
      this.model.rangeStart != null &&
      this.model.rangeEnd != null &&
      this.model.rangeStart != "" &&
      this.model.rangeEnd != ""
    ) {
      if (
        parseFloat(this.model.rangeStart) >= parseFloat(this.model.rangeEnd)
      ) {
        this.rangeInvalid = true;
        return;
      } else if (
        this.model.rangeParts == null ||
        this.model.rangeParts == "" ||
        parseFloat(this.model.rangeParts) < 1
      ) {
        this.partsRequired = true;
        return;
      }
    }
    this.loading = true;
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
        if (this.reportData != null && this.reportData.length > 0) {
          this.model.chartMetadetaList = [
            {
              chartName: "Capital Invested",
              chartType: "Pie",
              colNameX: this.reportData[0].Columns[0],
              colNameY: "% of Total Capital",
            },
            {
              chartName: "Unrealized Value",
              chartType: "Pie",
              colNameX: this.reportData[0].Columns[0],
              colNameY: "% of Unrealized Value",
            },
            {
              chartName: "Realized Value",
              chartType: "Pie",
              colNameX: this.reportData[0].Columns[0],
              colNameY: "% of Realized Value",
            },
            {
              chartName: "Total Value",
              chartType: "Pie",
              colNameX: this.reportData[0].Columns[0],
              colNameY: "% of Total Value",
            },
            {
              chartName: "TVPI",
              chartType: "ColumnClustered",
              colNameX: this.reportData[0].Columns[0],
              colNameY: "TVPI",
            },
            {
              chartName: "Number of Companies",
              chartType: "ColumnClustered",
              colNameX: this.reportData[0].Columns[0],
              colNameY: "# of Companies",
            },
          ];
        }
        this.spinner.hide();
        this.CheckIfNoDataInReport();
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
    } else {
      this.model.fundHoldingStatusIds = [];
      this.model.countryIds = [];
      this.countryList = JSON.parse(JSON.stringify(this.countryListClone));
      this.model.fundIds = [];
      this.fundList = JSON.parse(JSON.stringify(this.fundListClone));
      this.model.fundHoldingStatusIds = [];
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
    } else {
      this.model.fundIds = [];
      this.model.fundHoldingStatusIds = [];
      this.fundList = [];
      this.fundList = JSON.parse(JSON.stringify(this.fundListClone));
    }
    this.DoEnableFilters();
  }
  OnFundChanged(event: any) {
    this.DoEnableFilters();
  }
  GetCountryListByRegionIds() {
    this.countryLoading = true;
    this.model.countryIds = [];
    this.countryList = [];
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
    this.DoEnableFilters();
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
    }
    this.DoEnableFilters();
  }
  //onFundChanged(event: any) {
  //	var local = this;
  //	if (event.value != null && event.value.length > 0) {
  //		var strategyIds = event.value.filter(function (fund: any) {
  //			return fund.strategyDetail != null;
  //		}).map(function (fund: any) {
  //			return fund.strategyDetail.strategyID;
  //		});

  //		var regionIds = event.value.filter(function (fund: any) {
  //			return fund.geographyDetail != null && fund.geographyDetail.region != null && fund.geographyDetail.region.regionId > 0;
  //		}).map(function (fund: any) {
  //			return fund.geographyDetail.region.regionId;
  //		});

  //		var countryIds = event.value.filter(function (fund: any) {
  //			return fund.geographyDetail != null && fund.geographyDetail.country != null && fund.geographyDetail.country.countryId > 0;
  //		}).map(function (fund: any) {
  //			return fund.geographyDetail.country.countryId;
  //		});

  //		this.strategyList = this.strategyListClone.filter(function (strategy: any) {
  //			return strategyIds.indexOf(strategy.strategyID) >= 0;
  //		})

  //		this.regionList = this.regionListClone.filter(function (region: any) {
  //			return regionIds.indexOf(region.regionId) >= 0;
  //		})

  //		if (regionIds.length > 0) {
  //			this.GetCountryListByRegionIds();
  //		}
  //		else {
  //			this.countryList = this.countryListClone.filter(function (country: any) {
  //				return countryIds.indexOf(country.countryId) >= 0;
  //			})
  //		}
  //	}
  //	else {
  //		this.strategyList = JSON.parse(JSON.stringify(this.strategyListClone));
  //		this.regionList = JSON.parse(JSON.stringify(this.regionListClone));
  //		this.countryList = JSON.parse(JSON.stringify(this.countryListClone));
  //	}
  //}

  search(form: any) {
    this.getAttributionReports();
  }

  changeReportType(e: any) {
    if (
      e.item == this.reportType.AtributionByOwnershipStake ||
      e.item == this.reportType.AttributionByHoldingPeriod ||
      e.item == this.reportType.AttributionByInvestmentSize ||
      e.item == this.reportType.AttributionByInvestmentYear
    ) {
      this.showRangeFilter = true;
    } else {
      this.showRangeFilter = false;
      this.model.rangeStart = this.model.rangeEnd = this.model.rangeParts = null;
    }
    this.model.selectedReportTypes = [e.item];
    this.ReportId = this.model.selectedReportTypes[0];
    this.getAttributionReports();
  }

  setReportTypeList() {
    //this.changeDetectorRef.detectChanges();
    let holdingsByList = this.reportService.ReportTypeList.filter(function (
      ele: any,
      i: any
    ) {
      return ele.category == ReportCategory.Attribution;
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
      this.DoEnableFilters();
    }
  }

  onDateClear() {
    this.minDate = null;
    //this.dateRange = [];
    this.model.fromDate = null;
    this.model.toDate = null;
    this.DoEnableFilters();
  }

  exportAttributionReport() {
    this.reportService
      .exportReports(this.model)
      .subscribe((response) => this.miscService.downloadExcelFile(response));
  }

  showHideFilter() {
    this.masterModel.filterSection =
      this.masterModel.filterSection == true ? false : true;
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
      selectedReportTypes: [this.reportType.AttributionBySector],
    };
    if (reportTypes != null && reportTypes.length > 0) {
      this.model.selectedReportTypes = reportTypes;
    }
    this.minDate = null;
    this.getAttributionReports();
  }

  displayFullView: boolean = false;
  fullViewModel: any = {};
  fullViewWidth: any;
  showFullView(model: any) {
    //Full View we are disable for Mobile and tablet view
    if (screen.width <= 480) {
      return;
    }
    this.fullViewModel = model;
    this.displayFullView = true;
    this.fullViewWidth = window.innerWidth * 0.9;
    //setTimeout(function (this: any) {
    //	d3.select('.ui-dialog-content').on('resized', function (d: any, i: any) {
    //		console.log(d.newWidth);
    //	});
    //}, 100, this)
  }

  hideFullView() {
    this.displayFullView = false;
  }

  onResized(event: ResizedEvent) {
    //console.log(event.newWidth);
    //console.log(event.newHeight);
  }

  onShowDislog(event: any) {
    //console.log(event);
  }

  showParentReport(report: any) {
    report.childChart = undefined;
    report.shrinkSize = false;
  }

  onRegionClicked(item: any, parentReport: any) {
    let selectedRegions = this.regionList.filter(function (el, i) {
      return el.region == item.xValue;
    });

    var node: any = d3
      .select("#divCompanyCountBarChart")
      .select("svg") //svg
      .attr("version", 1.1)
      .attr("xmlns", "http://www.w3.org/2000/svg")
      .node();

    if (selectedRegions.length > 0) {
      let childModel = JSON.parse(JSON.stringify(this.model));
      childModel.regionIds = JSON.parse(JSON.stringify(selectedRegions));
      childModel.selectedReportTypes = [this.reportType.CompanyCountsByCountry];

      var local = this;

      local.reportService.getReportData(childModel).subscribe(
        (result) => {
          let childChart = result["body"];

          if (childChart.length > 0) {
            childChart.forEach(function (val: any, i: any) {
              var titles = local.holdingsByList.filter(function (
                ele: any,
                i: any
              ) {
                return ele.value == val.ReportType;
              });
              if (titles.length > 0) {
                val.title = titles[0].label;
              }
              //parentReport.shrinkSize = true;
              parentReport.parentChart = true;
              parentReport.previousWidth = item.currentWidth;

              if (node != null && node.parentNode != null) {
                let html = node.parentNode.innerHTML;
                var imgsrc = "data:image/svg+xml;base64," + btoa(html);

                d3.select("#divChildDonutChart").html("");
                d3.select("#divChildDonutChart")
                  .append("div")
                  .attr("class", "chart-bg")
                  .append("img")
                  .attr("src", imgsrc)
                  .style("width", "100%");
              }
            });
            local.changeDetectorRef.detectChanges();
            parentReport.childChart = childChart[0];
          }

          local.spinner.hide();
        },
        (error) => {
          local.accountService.redirectToLogin(error);

          local.spinner.hide();
        }
      );
    }
  }
}
