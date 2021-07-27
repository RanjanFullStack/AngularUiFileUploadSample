import { Filter } from "../custom-controls/Filter.model";
import { FilterControlComponent } from "../custom-controls/filter-control.component";
import { ViewChild } from "@angular/core";

interface IFilter {
  GetItems(item: string, reportFilters: any[]);
  Init(ReportID: number);
  DoEnableFilters();
  LoadSavedFilter(item: any);
}

export abstract class AbstractFilterStrategy implements IFilter {
  IsEnabled: boolean = false;
  ReportId: number = 0;
  Filter: Filter = new Filter();
  strategyListClone: any[];
  fundHoldingStatusList: any[];
  fundHoldingStatusListClone: any[];
  regionListClone: any[];
  countryListClone: any[];
  model: any;
  fundListClone: any[];
  dateRange: any[];
  @ViewChild("filter") filter: FilterControlComponent;
  public GetItems(item: string, reportFilters: any[]) {
    if (reportFilters != undefined) {
      let values = reportFilters.find((s) => s.filterName === item);
      if (values !== undefined) values = values.filterValues.split(",");
      return values === undefined ? [] : values;
    }
  }
  public Init(ReportID: number) {
    this.Filter = new Filter();
    this.Filter.ReportID = ReportID;
    this.ReportId = ReportID;
  }
  public DoEnableFilters() {
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
        this.filter.IsEnabled = true;
      }
    } else {
      this.IsEnabled = false;
      this.Filter.reportFilters = [];
    }
  }
  LoadSavedFilter(item: any) {
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

      this.model.fundHoldingStatusIds = this.fundHoldingStatusListClone.filter(
        (s) => {
          return this.GetItems("Status", reportFilters).indexOf(s.status) >= 0;
        }
      );
      let ToDate = this.GetItems("EvaluationDate", reportFilters);
      this.model.toDate = null;
      this.model.fromDate = null;
      this.dateRange=null;
      if (ToDate.length > 0) {
        ToDate = ToDate[0].split("=");
        this.model.toDate = new Date(ToDate[0]);
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
}
