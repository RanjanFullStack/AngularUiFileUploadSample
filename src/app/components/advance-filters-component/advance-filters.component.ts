import { Component, OnInit, Output, EventEmitter, Input, ViewChild, ElementRef, HostListener } from '@angular/core';
import { DocumentService } from "../../services/document.service";
import { FirmService } from "src/app/services/firm.service";
import { FundService } from "src/app/services/funds.service";
import { PortfolioCompanyService } from "src/app/services/portfolioCompany.service";
import { DealService } from "src/app/services/deal.service";

@Component({
  selector: 'advance-filters',
  templateUrl: './advance-filters.component.html',
  styleUrls: ['./advance-filters.component.css']
})
export class AdvanceFiltersComponentComponent implements OnInit{


  @Input() fileFormats = [];
  @Input() docTypes = [];
  @Input() subDocTypes = [];
  firms = [];
  funds = [];
  portfolioComapanies = [];
  deals = [];
  @Input() ResetAdvFilters = false;
  @Input() fromDate:Date;
  @Input() toDate:Date;
  @Input() appliedFilters = [];


  @Output() GetDocumentsByFilter = new EventEmitter<any>();
  @Output() closeFiltersPopover = new EventEmitter<any>();
  @Output() clearAllFilters = new EventEmitter<any>();
  @Output() resetEnableAdvancedFilters = new EventEmitter<any>();

  @ViewChild('advancedFilters') elementRef: ElementRef;

  filterCategories = [];
  activeFilterCategory = "File Format";
  activeFilterList = [];
  disableApplyFilters = true;
  documentFilters;
  toDateValidationMsg = "";
  fromDateValidationMsg = ""
  hasInvalidDateInput = false;
  advancedFilters = [];

  DocFormats = [];
  appliedSubDocTypes = [];
  appliedDocTypes = [];
  appliedFromDate:Date;
  appliedToDate:Date;

  @Input() selectedFirms : string[] = [];
  @Input() selectedFunds : string[] = [];
  @Input() selectedPortfolioComapanies : string[] = [];
  @Input() selectedDeals: string[] = [];

  appliedFirms : string[] = [];
  appliedFunds : string[] = [];
  appliedPortfolioComapanies : string[] = [];
  appliedDeals: string[] = [];

  constructor(private documentService: DocumentService,private firmService: FirmService,private fundService: FundService,
    private portfolioCompanyService: PortfolioCompanyService, private dealService: DealService) { }

  ngOnInit() {
    this.GetAllFilterCategories();
    this.getFilterValues();
    this.getAllFirms();
    this.getAllDeals();
    this.getAllPortfolioCompanies();
    this.getAllFunds();
  }

  getFilterValues () {
      if (this.fileFormats.length === 0) {
      this.GetAllFileFormats();
    } else {
      this.activeFilterList = JSON.parse(JSON.stringify(this.fileFormats));
      this.DocFormats = JSON.parse(JSON.stringify(this.fileFormats));
    }
    if (this.docTypes.length === 0) {
      this.GetAllTypes();
    } else {
      this.appliedDocTypes = JSON.parse(JSON.stringify(this.docTypes));
    }
    if (this.subDocTypes.length === 0) {
      this.GetAllSubTypes();
    } else {
      this.appliedSubDocTypes = JSON.parse(JSON.stringify(this.subDocTypes));
    }
    if (this.selectedFirms !== undefined && this.selectedFirms.length > 0) {
      this.appliedFirms = JSON.parse(JSON.stringify(this.selectedFirms));
    } 

    if (this.selectedFunds!== undefined && this.selectedFunds.length > 0) {
      this.appliedFunds = JSON.parse(JSON.stringify(this.selectedFunds));
    } 

    if (this.selectedPortfolioComapanies!== undefined && this.selectedPortfolioComapanies.length > 0) {
      this.appliedPortfolioComapanies = JSON.parse(JSON.stringify(this.selectedPortfolioComapanies));
    } 

    if (this.selectedDeals!== undefined && this.selectedDeals.length > 0) {
      this.appliedDeals = JSON.parse(JSON.stringify(this.selectedDeals));
    } 

    if (this.appliedFilters !== undefined && this.appliedFilters.length > 0) {
      this.advancedFilters = JSON.parse(JSON.stringify(this.appliedFilters));
    }

  }

  GetAllFilterCategories() {
    this.documentService.GetAllFilterCategories().subscribe(
      (result) => {
        this.filterCategories = JSON.parse(JSON.stringify(result));
      },
      (error) => console.log(error)
    );
  }

  GetAllFileFormats() {
    this.documentService.GetAllFileFormats().subscribe(
      (result) => {
        this.fileFormats = JSON.parse(JSON.stringify(result));
        this.activeFilterList = JSON.parse(JSON.stringify(this.fileFormats));
        this.DocFormats = JSON.parse(JSON.stringify(this.fileFormats));
      },
      (error) => console.log(error)
    );
    this.activeFilterList = JSON.parse(JSON.stringify(this.fileFormats));
  }

  GetAllTypes() {
    this.documentService.getAllDocumentTypes(0).subscribe(
      (result) => {
        let types = JSON.parse(JSON.stringify(result));
        types.forEach(element => {
          this.docTypes.push({ name: element.name, isChecked: false });
        });
        this.appliedDocTypes = JSON.parse(JSON.stringify(this.docTypes));
      },
      (error) => console.log(error)
    );
  }

  GetAllSubTypes() {
    this.documentService.getAllSubDocumentTypes().subscribe(
      (result) => {
        let subtypes = JSON.parse(JSON.stringify(result));
        subtypes.forEach(element => {
          this.subDocTypes.push({ name: element.name, isChecked: false });
        });
        this.appliedSubDocTypes = JSON.parse(JSON.stringify(this.subDocTypes));
      },
      (error) => console.log(error)
    );
  }

  selectFilterCategory(category) {
    this.activeFilterCategory = category;
    this.ResetAdvFilters = false;
    switch (category) {
      case 'File Format': {
        this.activeFilterList = JSON.parse(JSON.stringify(this.fileFormats));
        break;
      }
      case 'Document Date': {
        this.activeFilterList = [];
        break;
      }
      case 'Type': {
        this.activeFilterList = this.docTypes;
        break;
      }
      case 'Sub-Type': {
        this.activeFilterList = this.subDocTypes;
        break;
      }
      case 'Firm Name': {
        this.activeFilterList = [];
        break;
      }
      case 'Fund Name': {
        this.activeFilterList = [];
        break;
      }
      case 'Portfolio Company': {
        this.activeFilterList = [];
        break;
      }
      case 'Deal ID': {
        this.activeFilterList = [];
        break;
      }
    }
  }


  GetDocumentsByAdvFilter() {
    this.documentFilters = { SearchPhrase: null, advancedFilter: this.advancedFilters }
    this.GetDocumentsByFilter.emit({
      documentFilters: this.documentFilters, FileFormats: this.fileFormats,
      docTypes: this.docTypes, subDocTypes: this.subDocTypes,
      toDate: this.toDate, fromDate: this.fromDate, firms: this.selectedFirms,
      funds: this.selectedFunds, portfolioComapanies: this.selectedPortfolioComapanies, deals: this.selectedDeals
    });
  }

  updateAdvFiltersList(list,category) {
    let values = [];
    list.forEach(obj => {
      if (obj.isChecked) {
        values.push(obj.name);
      }
    })
    this.advancedFilters = this.advancedFilters.filter(x => x.Category !== category);
    if (values.length > 0) {
      this.advancedFilters.push({ Category: category, Values: values });
    }
    this.setDisableApplyFilters();
  }

  handleCheckBox(event, index) {
    this.ResetAdvFilters = false;

    switch (this.activeFilterCategory) {
      case 'File Format': {
        this.fileFormats[index].isChecked = event.target.checked;
        break;
      }
      case 'Type': {
        this.docTypes[index].isChecked = event.target.checked;
        break;
      }
      case 'Sub-Type': {
        this.subDocTypes[index].isChecked = event.target.checked;
        break;
      }
    }

    this.updateAdvFiltersList(this.fileFormats, 'File Format');
    this.updateAdvFiltersList(this.docTypes,'Type');
    this.updateAdvFiltersList(this.subDocTypes,'Sub-Type');

  }

  onApplyFilters() {
    this.DocFormats = JSON.parse(JSON.stringify(this.fileFormats));
    this.appliedDocTypes = JSON.parse(JSON.stringify(this.docTypes));
    this.appliedSubDocTypes = JSON.parse(JSON.stringify(this.subDocTypes));
    let fDate = this.fromDate;
    let tDate = this.toDate;
    this.appliedFromDate = fDate;
    this.appliedToDate = tDate;
    this.appliedFirms = JSON.parse(JSON.stringify(this.selectedFirms));
    this.appliedFunds = JSON.parse(JSON.stringify(this.selectedFunds));
    this.appliedPortfolioComapanies = JSON.parse(JSON.stringify(this.selectedPortfolioComapanies));
    this.appliedDeals = JSON.parse(JSON.stringify(this.selectedDeals));

    this.GetDocumentsByAdvFilter();
    this.activeFilterCategory = "File Format";
    this.disableApplyFilters = true;
  }

  onCancelFilters() {
    let fDate = this.appliedFromDate;
    let tDate = this.appliedToDate;
    this.fromDate = fDate;
    this.toDate = tDate;
    this.closeFiltersPopover.emit();
    this.cancel();
  }

  @HostListener('document:click', ['$event']) onDocumentClick(event) {
    if (this.elementRef !== undefined && !this.elementRef.nativeElement.contains(event.target)) {
      this.cancel();
    }
  }

  cancel() {
    if (this.ResetAdvFilters) {
      this.reset();
    } else {
      this.fileFormats = JSON.parse(JSON.stringify(this.DocFormats));
      this.activeFilterList = JSON.parse(JSON.stringify(this.DocFormats));
      this.activeFilterCategory = "File Format";
      this.docTypes = JSON.parse(JSON.stringify(this.appliedDocTypes));
      this.subDocTypes = JSON.parse(JSON.stringify(this.appliedSubDocTypes));
      this.selectedFirms = JSON.parse(JSON.stringify(this.appliedFirms));
      this.selectedFunds = JSON.parse(JSON.stringify(this.appliedFunds));
      this.selectedPortfolioComapanies = JSON.parse(JSON.stringify(this.appliedPortfolioComapanies));
      this.selectedDeals = JSON.parse(JSON.stringify(this.appliedDeals));
      let fDate = this.appliedFromDate;
      let tDate = this.appliedToDate;
      this.fromDate = fDate;
      this.toDate = tDate;
      this.resetEnableAdvancedFilters.emit();
    }
  }

  resetCheckList(list) {
    list.map((item) => {
      item.isChecked = false;
      return item;
    })
  }

  reset() {
    this.resetCheckList(this.fileFormats);
    this.resetCheckList(this.docTypes);
    this.resetCheckList(this.subDocTypes);
    this.activeFilterList = this.fileFormats;
    this.DocFormats = JSON.parse(JSON.stringify(this.fileFormats));
    this.appliedDocTypes = JSON.parse(JSON.stringify(this.docTypes));
    this.appliedSubDocTypes = JSON.parse(JSON.stringify(this.subDocTypes));
    this.advancedFilters = [];
    this.disableApplyFilters = true;
    this.fromDate = undefined;
    this.toDate = undefined;
    this.selectedFirms = [];
    this.selectedFunds = [];
    this.selectedPortfolioComapanies = [];
    this.selectedDeals = [];
    this.appliedFirms = [];
    this.appliedFunds = [];
    this.appliedPortfolioComapanies = [];
    this.appliedDeals = [];
  }

  clearAll(){
    if(!this.disableApplyFilters) {
      this.toDateValidationMsg = "";
      this.fromDateValidationMsg = "";
      this.hasInvalidDateInput = false;
      this.reset();
      this.clearAllFilters.emit();
    }
  }

  onChangeFromDate (fromDate) {
    this.fromDateValidationMsg = "";
    this.toDateValidationMsg = "";
    this.hasInvalidDateInput = false;
    if(this.toDate !== undefined && this.toDate !== null  && fromDate > this.toDate){
      this.fromDateValidationMsg = "From Date is more than To Date";
      this.hasInvalidDateInput = true;
      this.setDisableApplyFilters();
    } else {
      this.updateAdvFiltersDocDate();
    }
  }

  onChangeToDate (toDate) {
    this.toDateValidationMsg = "";
    this.fromDateValidationMsg = "";
    this.hasInvalidDateInput = false;
    if(this.fromDate !== undefined && this.fromDate !== null && toDate < this.fromDate){
      this.hasInvalidDateInput = true;
      this.toDateValidationMsg = "To Date is less than From Date";
      this.setDisableApplyFilters();
    } else {
      this.updateAdvFiltersDocDate();
    }
  }

  updateAdvFiltersDocDate() {
    let values = [];
    if (this.fromDate !== undefined && this.fromDate !== null) {
      values.push(this.fromDate.toDateString());
    } else {
      values.push(null);
    }

    if (this.toDate !== undefined && this.toDate !== null) {
      values.push(this.toDate.toDateString());
    } else {
      values.push(null);
    }

    this.advancedFilters = this.advancedFilters.filter(x => x.Category !== this.activeFilterCategory);
    this.advancedFilters.push({ Category: this.activeFilterCategory, Values: values });
    this.setDisableApplyFilters();
  }

  setDisableApplyFilters () {
    let toDate = this.toDate !== undefined ? this.toDate.toString() : "";
    let appliedToDate = this.appliedToDate ? this.appliedToDate.toString() : "";
    let fromDate = this.fromDate ? this.fromDate.toString() : "";
    let appliedFromDate = this.appliedFromDate ? this.appliedFromDate.toString() : "";

    if ((this.fileFormats.find(x => x.isChecked) !== undefined || this.docTypes.find(x => x.isChecked) !== undefined ||
    this.subDocTypes.find(x => x.isChecked) !== undefined || toDate !== appliedToDate || fromDate !== appliedFromDate)
    && !this.hasInvalidDateInput || (this.selectedFirms !== undefined && this.selectedFirms.length > 0) || 
    (this.selectedFunds !== undefined && this.selectedFunds.length > 0)  || (this.selectedDeals !== undefined && this.selectedDeals.length > 0)
    || (this.selectedPortfolioComapanies !== undefined && this.selectedPortfolioComapanies.length > 0) ) {
      this.disableApplyFilters = false;
    } else {
      this.disableApplyFilters = true;
    }
  }

  onFromDateClear () {
    this.fromDate = undefined;
    this.fromDateValidationMsg = "";
    if (this.toDateValidationMsg === "") {
      this.hasInvalidDateInput = false;
    }
    this.setDisableApplyFilters();
  }

  onToDateClear () {
    this.toDate = undefined;
    this.toDateValidationMsg = "";
    if (this.fromDateValidationMsg === "") {
      this.hasInvalidDateInput = false;
    }
    this.setDisableApplyFilters();
  }

  getAllFirms() {
    this.firmService.getFirmList({}).subscribe(
      (result) => {
        if (result.body != null) {
          this.firms = result.body.firmList;
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }

  getAllFunds() {
    this.fundService.getFundsList({}).subscribe(
      (result) => {
        if (result.body != null) this.funds = result.body.fundList;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  getAllPortfolioCompanies() {
    this.portfolioCompanyService
      .getPortfolioCompanyList({})
      .subscribe((result) => {
        if (result.body != null)
          this.portfolioComapanies = result.body.portfolioCompanyList;
      });
  }

  getAllDeals() {
    this.dealService.getDealsList({}).subscribe((result) => {
      this.deals = result.body.dealList;
    });
  }

  onFirmChanged(event){
    let values = [];
    event.value.forEach(element => {
      values.push(element.firmID.toString())
    });
    this.handleDropdownChange(values);
  }

  onFundChanged(event){
    let values = [];
    event.value.forEach(element => {
      values.push(element.fundID.toString())
    });
    this.handleDropdownChange(values);
  }

  onCompanyChanged(event){
    let values = [];
    event.value.forEach(element => {
      values.push(element.portfolioCompanyID.toString())
    });
    this.handleDropdownChange(values);
  }

  onDealChanged(event){
    let values = [];
    event.value.forEach(element => {
      values.push(element.dealID.toString())
    });
    this.handleDropdownChange(values);
  }

  handleDropdownChange (values) {
    this.setDisableApplyFilters();
    this.advancedFilters = this.advancedFilters.filter(x => x.Category !== this.activeFilterCategory);
    if (values.length > 0) {
      this.advancedFilters.push({ Category: this.activeFilterCategory, Values: values });
    }
  }
}

