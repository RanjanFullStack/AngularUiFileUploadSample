import { HttpClient } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { Observable, Subject, throwError } from "rxjs";
import { catchError, map } from "rxjs/operators";

@Injectable()
export class ReportService {
  private _subject = new Subject<any>();
  changeReportCategory(value: any) {
    this._subject.next(value);
  }
  get events$() {
    return this._subject.asObservable();
  }

  private dataAvailabilityInReport = new Subject<boolean>();
  setDataAvailabilityInReport(value: boolean) {
    this.dataAvailabilityInReport.next(value);
  }
  get dataAvailabilityInReportEvent$() {
    return this.dataAvailabilityInReport.asObservable();
  }

  myAppUrl: string = "";
  constructor(private http: HttpClient, @Inject("BASE_URL") baseUrl: string) {
    this.myAppUrl = baseUrl;
  }

  getReportData(filter: any): Observable<any> {
    return this.http.post<any>(this.myAppUrl + "api/report/get", filter).pipe(
      map((response: any) => response),
      catchError(this.errorHandler)
    );
  }

  getReportMasterData(): Observable<any> {
    return this.http
      .get<any>(this.myAppUrl + "api/report/master-report-model/get")
      .pipe(
        map((response: any) => response),
        catchError(this.errorHandler)
      );
  }

  getTotalCounts(): Observable<any> {
    return this.http.get<any>(this.myAppUrl + "api/dashboardcount/get").pipe(
      map((response: any) => response),
      catchError((error) => this.errorHandler(error))
    );
  }

  exportReports(filter: any) {
    return this.http
      .post(this.myAppUrl + "api/report/export", filter, {
        responseType: "blob",
        observe: "response",
      })
      .pipe(catchError(this.errorHandler));
  }

  errorHandler(error: any) {
    return throwError(error);
  }

  public ReportTypeList: any = [
    {
      label: "Holdings By Investment Cost",
      value: ReportType.TopHoldingInvestmentCost,
      category: ReportCategory.Holdings,
    },
    {
      label: "Holdings By Unrealized Value",
      value: ReportType.TopHoldingUnrealisedValue,
      category: ReportCategory.Holdings,
    },
    {
      label: "Holdings By Total Value",
      value: ReportType.TopHoldingTotalValue,
      category: ReportCategory.Holdings,
    },
    {
      label: "Holdings By Gross TVPI",
      value: ReportType.TopHoldingGrossMultiple,
      category: ReportCategory.Holdings,
    },
    {
      label: "Investments Above Cost",
      value: ReportType.InvestmentsAboveCost,
      category: ReportCategory.InvestmentsByCost,
    },
    {
      label: "Investments At Cost",
      value: ReportType.InvestmentsAtCost,
      category: ReportCategory.InvestmentsByCost,
    },
    {
      label: "Investments Below Cost",
      value: ReportType.InvestmentsBelowCost,
      category: ReportCategory.InvestmentsByCost,
    },
    {
      label: "Total Unrealized Value Quarterly",
      value: ReportType.QuarterlyUnrealizedValue,
      category: ReportCategory.ValuationCharts,
    },
    {
      label: "Total Realized Value Quarterly",
      value: ReportType.QuarterlyRealizedValue,
      category: ReportCategory.ValuationCharts,
    },
    {
      label: "Total Unrealized Value Yearly",
      value: ReportType.YearlyUnrealizedValue,
      category: ReportCategory.ValuationCharts,
    },
    {
      label: "Total Realized Value Yearly",
      value: ReportType.YearlyRealizedValue,
      category: ReportCategory.ValuationCharts,
    },
    {
      label: "By Sector",
      value: ReportType.AttributionBySector,
      category: ReportCategory.Attribution,
    },
    {
      label: "By Region",
      value: ReportType.AttributionByRegion,
      category: ReportCategory.Attribution,
    },
    {
      label: "By Investment Size",
      value: ReportType.AttributionByInvestmentSize,
      category: ReportCategory.Attribution,
    },
    {
      label: "By Investment Year",
      value: ReportType.AttributionByInvestmentYear,
      category: ReportCategory.Attribution,
    },
    {
      label: "By Realized/Unrealized Status",
      value: ReportType.AttributionByRealizedUnrealizedStatus,
      category: ReportCategory.Attribution,
    },
    {
      label: "By Public/Private Status",
      value: ReportType.AttributionByPublicPrivateStatus,
      category: ReportCategory.Attribution,
    },
    {
      label: "By Ownership Stake",
      value: ReportType.AtributionByOwnershipStake,
      category: ReportCategory.Attribution,
    },
    {
      label: "By Exit Method",
      value: ReportType.AttributionByExitMethod,
      category: ReportCategory.Attribution,
    },
    {
      label: "By Board Seat",
      value: ReportType.AttributionByBoardSeat,
      category: ReportCategory.Attribution,
    },
    {
      label: "By Fund",
      value: ReportType.AttributionByFund,
      category: ReportCategory.Attribution,
    },
    {
      label: "By Strategy",
      value: ReportType.AttributionByStrategy,
      category: ReportCategory.Attribution,
    },
    {
      label: "By Security Type",
      value: ReportType.AttributionBySecurityType,
      category: ReportCategory.Attribution,
    },
    {
      label: "By Investment Role",
      value: ReportType.AttributionByInvestmentRole,
      category: ReportCategory.Attribution,
    },
    {
      label: "By Deal Sourcing",
      value: ReportType.AttributionByDealSourcing,
      category: ReportCategory.Attribution,
    },
    {
      label: "By Currency",
      value: ReportType.AttributionByCurrency,
      category: ReportCategory.Attribution,
    },
    {
      label: "By Holding Period",
      value: ReportType.AttributionByHoldingPeriod,
      category: ReportCategory.Attribution,
    },
    {
      label: "Financial KPI",
      value: ReportType.CompanyFinancialKPIReport,
      category: ReportCategory.CompanyFinancials,
    },
    {
      label: "Operational KPI",
      value: ReportType.CompanyOperationalKPIGrowth,
      category: ReportCategory.CompanyFinancials,
    },
    {
      label: "Peer Comparison",
      value: ReportType.CompanyFinancialPeerComparison,
      category: ReportCategory.CompanyFinancials,
    },
  ];

  public ReportCategoryList: any = [
    {
      label: "Top Holdings",
      value: ReportCategory.Holdings,
    },
    {
      label: "Valuation Analysis",
      value: ReportCategory.ValuationCharts,
    },
    {
      label: "Attribution Reports",
      value: ReportCategory.Attribution,
    },
    {
      label: "Financial/Operational KPIs",
      value: ReportCategory.CompanyFinancials,
    },
  ];

  public ChartMetadatDetails(chartType: string) {
    var metadataList: any = [
      {
        type: "AttributionBySector",
        metadata: [
          {
            chartName: "Capital Invested",
            chartType: "Pie",
            colNameX: "Sector",
            colNameY: "% of Total Capital",
          },
          {
            chartName: "Unrealized Value",
            chartType: "Pie",
            colNameX: "Sector",
            colNameY: "% of Unrealized Value",
          },
          {
            chartName: "Realized Value",
            chartType: "Pie",
            colNameX: "Sector",
            colNameY: "% of Realized Value",
          },
          {
            chartName: "Total Value",
            chartType: "Pie",
            colNameX: "Sector",
            colNameY: "% of Total Value",
          },
          {
            chartName: "Return",
            chartType: "ColumnClustered",
            colNameX: "Sector",
            colNameY: "Return",
          },
        ],
      },
    ];

    let chart = metadataList.filter(function (ele: any, i: any) {
      return ele.type == chartType;
    });
    return chart[0].metadata;
  }
}

export enum ReportType {
  TopHoldingInvestmentCost,
  TopHoldingUnrealisedValue,
  TopHoldingTotalValue,
  TopHoldingGrossMultiple,
  InvestmentsAboveCost,
  InvestmentsAtCost,
  InvestmentsBelowCost,
  CompanyCountsBySector,
  CompanyCountsByRegion,
  CompanyCountsByCountry,
  QuarterlyUnrealizedValue,
  QuarterlyRealizedValue,
  YearlyUnrealizedValue,
  YearlyRealizedValue,
  AttributionBySector,
  AttributionByRegion,
  AttributionByRealizedUnrealizedStatus,
  AttributionByInvestmentYear,
  AttributionByInvestmentSize,
  AttributionByPublicPrivateStatus,
  AtributionByOwnershipStake,
  AttributionByExitMethod,
  AttributionByBoardSeat,
  AttributionByFund,
  AttributionByStrategy,
  AttributionBySecurityType,
  AttributionByInvestmentRole,
  AttributionByDealSourcing,
  AttributionByCurrency,
  AttributionByHoldingPeriod,
  CompanyRevenueGrowth,
  CompanyEBITDAGrowth,
  CompanyNetDebt,
  FundWiseGrowth_DB,
  YearlyGrowthForFund_DB,
  CompanyWiseGrowthForFund_DB,
  SectorwiseValues_DB,
  FundwiseValuesForSector_DB,
  FundwiseMultipleForSector_DB,
  SectorWiseInvestmentAndGrowth_DB,
  RegionWiseInvestementAndGrowth_DB,
  Top10CompanyByTotalValue_DB,
  TotalValueByStrategy_DB,
  UnrealizedValueByStrategy_DB,
  SectorwiseValues_FundDetails,
  QuarterlyTVPI_IRR_FundDetails,
  CompanyOperationalKPIGrowth,
  CompanyFinancialKPIReport,
  CompanyFinancialPeerComparison,
  CompanyKPIReport,
  InvestmentKPIReport,
}

export enum ReportCategory {
  Holdings,
  InvestmentsByCost,
  ValuationCharts,
  Attribution,
  CompanyFinancials,
}
