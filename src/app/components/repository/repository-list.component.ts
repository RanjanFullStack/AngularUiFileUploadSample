import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";
import { MessageService } from "primeng/components/common/messageservice";
import { AccountService } from "../../services/account.service";
import { DocumentService } from "../../services/document.service";
import { FeaturesEnum } from "../../services/permission.service";

@Component({
  selector: "repository-list",
  templateUrl: "./repository-list.component.html",
  styleUrls: ["./repository-list.component.css"],
  providers: [MessageService],
})
export class RepositoryListComponent implements OnInit {
  feature: typeof FeaturesEnum = FeaturesEnum;
  pipelineList: any = [];
  closeResult: string;
  pagerLength: any;
  dataTable: any;
  blockedTable: boolean = false;
  totalRecords: number;
  globalFilter: string = "";
  paginationFilterClone: any = {};
  searchWord: string;
  displayUploadDocument: boolean = false;
  numbers: string[];
  output: string[];
  loading = false;
  documents = [];
  prevSearch: string;
  searchPhrase = "";
  showDocFilters = false;
  enableAdvancedFilters = false;
  hasAdvancedFilters = false;
  ResetAdvFilters = false;
  documentFilters;
  IsOpenDocument = false;
  documentId = 0;
  
  filteredFileFormats = [];
  filteredDocTypes = [];
  filteredSubDocTypes = [];
  filteredtoDate:Date;
  filteredfromDate:Date;
  filteredFirms: [];
  filteredFunds: [];
  filteredPortfolioComapanies: [];
  filteredDeals: [];
  advancedFilters = [];

  constructor(
    private router: Router,
    protected changeDetectorRef: ChangeDetectorRef,
    private spinner: NgxSpinnerService,
    private documentService: DocumentService,
    private accountService: AccountService,
    private messageService: MessageService,
    private route: ActivatedRoute,
  ) {
  }

  ngOnInit() {
    this.getAllDocuments();
  }

  onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
  }

  search = (event) => {
    this.documentService.Suggest(event.query).subscribe(
      (result) => {
        this.output = JSON.parse(JSON.stringify(result));
        this.output = this.output.filter((c) => c.startsWith(event.query));
        this.loading = false;
      },
      (error) => this.accountService.redirectToLogin(error)
    );
  };

  ResetDocuments = (event) => {
    if (event.target.value.trim().length === 0) {
      this.searchPhrase = event.target.value.trim();
      if(this.documentFilters !== undefined) {
        this.GetDocuments();
      } else{
        this.documentFilters = undefined;
        this.ResetAdvFilters = true;
        this.getAllDocuments();
      }
    }
    if ((event.keyCode === 13) && event.target.value.trim().length > 0) {
      this.OnSearchItemSelected(event);
    }
  };

  ResetSearch() {
    this.searchPhrase = "";
    (document.getElementsByTagName("input")[0] as HTMLInputElement).value = "";
    this.hasAdvancedFilters = false;
    this.ResetAdvFilters = true;
    this.getAllDocuments();
  };

  OnSearchItemSelected = (event) => {
    if (this.prevSearch !== event.target.value.trim()) {
      console.log(event.target.value.trim());
      this.searchPhrase = event.target.value.trim();
      if(this.documentFilters !== undefined) {
        this.GetDocuments();
      } else{
        this.ResetAdvFilters = true;
        this.getAllDocuments(event.target.value.trim());
      }
      
      this.prevSearch = event.target.value.trim();
    }
  };

  openUpload() {
    this.displayUploadDocument = true;
  }

  onCancel(status: any) {
    this.displayUploadDocument = false;
  }

  onSave(status: any) {
    this.documents = [];
    this.displayUploadDocument = false;
    this.searchWord = "";
    this.hasAdvancedFilters = false;
    this.searchPhrase = "";
    this.ResetAdvFilters = true;
    this.documentFilters = undefined;
    this.getAllDocuments();
    this.changeDetectorRef.detectChanges();
    this.messageService.add({
      severity: "success",
      detail: "Document uploaded successfully",
    });
    setTimeout(() => {
      this.messageService.clear();
    }, 2000);
  }

  onDelete(Response) {
    this.displayUploadDocument = false;
    this.searchWord = "";
    this.changeDetectorRef.detectChanges();
    this.messageService.add({
      severity: "success",
      detail: Response,
    });
    setTimeout(() => {
      this.messageService.clear();
    }, 2000);
}

  onDocumentInfoEvent(id: any) {
    this.documentService.RequestDownload(id).subscribe(
      (response) => {
        this.documentService.downloadFile(response);
      },
      (error) => this.accountService.redirectToLogin(error)
    );
  }
  getAllDocuments(term?: string) {
    this.loading = true;
    this.documentService.getAllDocuments(term).subscribe(
      (result) => {
        this.documents = JSON.parse(JSON.stringify(result));
        this.loading = false;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  showFilterElement()  {
    if(this.documents.length > 0 && (this.searchPhrase.length !== 0 || this.hasAdvancedFilters)) {
      return true;
    }
    else {
      return false;
    }
  }

  showNoDocsElement()  {
    if(this.documents.length < 1 && this.searchPhrase.length === 0 && !this.hasAdvancedFilters) {
      (document.getElementById("choosetAction") as HTMLInputElement).style.marginLeft = "761px";
      return true;
    }
    else {
      if(this.documents.length < 1 && this.searchPhrase.length !== 0) {}
      else if(this.documents.length > 0) {
        (document.getElementById("choosetAction") as HTMLInputElement).style.marginLeft = "40px";
        if(this.documents.length > 0 && (this.searchPhrase.length !== 0 || this.hasAdvancedFilters)) {
          (document.getElementById("choosetAction") as HTMLInputElement).style.marginLeft = "32px";
        }
      }
      return false;
    }
  }

  showNoResultWhenSearchedElement()  {
    if(this.documents.length < 1 && (this.searchPhrase.length !== 0 || this.hasAdvancedFilters)) {
      (document.getElementById("choosetAction") as HTMLInputElement).style.marginLeft = "13px";
      (document.getElementById("tableHolder") as HTMLInputElement).style.marginBottom = "-17px";
      return true;
    }
  }

  showNoResultWhenSearchedElement1()  {
    if(this.documents.length < 1 && (this.searchPhrase.length !== 0 || this.hasAdvancedFilters)) {
      return true;
    }
    else {
      return false;
    }
  }

  showLastUpdatedElement()  {
    if((this.searchPhrase.length === 0 && !this.hasAdvancedFilters) && this.documents.length > 0) {
      return true;
    }
    else {
      return false;
    }
  }

  openFiltersPopover () {
    this.showDocFilters = true;
    this.enableAdvancedFilters = true;
  }

  closeFiltersPopover (event:any) {
    this.showDocFilters = false;
    this.enableAdvancedFilters = false;
  }

  GetDocumentsByFilter(Filters) {
    this.ResetAdvFilters = false;
    this.documentFilters = Filters.documentFilters;
    this.filteredFileFormats = Filters.FileFormats;
    this.filteredDocTypes = Filters.docTypes;
    this.filteredSubDocTypes = Filters.subDocTypes;
    this.filteredtoDate = Filters.toDate;
    this.filteredfromDate = Filters.fromDate;
    this.filteredFirms = Filters.firms;
    this.filteredFunds = Filters.funds;
    this.filteredPortfolioComapanies = Filters.portfolioComapanies;
    this.filteredDeals = Filters.deals;
    this.showDocFilters = false;
    this.enableAdvancedFilters = false;
    this.advancedFilters = Filters.documentFilters.advancedFilter;
    this.GetDocuments();
    this.hasAdvancedFilters = true;
  }

  GetDocuments () {
    this.documentFilters.SearchPhrase = this.searchPhrase;
    this.documentService.GetDocumentsByFilter(this.documentFilters).subscribe(
      (result) => {
        this.documents = JSON.parse(JSON.stringify(result));
      },
      (error) => {
        console.log(error)
      }
    );
  }

  openDocument(docId) {
    this.documentId = docId;
    this.showDocFilters = false;
    this.enableAdvancedFilters = false;
    this.IsOpenDocument = true;
  }

  closeDocument() {
    this.IsOpenDocument = false;
    if(this.documentFilters !== undefined ) {
      this.GetDocuments();
    } else if(this.searchPhrase !== "") {
      this.getAllDocuments(this.searchPhrase);
    } else {
      this.getAllDocuments();
    }
  }

  clearAllFilters(){
    this.showDocFilters = false;
    this.enableAdvancedFilters = false;
    this.hasAdvancedFilters = false;
    this.documentFilters = undefined;
    if(this.searchPhrase !== "") {
      this.getAllDocuments(this.searchPhrase);
    } else {
      this.getAllDocuments();
    }
  }

  resetEnableAdvancedFilters () {
    if (!this.showDocFilters) {
      this.enableAdvancedFilters = false;
    }
  }

  onClosePopover () {
    this.showDocFilters = false;
    this.enableAdvancedFilters = false;
  }
}
