import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { MessageService } from "primeng/primeng";
import { AccountService } from "../../services/account.service";
import { FundService } from "../../services/funds.service";
import { ErrorMessage, MiscellaneousService, PeriodTypeEnum, PeriodTypeFilterEnum } from "../../services/miscellaneous.service";
import { PortfolioCompanyService } from "../../services/portfolioCompany.service";
@Component({
  selector: 'dataExtraction',
  templateUrl: './portfolioCompany-DataExtraction.component.html',
  providers: [MessageService]
})

export class PortfolioCompanyDataExtractionComponent implements OnInit {
  fundList: any[];
  allPortfolioCompanyList: any[];
  portfolioCompanyList: any[];
  portfolioCompanyLoading: boolean;
  KPITypeList: any[] = [{ KPITypeId: "1", KPIType: "Investment KPIs", category: "Investment KPIs" }, { KPITypeId: "2", KPIType: "Company KPIs", category: "Company KPIs" }, { KPITypeId: "3", KPIType: "Impact KPIs", category: "Impact KPIs" }, { KPITypeId: "4", KPIType: "Financials - Balance Sheet", category: "Balance Sheet" }, { KPITypeId: "5", KPIType: "Financials - Profit and Loss", category: "Profit and Loss" }, { KPITypeId: "6", KPIType: "Financials - Cash Flow", category: "Cash Flow" }, { KPITypeId: "7", KPIType: "Standing Data", category: "Standing Data" }];
  allKPIList: any[];
  KPIList: any[];
  periods = [];
  periodTypes = [];
  yearRange: any;
  totalRecords: any;
  loading = false;
  msgTimeSpan: number;
  message: any;
  selectedFunds: any[];
  selectedPeriod: any = { type: "" };
  selectedKPIType: any;
  selectedPeriodType: any;
  selectedMonths: any = [];
  selectedMonth: any;
  previousSelectedFund: any;
  model: any = {
    selectedCompanies: [],
    selectedKPIs: [],
    selectedPeriods: [],
    selectedPeriodType: ""
  };
  previewDateRangeModel: any = {
    selectedCompanies: [],
    selectedKPIs: [],
    kpiType: ""
  }
  kpiQueryModel : any = {
    portfolioCompanyIds : "",
    kpiType : ""
  }
  yearOptions: any = [];
  monthOptions: any = [];
  quarterOptions: any = [{ value: "Q1", text: "Q1", number: 1 }, { value: "Q2", text: "Q2", number: 2 }, { value: "Q3", text: "Q3", number: 3 }, { value: "Q4", text: "Q4", number: 4 }];
  //dateRange: any[];
  dataFilter: any = {};
  exportFinancialReportLoading: boolean = false;
  settings: any = { disabled: this.KPIList != null && this.KPIList.length > 0 ? false : true };
  companyKPIsList: any[] = [];

  constructor(private miscService: MiscellaneousService,
    private _fundService: FundService,
    private portfolioCompanyService: PortfolioCompanyService,
    private messageService: MessageService,
    private accountService: AccountService,
    protected changeDetectorRef: ChangeDetectorRef) {
    var year = new Date();
    this.yearRange = "2000:" + year.getFullYear();
    this.dataFilter.fromQuarter = "";
    this.dataFilter.toQuarter = "";
    this.dataFilter.fromYear = "";
    this.dataFilter.toYear = "";
    this.yearOptions = this.miscService.bindYearList();
    this.monthOptions = this.miscService.bindMonthList();
  }

  ngOnInit() {
    this.InitializeDataExtractionPage();
  }

  InitializeDataExtractionPage() {
    this.msgTimeSpan = this.miscService.getMessageTimeSpan();
    this.getFundList(null);
    this.getPortfolioCompanyList();
  }

  getFundList(event: any) {
    if (event == null) {
      event = { first: 0, rows: 10, globalFilter: null, sortField: null, sortOrder: 1 };
    }
    this._fundService.getFundsList({ paginationFilter: event }).subscribe(result => {
      let resp = result.body;
      if (resp != null && result.code == "OK") {
        this.fundList = resp.fundList;
        this.totalRecords = resp.totalRecords;
      }
      else {
        this.fundList = [];
        this.totalRecords = 0;
      }
    }, error => {
      this.accountService.redirectToLogin(error);
    });
  }

  onFundChange(event: any) {
    let selectedFunds = event.value;
    if (selectedFunds.length == 0) {
      this.portfolioCompanyList = this.allPortfolioCompanyList;
      return;
    }
    if (this.model.selectedCompanies.length != 0 && selectedFunds.length != 2) {
      if (this.previousSelectedFund != undefined && selectedFunds[0].fundID != this.previousSelectedFund[0].fundID) {
        this.model.selectedCompanies = [];
      }
    }
    this.portfolioCompanyList = [];
    selectedFunds.forEach(element => {
      this.portfolioCompanyList = this.portfolioCompanyList.concat(this.allPortfolioCompanyList.filter(x => x.fundDetails.fundID == element.fundID));
    });
    this.previousSelectedFund = selectedFunds;
  }

  getPortfolioCompanyList() {
    this.portfolioCompanyList = null;
    this.portfolioCompanyLoading = true;
    this.miscService.getPortfolioCompanyList({}).subscribe(
      result => {
        let resp = result;
        if (resp != null && resp.code == "OK") {
          this.portfolioCompanyList = resp.body.portfolioCompanyList;
          this.allPortfolioCompanyList = resp.body.portfolioCompanyList;
        }
        setTimeout(
          function (local: any) {
            local.portfolioCompanyLoading = false;
          },
          5,
          this
        );
      },
      error => {
        this.accountService.redirectToLogin(error);
        this.portfolioCompanyLoading = false;
      }
    );
  }
  onPeriodClear(){
    this.selectedPeriod = "";
  }
  onPeriodTypeClear(){
    this.selectedPeriodType = "";
  }
  onCompanySelection(event: any) {
    this.getPCKPIListByCompany();
    //this.model.selectedKPIs = [];

    if (this.model.selectedCompanies.length > 1 && this.selectedPeriodType != undefined && this.selectedPeriodType.type == PeriodTypeFilterEnum.YTD) {
      this.selectedPeriodType = "";
    }
    if (this.selectedKPIType != undefined && (this.selectedKPIType.KPIType == "Company KPIs"
       || this.selectedKPIType.KPIType == "Financials - Profit and Loss" || this.selectedKPIType.KPIType == "Financials - Cash Flow")) {
      this.periodTypes = this.model.selectedCompanies.length > 1 ?
      [{ type: PeriodTypeFilterEnum.Monthly }, { type: PeriodTypeFilterEnum.Quarterly }, { type: PeriodTypeFilterEnum.Annual },
      { type: PeriodTypeFilterEnum.LTM }]
      :
      [{ type: PeriodTypeFilterEnum.Monthly }, { type: PeriodTypeFilterEnum.Quarterly }, { type: PeriodTypeFilterEnum.YTD },
      { type: PeriodTypeFilterEnum.Annual }, { type: PeriodTypeFilterEnum.LTM }];
    }
    if(this.selectedKPIType != undefined && this.selectedKPIType.KPIType == "Financials - Balance Sheet"){
      this.periodTypes = [{ type: PeriodTypeFilterEnum.Monthly }, { type: PeriodTypeFilterEnum.Quarterly }, { type: PeriodTypeFilterEnum.Annual }];
    }
    this.GetDateRangeForDataExtractionReport();
  }

  clearKPIsNotAvailableInSelectedCompanies() {
    // var temp = this.allKPIList.some(x => this.model.containsAll(x));
    var newList: any = [];
    this.model.selectedKPIs.forEach(element => {
      let found = this.KPIList.filter(y => y.itemName == element.itemName);
      let item = found.length > 0 ? found[0] : null;
      if (item != null) newList.push(item);
    });
    this.model.selectedKPIs = newList;
  }

  getPCKPIListByCompany() {
    if (this.model.selectedCompanies.length == 0 || this.selectedKPIType == null || this.selectedKPIType.category == null) return;
    let companyList = this.model.selectedCompanies;

    if (companyList.length != 0) {
      let portfolioCompanyIdList = Array.prototype.map
        .call(companyList, function (item) {
          return item.portfolioCompanyID;
        })
        .join(",");
        this.kpiQueryModel = {
          portfolioCompanyIds : portfolioCompanyIdList,
          kpiType : this.selectedKPIType.category
        }
      this.miscService.getKPIListByPCIdsKPIType(this.kpiQueryModel).subscribe(response => {
        this.allKPIList = response.body;
        this.KPIList = response.body;
        this.setting();
        //this.getKPITypesFromKPIs();
      //  this.filterKPIBasedOnKPITypes();
        this.clearKPIsNotAvailableInSelectedCompanies();
      },
        error => {
          this.message = this.miscService.showAlertMessages('error', error.message);
        });
    }
  }

  setting() {
    this.settings = {
      singleSelection: false,
      text: "Select Multiple",
      selectAllText: 'Select All',
      unSelectAllText: 'Select All',
      searchPlaceholderText: 'Search KPI',
      enableSearchFilter: true,
      disabled: this.KPIList != null || this.KPIList != undefined ? false : true,
      badgeShowLimit: 1,
      groupBy: "category"
    };
  }

  getKPITypesFromKPIs() {
    this.KPITypeList = [];
    let index = 1;
    let distinctElementsByCategory = this.allKPIList.filter((item, i, arr) => {
      return arr.indexOf(arr.find(t => t.category === item.category)) === i;
    });
    distinctElementsByCategory.forEach(element => {
      this.KPITypeList.push({ KPITypeId: index, KPIType: element.category });
      index = index + 1;
    });
  }
  onKPITypeSelection(event: any) {
    //filter KPIs based on KPI types
    if (this.selectedKPIType != null && this.selectedKPIType.category != null && this.selectedKPIType.category != undefined) {
      this.getPCKPIListByCompany();
    }
   // this.filterKPIBasedOnKPITypes();
    if (this.selectedKPIType.KPIType == "Company KPIs" ||      
      this.selectedKPIType.KPIType == "Financials - Profit and Loss" || this.selectedKPIType.KPIType == "Financials - Cash Flow") {
      this.selectedPeriod = "";
      this.periods = [{ type: PeriodTypeEnum.Last1Year },
      { type: PeriodTypeEnum.Last3Years },
      { type: PeriodTypeEnum.Last5Years },
      { type: PeriodTypeEnum.Last10Years },];

      this.periodTypes = [];
      this.periodTypes = this.model.selectedCompanies.length > 1 ?
        [{ type: PeriodTypeFilterEnum.Monthly }, { type: PeriodTypeFilterEnum.Quarterly }, { type: PeriodTypeFilterEnum.Annual },
        { type: PeriodTypeFilterEnum.LTM }]
        :
        [{ type: PeriodTypeFilterEnum.Monthly }, { type: PeriodTypeFilterEnum.Quarterly }, { type: PeriodTypeFilterEnum.YTD },
        { type: PeriodTypeFilterEnum.Annual }, { type: PeriodTypeFilterEnum.LTM }];
    }
    else if(this.selectedKPIType.KPIType == "Financials - Balance Sheet"){
      this.selectedPeriod = "";
      this.periods = [{ type: PeriodTypeEnum.Last1Year },
      { type: PeriodTypeEnum.Last3Years },
      { type: PeriodTypeEnum.Last5Years },
      { type: PeriodTypeEnum.Last10Years },];
      this.periodTypes = [];
      this.periodTypes = [{ type: PeriodTypeFilterEnum.Monthly }, { type: PeriodTypeFilterEnum.Quarterly }, { type: PeriodTypeFilterEnum.Annual }];
    }
    else if(this.selectedKPIType.KPIType == "Impact KPIs"){
      this.periodTypes = [];
      this.periodTypes = [
        { type: PeriodTypeFilterEnum.Annual },
        { type: PeriodTypeFilterEnum.YTD },        
      ];
      this.selectedPeriod = "";
      this.periods = [{ type: PeriodTypeEnum.Last1Year },
      { type: PeriodTypeEnum.Last3Years },
      { type: PeriodTypeEnum.Last5Years },
      { type: PeriodTypeEnum.Last10Years },];
    }
    else { //investment kpi
      this.periodTypes = [];
      this.periodTypes = [
        { type: PeriodTypeFilterEnum.Quarterly },
        { type: PeriodTypeFilterEnum.Annual },
      ];
      this.selectedPeriod = "";
      this.periods = [{ type: PeriodTypeEnum.Last1Year },
      { type: PeriodTypeEnum.Last3Years },
      { type: PeriodTypeEnum.Last5Years },
      { type: PeriodTypeEnum.Last10Years },
      { type: PeriodTypeEnum.Custom },];
    }
    //clear the selected KPIs
    this.model.selectedKPIs = [];
    this.selectedPeriodType = "";
    this.GetDateRangeForDataExtractionReport();
  }

  filterKPIBasedOnKPITypes() {
    // if (this.selectedKPITypes.length == 0) return;

    // let filteredKPIs = [];
    // this.selectedKPITypes.forEach(item => {
    //   filteredKPIs = filteredKPIs.concat(this.allKPIList.filter(x => x.category == item.KPIType));
    // });
    if (this.selectedKPIType == undefined || this.allKPIList == undefined) return;
    let filteredKPIs = this.allKPIList.filter(x => x.category == this.selectedKPIType.category);
    this.KPIList = filteredKPIs;
  }

  onKPIItemSelect(event: any) {
    if (this.KPIList.length == 0) {
      console.log();
    }
    else {
      this.GetDateRangeForDataExtractionReport();
    }
  }

  GetDateRangeForDataExtractionReport() {

    if (this.model.selectedCompanies.length == 0 || this.model.selectedKPIs.length == 0 || this.selectedKPIType == null || this.selectedKPIType.category == null || this.KPIList == null || this.KPIList.length == 0) {
      this.companyKPIsList = [];
      return;
    }
    this.previewDateRangeModel = {
      selectedCompanies: this.model.selectedCompanies,
      selectedKPIs: this.model.selectedKPIs,
      kpiType: this.selectedKPIType.category
    }

    this.miscService.getDateRangeForDataExtractionReport(this.previewDateRangeModel).subscribe((response: any) => {
      if (response.status == 204) {
        this.companyKPIsList = [];
      }
      else {
        let res = response.body;
        if (res != null && res.body != null && res.body.companyKPIDateRangeList != null) {
          this.companyKPIsList = res.body.companyKPIDateRangeList;
        }
      }
    }, error => {
      this.companyKPIsList = [];
      this.message = this.miscService.showAlertMessages('error', ErrorMessage.SomethingWentWrong);
    });
  }

  OnKPIDeSelect(event: any) {

  }

  onKPISelectAll(event: any) {
    if (this.KPIList.length == 0) {
      console.log();
    }
  }

  onKPIDeSelectAll(event: any) {

  }

  onPeriodTypeSelect() {
    this.model.selectedPeriodType = this.selectedPeriodType.type;
    if (this.model.selectedPeriodType.type != PeriodTypeFilterEnum.Monthly) {
      this.selectedMonths = "";      
    }
    if (this.model.selectedPeriodType.type != PeriodTypeFilterEnum.LTM || this.model.selectedPeriodType.type != PeriodTypeFilterEnum.YTD) {
      this.selectedMonth = undefined;
      this.dataFilter.Quarter = undefined;
    }
  }


  onPeriodSelect() {
    this.setPeriodDatesForModel();
  }

  search(form: any) {
    this.setPeriodDatesForModel();
    this.ExportFinancialReport();
  }

  ExportFinancialReport() {
    if (this.model.selectedKPIs.length == 0 && (this.KPIList == undefined || this.KPIList.length == 0)) {
      if (this.selectedKPIType != undefined && this.selectedKPIType != "") {
        this.message = this.miscService.showAlertMessages('error', ErrorMessage.NoDataAvailableForCompanyKPIType);
        return;
      }
      this.message = this.miscService.showAlertMessages('error', ErrorMessage.SelectAtleastOneKpi);
      return;
    }
    if (this.selectedKPIType.KPIType != "Standing Data" && (this.selectedPeriodType == "" || this.model.selectedPeriods.length == 0 || this.model.selectedCompanies.length == 0 || this.model.selectedKPIs.length == 0)) {
      this.message = this.miscService.showAlertMessages('error', ErrorMessage.SelectRequiredFields);
      return;
    }
    this.exportFinancialReportLoading = true;
    this.miscService.exportFinancialReport(this.model).subscribe(response => {
      if (response.status == 204) {
        this.message = this.miscService.showAlertMessages('error', ErrorMessage.NoRecordFoundMessage);
        this.exportFinancialReportLoading = false;
      }
      else {
        this.miscService.downloadExcelFile(response)
        this.exportFinancialReportLoading = false;
      }
    }, error => {
      this.message = this.miscService.showAlertMessages('error', ErrorMessage.SomethingWentWrong);
      this.exportFinancialReportLoading = false;
    });
  }


  setPeriodDatesForModel() {
    let periodType = (this.selectedPeriod != undefined || this.selectedPeriod.type != "")
      ? this.selectedPeriod.type
      : null;
    this.model.selectedPeriods = [];
    this.model.isAscending = 1;
    if (periodType == PeriodTypeEnum.Last1Year) {
      this.model.selectedPeriods.push(PeriodTypeEnum.Last1Year);
    }
    if (periodType == PeriodTypeEnum.Last3Years) {
      this.model.selectedPeriods.push(PeriodTypeEnum.Last3Years);
    }
    if (periodType == PeriodTypeEnum.Last5Years) {
      this.model.selectedPeriods.push(PeriodTypeEnum.Last5Years);
    }
    if (periodType == PeriodTypeEnum.Last10Years) {
      this.model.selectedPeriods.push(PeriodTypeEnum.Last10Years);
    }
    if (this.selectedPeriod != undefined && this.selectedPeriod.type == "Custom") {
      if (this.dataFilter.fromYear == "" || this.dataFilter.toYear == "") return;
      var toDate = new Date(Date.UTC(+this.dataFilter.toYear.value, 11, 31));
      var fromDate = new Date(Date.UTC(+this.dataFilter.fromYear.value, 0, 1));
      if (this.selectedPeriodType.type == PeriodTypeFilterEnum.Quarterly) {
        if (this.dataFilter.fromQuarter != "" && this.dataFilter.toQuarter != "") {
          toDate = this.miscService.getQuarterLastDateByQuarter(this.dataFilter.toQuarter.value, this.dataFilter.toYear.value);
          fromDate = this.miscService.getQuarterLastDateByQuarter(this.dataFilter.fromQuarter.value, this.dataFilter.fromYear.value);
        }
        else
          return;
      }

      this.model.fromDate = fromDate;
      this.model.toDate = toDate;
      this.model.isAscending = 1;
      this.model.filter = PeriodTypeEnum.Custom;
      this.model.selectedPeriods.push(PeriodTypeEnum.Custom);
    }

    if (this.selectedMonths != undefined) {
      var selectedMonths: any = [];
      if (this.selectedMonths.length > 0) {
        this.selectedMonths.forEach(element => {          
            selectedMonths.push(+this.miscService.getMonthNumber(element.value));
        });
        this.model.selectedMonths = selectedMonths;
      }
    }
    if (this.selectedMonth != undefined) {
      var selectedMonths: any = [];
      selectedMonths.push(+this.miscService.getMonthNumber(this.selectedMonth.value));
      this.model.selectedMonths = selectedMonths;
    }
    if (this.selectedPeriod != undefined && (this.selectedPeriodType.type == PeriodTypeEnum.YearToDate || this.selectedPeriodType.type == PeriodTypeFilterEnum.LTM)
      && this.selectedKPIType != undefined && ( this.selectedKPIType.KPIType == "Impact KPIs") && this.dataFilter.Quarter != undefined) {
      this.model.tradingRecordPeriod = this.dataFilter.Quarter.value;
    }
  }

  validateFromQuarter() {
    if (this.dataFilter.fromQuarter == "") return;
    if (this.dataFilter.fromQuarter.number > this.dataFilter.toQuarter.number) {
      this.message = this.miscService.showAlertMessages('error', "'From Quarter' must be less than or equal to 'To Quarter'");
      this.dataFilter.fromQuarter = "";
      this.changeDetectorRef.detectChanges();
      return;
    }
  }

  validateToQuarter() {
    if (this.dataFilter.toQuarter == "") return;
    if (this.dataFilter.fromQuarter.number > this.dataFilter.toQuarter.number) {
      this.message = this.miscService.showAlertMessages('error', "'To Quarter' must be greater than or equal to 'From Quarter'");
      this.dataFilter.toQuarter = "";
      this.changeDetectorRef.detectChanges();
      return;
    }
  }

  validateSelectedFromYear() {
    if (this.dataFilter.toYear == "") return;
    if (this.dataFilter.fromYear.value > this.dataFilter.toYear.value) {
      this.message = this.miscService.showAlertMessages('error', "'From year' must be less than or equal to 'To Year'");
      this.dataFilter.fromYear = "";
      this.changeDetectorRef.detectChanges();
      return;
    }
    this.setPeriodDatesForModel();
  }

  validateSelectedToYear() {
    if (this.dataFilter.fromYear == "") return;
    if (this.dataFilter.toYear.value < this.dataFilter.fromYear.value) {
      this.message = this.miscService.showAlertMessages('error', "'To year' must be greater than or equal to 'From Year'");
      this.dataFilter.toYear = "";
      this.changeDetectorRef.detectChanges();
      return;
    }
    this.setPeriodDatesForModel();
  }

  onMonthsSelect(event: any) {
   
  }

  resetForm(form: any) {
    this.fundList = [];
    this.allPortfolioCompanyList = [];
    this.allKPIList = [];
    this.KPIList = [];
    this.periodTypes = [];
    this.selectedFunds = [];
    this.selectedKPIType = undefined;
    this.selectedPeriod = "";
    this.selectedPeriodType = undefined;
    this.model.selectedCompanies = [];
    this.model.selectedKPIs = [];
    this.model.selectedPeriods = [];
    this.model.selectedPeriodType = undefined;
    this.model.selectedMonths = [];
    this.selectedMonths = [];
    this.companyKPIsList = [];
    this.InitializeDataExtractionPage();
  }
}
