import {
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter,
} from "@angular/core";
import { Router } from "@angular/router";
import { MessageService } from "primeng/components/common/messageservice";
import { DealService } from "src/app/services/deal.service";
import { FirmService } from "src/app/services/firm.service";
import { FundService } from "src/app/services/funds.service";
import { PortfolioCompanyService } from "src/app/services/portfolioCompany.service";
import { AccountService } from "../../services/account.service";
import { DocumentService } from "../../services/document.service";
import { FeaturesEnum } from "../../services/permission.service";
import { Document } from "./document.model";

@Component({
  selector: "open-document",
  templateUrl: "./open-document.component.html",
  styleUrls: ["./open-document.component.css"],
  providers: [MessageService],
})
export class OpenDocumentComponent implements OnInit {
  feature: typeof FeaturesEnum = FeaturesEnum;
  pipelineList: any = [];
  closeResult: string;
  pagerLength: any;
  dataTable: any;
  blockedTable: boolean = false;
  totalRecords: number;
  globalFilter: string = "";
  paginationFilterClone: any = {};
  @Input() id = 0;
  selectedDocument: Document = null;
  PreviousFolder: any = null;
  docData: Document = null;
  editMode = false;
  isDocUpdated = false;
  selectedDocumentType = "";
  documentTypes = [];
  documentSubTypes = [];
  selectedSubDocumentType = "";
  hasDocNameUpdated = false;
  hasTypeUpdated = false;
  hasSubTypeUpdated = false;
  hasDocDateUpdated = false;
  hasFolderUpdated = false;
  hasFirmNameUpdated = false;
  hasFundNameUpdated = false;
  hasPortfolioCompanyNameUpdated = false;
  hasDealNameUpdated = false;
  cancelEditing = false;
  ShowValidation: boolean = false;
  primaryButtonName = "Yes";
  secondaryButtonName = "No";
  modalTitle = "Cancel Editing";
  modalBody1 = "All your changes will be lost.";
  modalBody2 = "Are you sure you want to cancel?";
  cancelDeleteDoc = false;
  deleteModalTitle = "Delete Document";
  deleteModalBody1 = "Are you sure want to delete this document?";
  deleteModalBody2 =
    "The deleted documents can be restored from Recycle Bin within next 45 days";
  firms: any[];
  funds: any[];
  porfoliocompanies: any[];
  deals: any[];
  confirmSave = false;
  confirmChangeFolder = false;
  savePrimaryButtonName = "Confirm";
  saveSecondaryButtonName = "Cancel";
  saveModalTitle = "Save Changes";
  saveModalBody1 = "Are you sure you want to update Document Details?";
  saveModalBody2 = "";
  docNameValidation = "";
  folders: string[] = [];
  documentError: DocumentError = new DocumentError();
  @Output() closeDocument = new EventEmitter();
  @Output() deleteDocument = new EventEmitter();
  savedTags: string;
  constructor(
    private router: Router,
    protected changeDetectorRef: ChangeDetectorRef,
    private documentService: DocumentService,
    private accountService: AccountService,
    private messageService: MessageService,
    private firmService: FirmService,
    private fundService: FundService,
    private portfolioCompanyService: PortfolioCompanyService,
    private dealService: DealService
  ) {

  }

  ngOnInit() {
    var local = this;
    this.getDocumentByID(this.id);

    this.getAllDocTypes();

    this.getAllFirms();

    this.getAllFunds();

    this.getAllPortfolioCompanies();

    this.getAllDeals();

    this.documentService.getFolders().subscribe((result) => {
      local.folders = result;
    });
  }

  getSubTypes (doctype) {
    this.documentService
    .getAllDocumentTypes(doctype)
    .subscribe(
      (result) => {
        this.documentSubTypes = JSON.parse(JSON.stringify(result));
      },
      (error) => {
        console.log(error);
      }
    );
  }

  getAllFirms() {
    this.firmService.getFirmList({}).subscribe(
      (result) => {
        if (result.body != null) this.firms = result.body.firmList;
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
          this.porfoliocompanies = result.body.portfolioCompanyList;
      });
  }

  getAllDeals() {
    this.dealService.getDealsList({}).subscribe((result) => {
      this.deals = result.body.dealList;
    });
  }

  getAllDocTypes() {
    this.documentService
      .getAllDocumentTypes(0)
      .subscribe(
        (result) => (this.documentTypes = JSON.parse(JSON.stringify(result)))
      );
  }

  getDocumentByID(id) {
    this.documentService.getDocumentByID(this.id).subscribe(
      (result) => {
        this.selectedDocument = JSON.parse(JSON.stringify(result));
        this.docData = JSON.parse(JSON.stringify(result));
        this.selectedDocument.dateOfDocument =
          this.selectedDocument.dateOfDocument !== null
            ? new Date(this.selectedDocument.dateOfDocument)
            : new Date();
        this.docData.dateOfDocument =
          this.docData.dateOfDocument !== null
            ? new Date(this.docData.dateOfDocument)
            : new Date();
        this.selectedDocumentType = this.selectedDocument.documentTypeName;
        this.PreviousFolder = result.folderName;
        this.selectedSubDocumentType = this.selectedDocument.documentSubTypeName;
        this.selectedDocument.modifiedOn =
          this.selectedDocument.modifiedOn !== null
            ? this.selectedDocument.modifiedOn
            : this.selectedDocument.createdOn;
            this.getSubTypes(this.selectedDocument.documentType);
      },
      (error) => this.accountService.redirectToLogin(error)
    );
  }

  onEditDocument() {
    this.savedTags = this.selectedDocument.tags;
    this.editMode = true;
    this.documentError.Reset();
  }

  hasDocUpdated(event, attribute) {
    if (event === undefined) {
      event = "-";
    } else {
      if(event.target !== undefined) {
        event = event.target.value;
      }
    }

    switch (attribute) {
      case "name": {
        this.docNameValidation = "";
        if (this.docData.name !== event) {
          this.hasDocNameUpdated = true;
        } else {
          this.hasDocNameUpdated = false;
        }
        break;
      }
      case "firmName": {
        let updatedName = event !== "-" ? this.firms.filter((x) => x.firmID === event)[0]
          .firmName : event;
        this.selectedDocument.firmName = updatedName;
        if (this.docData.firmName !== updatedName) {
          this.hasFirmNameUpdated = true;
        } else {
          this.hasFirmNameUpdated = false;
        }
        break;
      }

      case "fundName": {
        let updatedName = event !== "-" ? this.funds.filter((x) => x.fundID === event)[0]
          .fundName : event;
        this.selectedDocument.fundName = updatedName;
        if (this.docData.fundName !== updatedName) {
          this.hasFundNameUpdated = true;
        } else {
          this.hasFundNameUpdated = false;
        }
        break;
      }

      case "portfolioCompanyName": {
        let updatedName = event !== "-" ? this.porfoliocompanies.filter(
          (x) => x.portfolioCompanyID === event
        )[0].companyName : event;
        this.selectedDocument.portfolioCompanyName = updatedName;
        if (this.docData.portfolioCompanyName !== updatedName) {
          this.hasPortfolioCompanyNameUpdated = true;
        } else {
          this.hasPortfolioCompanyNameUpdated = false;
        }
        break;
      }

      case "dealName": {
        let updatedName = event !== "-" ? this.deals.filter((x) => x.dealID === event)[0]
          .dealCustomID : event;
        this.selectedDocument.dealName = updatedName;
        if (this.docData.dealName !== updatedName) {
          this.hasDealNameUpdated = true;
        } else {
          this.hasDealNameUpdated = false;
        }
        break;
      }

      case "dateOfDocument": {
        if (this.docData.dateOfDocument !== event) {
          this.hasDealNameUpdated = true;
        } else {
          this.hasDealNameUpdated = false;
        }
        break;
      }
    }

    if ( this.selectedDocument.folderName === "Final" &&
      JSON.stringify(this.selectedDocument) !== JSON.stringify(this.docData) &&
      this.docNameValidation === "" && (
         this.selectedDocument.documentType !== undefined && this.selectedDocument.documentType !== "" && this.selectedDocument.documentType !== null
      && this.selectedDocument.documentSubType !== undefined && this.selectedDocument.documentSubType !== "" && this.selectedDocument.documentSubType !== null
      && this.selectedDocument.name !== undefined && this.selectedDocument.name !== ""
      && this.selectedDocument.dateOfDocument !== undefined && this.selectedDocument.dateOfDocument !== null
      && (this.selectedDocument.firmName !== undefined && this.selectedDocument.firmName !== "" && this.selectedDocument.firmName !== "-"
          || this.selectedDocument.fundName !== undefined && this.selectedDocument.fundName !== "" && this.selectedDocument.fundName !== "-"
          ||this.selectedDocument.portfolioCompanyName !== undefined && this.selectedDocument.portfolioCompanyName !== "" && this.selectedDocument.portfolioCompanyName !== "-"
          ||this.selectedDocument.dealName !== undefined && this.selectedDocument.dealName !== "" && this.selectedDocument.dealName !== "-"
         )
      )
    ) {
      this.isDocUpdated = true;
    }
    else if(this.selectedDocument.folderName === "Uploaded" && JSON.stringify(this.selectedDocument) !== JSON.stringify(this.docData)){
      this.isDocUpdated = true;
    }
    else {
      this.isDocUpdated = false;
    }

    this.onItemSelected();
  }

  onDocumentTypeChanged() {
    this.selectedDocument.documentSubType = undefined;
    this.selectedDocument.documentSubTypeName = undefined;
    this.selectedSubDocumentType = undefined;
    this.getSubTypes(this.selectedDocumentType);
    this.selectedDocument.documentType = this.selectedDocumentType;
    this.selectedDocument.documentTypeName =
      DocTypesEnum[this.selectedDocumentType];
    this.hasDocUpdated(DocTypesEnum[this.selectedDocumentType], "type");
    if(this.selectedDocument.folderName === "Final")
      this.documentError.Validated(this.selectedDocument);
  }

  onDocumentSubTypeChanged() {
    this.selectedDocument.documentSubTypeName =
      DocSubTypesEnum[this.selectedSubDocumentType];
    this.selectedDocument.documentSubType = this.selectedSubDocumentType;
    this.hasDocUpdated(
      DocSubTypesEnum[this.selectedSubDocumentType],
      "subtype"
    );
    if(this.selectedDocument.folderName === "Final")
      this.documentError.Validated(this.selectedDocument);
  }

  showCancelModal() {
    this.cancelEditing = true;
  }

  onYesDeleteModal() {
    let docList = [];
    docList.push(this.docData);
    this.documentService
      .MoveToRecycleBin(JSON.stringify(docList))
      .subscribe((data) => {
        this.closeDoc();
        this.delDoc(data);
      });

    this.onNoDeleteModal();
  }

  delDoc(response){
    this.deleteDocument.emit(response);
  }

  onNoDeleteModal() {
    this.cancelDeleteDoc = false;
  }

  showCancelDeleteModal() {
    this.cancelDeleteDoc = true;
  }

  closeCancelModal() {
    this.cancelEditing = false;
  }

  onCancelEditing() {
    this.editMode = false;
    this.isDocUpdated = false;
    this.closeCancelModal();
    this.selectedDocument = JSON.parse(JSON.stringify(this.docData));
    this.selectedDocument.dateOfDocument = this.convertToUTC(
      this.docData.dateOfDocument
    );
    this.selectedDocumentType = this.docData.documentTypeName;
    this.selectedSubDocumentType = this.docData.documentSubTypeName;
    this.docNameValidation = "";
  }

  showSuccessToasterMessage(msg) {
    this.messageService.add({
      severity: "success",
      detail: msg,
    });
    setTimeout(() => {
      this.messageService.clear();
    }, 2000);
  }

  onConfirmSave() {
    this.ShowValidation = true;
    this.vaidateDocExists(true);
  }

  onCancelSave() {
    this.confirmSave = false;
  }

  onUpdateDocument() {
    this.confirmSave = false;
    this.selectedDocument.dateOfDocument = this.convertToUTC(
      this.selectedDocument.dateOfDocument
    );
    this.selectedDocument.modifiedOn = this.convertToUTC(new Date());
    this.documentService
      .UpdatelDocument(this.id, this.selectedDocument)
      .subscribe(
        (result) => {
          this.onUpdateDoc(result);
        },
        (error) => {
          this.onUpdateDoc(error);
        }
      );
  }

  onUpdateDoc(result) {
    if (result.status === 422) {
      this.docNameValidation = result.error;
    } else if (result.statusText === "OK") {
      this.docNameValidation = "";
      this.editMode = false;
      this.isDocUpdated = false;
      this.docData = JSON.parse(JSON.stringify(this.selectedDocument));
      this.docData.dateOfDocument = this.convertToUTC(
        this.selectedDocument.dateOfDocument
      );
      this.showSuccessToasterMessage("Document details updated successfully");
    }
  }

  convertToUTC(date) {
    return new Date(
      Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
    );
  }

  vaidateDocExists(confirmSave) {
    if (this.selectedDocument.name === "") {
      let docName = this.docData.name;
      this.selectedDocument.name = docName;
    } else if (this.selectedDocument.name !== this.docData.name) {
      this.documentService.VaidateDocExists(this.selectedDocument).subscribe(
        () => {},
        (error) => {
          if (error.status === 422) {
            this.docNameValidation = error.error;
            this.isDocUpdated = false;
          } else {
            this.docNameValidation = "";
            if (confirmSave) {
              this.confirmSave = true;
            }
          }
        }
      );
    } else if (confirmSave) {
      this.confirmSave = true;
    }
  }

  EnableSaveOnBlur() {
    if (this.selectedDocument.tags !== this.savedTags) {
      this.isDocUpdated = true;
    }
  }

  onFoldersChanged(event: any) {
    this.documentService.getFolders().subscribe((result) => {
      this.folders = result.map((s) => s.name);
    });
  }
  OnFoldersSelected(event: any) {
    this.documentError.Validated(this.selectedDocument);
    if (this.documentError.IsError() && this.selectedDocument.folderName === "Final" && this.PreviousFolder === "Uploaded") {
      this.ShowValidation = true;
    }
    this.confirmChangeFolder = true;
  }

  OnChangeFolderCancelled(event: any) {
    this.confirmChangeFolder = false;
    this.ShowValidation = false;
    this.documentError.Reset();
    this.selectedDocument.folderName = this.PreviousFolder;
  }
  onChangeFolderApproved(event: any) {
    this.confirmChangeFolder = false;
    if (this.selectedDocument.folderName === "Uploaded" && this.PreviousFolder === "Final") {
      this.documentError.ShowOtherError = false;
      this.documentError.ShowSubTypeError = false;
      this.documentError.ShowDocTypeError = false;
    }
    this.ShowValidation = false;
    this.PreviousFolder = this.selectedDocument.folderName;
    this.hasDocUpdated(DocTypesEnum[this.selectedDocumentType], "type");
  }
  DownloadFile() {
    this.documentService.RequestDownload(this.id).subscribe(
      (response) => {
        this.documentService.downloadFile(response);
      },
      (error) => this.accountService.redirectToLogin(error)
    );
  }

  closeDoc() {
    this.closeDocument.emit();
  }
  onItemSelected() {
    if(this.selectedDocument.folderName === "Final")
      this.documentError.Validated(this.selectedDocument);
  }
  OnFolderKeyUp() {
    this.documentService.getFolders().subscribe((result) => {
      this.folders = result.map((s) => s.name);
      if (this.selectedDocument.folderName.length === 0) {
        this.selectedDocument.folderName = this.folders.filter(
          (s) => s === this.PreviousFolder
        )[0];
      }
    });
  }
}

export enum DocTypesEnum {
  "Monitoring" = 1,
  "External" = 2,
  "Quarterly Documents" = 3,
  "Legal Docs (Pre-Invest)" = 4,
}

export enum DocSubTypesEnum {
  "Advsiory Board Material" = 101,
  "Executive Summary" = 201,
  "Presentation" = 301,
  "Reports, Financials and Capital Account" = 302,
  "Non-Disclosure Agreement" = 401,
}
export class DocumentError {
  ShowDocumentNameError: boolean = false;
  ShowDocTypeError: boolean = false;
  ShowSubTypeError: boolean = false;
  showDocumentDateError: boolean = false;
  ShowOtherError: boolean = false;

  public Validated(document: Document) {
    if (document !== undefined) {
      this.Reset();
      if (document.name === null || document.name === undefined)
        this.ShowDocumentNameError = true;
      if (document.documentType === null || document.documentType === undefined)
        this.ShowDocTypeError = true;
      if (
        document.documentSubType === null ||
        document.documentSubType === undefined
      )
        this.ShowSubTypeError = true;
      if (
        document.dateOfDocument === null ||
        document.dateOfDocument === undefined
      )
        this.showDocumentDateError = true;
      if (
        (document.firmId === null || document.firmId === undefined) &&
        (document.fundId === null || document.fundId === undefined) &&
        (document.dealId === null || document.dealId === undefined) &&
        (document.portfolioCompanyId === null ||
          document.portfolioCompanyId === undefined)
      )
        this.ShowOtherError = true;
    }
  }

  public IsError() {
    return (
      this.ShowDocumentNameError ||
      this.ShowDocTypeError ||
      this.ShowSubTypeError ||
      this.showDocumentDateError ||
      this.ShowOtherError
    );
  }
  public Reset() {
    this.ShowDocumentNameError = false;
    this.ShowDocTypeError = false;
    this.ShowSubTypeError = false;
    this.showDocumentDateError = false;
    this.ShowOtherError = false;
  }
}
