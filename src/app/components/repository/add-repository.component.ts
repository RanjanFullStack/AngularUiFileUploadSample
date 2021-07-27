import {
  Component,
  ElementRef,
  EventEmitter,
  Output,
  ViewChild,
  OnInit,
  TemplateRef,
} from "@angular/core";
import { DocumentService } from "./../../services/document.service";
import { FirmService } from "src/app/services/firm.service";
import { FundService } from "src/app/services/funds.service";
import { PortfolioCompanyService } from "src/app/services/portfolioCompany.service";
import { DealService } from "src/app/services/deal.service";
import { ToastContainerDirective, ToastrService } from "ngx-toastr";
import { HttpClient, HttpEventType } from "@angular/common/http";

import { map, catchError } from "rxjs/operators";
import { throwError } from "rxjs";
import { Inject } from "@angular/core";
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";

@Component({
  selector: "add-repository",
  templateUrl: "./add-repository.component.html",
  styleUrls: ["./add-repository.component.scss"],
})
export class AddRepositoryComponent implements OnInit {
  modalRef: BsModalRef;
  config = {
    backdrop: false,
    ignoreBackdropClick: true,
    animated: false,
  };
  @ViewChild(ToastContainerDirective, {})
  toastContainer: ToastContainerDirective;
  @Output() onSave = new EventEmitter<any>();
  @Output() onCancel = new EventEmitter<any>();

  newDocument: Document = new Document();
  documentTypes: any[];
  documentSubTypes: any[];
  firms: any[];
  funds: any[];
  porfoliocompanies: any[];
  deals: any[];
  maxDateValue: Date;
  docSavedStatus = "";
  progress: number;
  myAppUrl: string = "";
  encodedFileNames = [];
  validationError : "";

  constructor(
    private documentService: DocumentService,
    private firmService: FirmService,
    private fundService: FundService,
    private portfolioCompanyService: PortfolioCompanyService,
    private dealService: DealService,
    private toastrService: ToastrService,
    private http: HttpClient,
    private modalService: BsModalService,
    @Inject("BASE_URL") baseUrl: string
  ) {
    this.myAppUrl = baseUrl;
  }

  //https://www.freakyjolly.com/angular-allow-only-numbers-or-alphanumeric-in-input-restrict-other-characters-using-keypress-event/#.X6ugEC8RrRY
  keyPressAlphaNumeric(event) {
    var inp = String.fromCharCode(event.keyCode);
    if (/[a-zA-Z0-9]/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }

  ngOnInit() {
    this.maxDateValue = new Date();
    this.toastrService.overlayContainer = this.toastContainer;
    this.documentService.getAllDocumentTypes(0).subscribe(
      (result) => {
        this.documentTypes = JSON.parse(JSON.stringify(result));
      },
      (error) => {
        console.log(error);
      }
    );
    this.firmService.getFirmList({}).subscribe(
      (result) => {
        if (result.body != null) this.firms = result.body.firmList;
      },
      (error) => {
        console.log(error);
      }
    );
    this.fundService.getFundsList({}).subscribe(
      (result) => {
        if (result.body != null) this.funds = result.body.fundList;
      },
      (error) => {
        console.log(error);
      }
    );
    this.portfolioCompanyService.getPortfolioCompanyList({}).subscribe(
      (result) => {
        if (result.body != null)
          this.porfoliocompanies = result.body.portfolioCompanyList;
      },
      (error) => {
        console.log(error);
      }
    );

    this.dealService.getDealsList({}).subscribe((result) => {
      this.deals = result.body.dealList;
    });
  }

  openModal(template: TemplateRef<any>) {
    if (this.files.length === 0 && this.IsModalEmpty()) {
      this.onCancel.emit();
      this.Reset();
    } else {
      this.modalRef = this.modalService.show(template, this.config);
    }
  }

  upload(file) {
    this.progress = 1;
    const formData = new FormData();
    formData.append("file", file);

    this.http
      .post(this.myAppUrl + "api/file", formData, {
        reportProgress: true,
        observe: "events",
        responseType: "text",
      })
      .pipe(
        map((event: any) => {
          if (event.type == HttpEventType.UploadProgress) {
            this.progress = Math.round((100 / event.total) * event.loaded);
            this.files[0].progress = this.progress;
          } else if (event.type == HttpEventType.Response) {
            this.encodedFileNames.push(JSON.parse(event.body).name);
            this.progress = null;
            this.showSuccess();
            (document.getElementById(
              "fileUploadProgressBar"
            ) as HTMLInputElement).style.display = "none";
            (document.getElementById(
              "uploadSave"
            ) as HTMLInputElement).disabled = false;
            (document.getElementById(
              "uploadedCount"
            ) as HTMLInputElement).innerText = `Uploaded (${this.files.length})`;
            this.newDocument.Name = file.name.substr(0, file.name.lastIndexOf("."));
            (document.getElementById("documentname") as HTMLInputElement).value = file.name.substr(0, file.name.lastIndexOf("."));
            this.newDocument.Extension = "." + file.name.split('.').pop();
          }
        }),
        catchError((err: any) => {
          this.progress = null;
          console.log(err.message);
          return throwError(err.message);
        })
      )
      .toPromise();
  }

  Save() {
    this.newDocument.Path = this.encodedFileNames[0];

    this.documentService.AddDocument(this.newDocument).subscribe(
      (result1) => {
        this.docSavedStatus = result1.statusText;
        this.onSave.emit();
        this.Reset();
      },
      (error) => {
        if(error.status === 422) {
          this.validationError = error.error;
          (document.getElementById("docName") as HTMLInputElement).classList.add("applyRedColor");
          (document.getElementById("documentname") as HTMLInputElement).classList.add("applyRedBorderBottom");
          (document.getElementById("docTypeDiv") as HTMLInputElement).classList.add("applyTopMargin");
        }
        else {
          this.docSavedStatus = error.statusText;
          this.onSave.emit();
          this.Reset();
        }
      }
    );
  }

  VaidateDocExists() {
    this.documentService.VaidateDocExists(this.newDocument).subscribe(
      () => {
      },
      (error) => {
        if(error.status === 422) {
          this.validationError = error.error;
          (document.getElementById("docName") as HTMLInputElement).classList.add("applyRedColor");
          (document.getElementById("documentname") as HTMLInputElement).classList.add("applyRedBorderBottom");
          (document.getElementById("docTypeDiv") as HTMLInputElement).classList.add("applyTopMargin");
        }
        else {
          this.validationError = "";
          (document.getElementById("docName") as HTMLInputElement).classList.remove("applyRedColor");
          (document.getElementById("documentname") as HTMLInputElement).classList.remove("applyRedBorderBottom");
          (document.getElementById("docTypeDiv") as HTMLInputElement).classList.remove("applyTopMargin");
        }
      }
    );
  }

  YesOnCancel() {
    this.modalRef.hide();
    this.onCancel.emit();

    this.documentService.DeleteFiles(this.encodedFileNames).subscribe(
      (result) => {},
      (error) => {
        console.log(error.statusText);
      }
    );
    this.Reset();
  }

  YesOnCancelWhenDeleted() {
    this.modalRef.hide();
    this.files.splice(0, 1);
    if (this.files.length <= 0) {

      this.documentService.DeleteFiles(this.encodedFileNames).subscribe(
        (result) => {},
        (error) => {
          console.log(error.statusText);
        }
      );
    } else {
      (document.getElementById("uploadedCount") as HTMLInputElement).innerText = `Uploaded (${this.files.length})`;
    }
    this.ClearValidation();
  }

  NoOnCancel() {
    this.modalRef.hide();
  }

  private Reset() {
    this.newDocument = new Document();
    this.ClearValidation();
  }

  private ClearValidation() {
    this.newDocument.Name = "";
    this.files = [];
    this.encodedFileNames = [];
    this.validationError = "";
    (document.getElementById("uploadedCount") as HTMLInputElement).innerText = "";
    (document.getElementById("uploadSave") as HTMLInputElement).disabled = true;
    (document.getElementById("docName") as HTMLInputElement).classList.remove("applyRedColor");
    (document.getElementById("documentname") as HTMLInputElement).classList.remove("applyRedBorderBottom");
    (document.getElementById("docTypeDiv") as HTMLInputElement).classList.remove("applyTopMargin");
    (document.getElementById("documentname") as HTMLInputElement).value = "";
  }

  private IsModalEmpty() {
    console.log(this.newDocument);
    if (
      (this.newDocument.Name !== undefined && this.newDocument.Name !== "") ||
      this.newDocument.DocumentType !== undefined ||
      this.newDocument.DateOfDocument !== undefined ||
      this.newDocument.DealId !== undefined ||
      this.newDocument.DocumentSubType !== undefined ||
      this.newDocument.FirmId !== undefined ||
      this.newDocument.FundId !== undefined ||
      this.newDocument.PortfolioCompanyId !== undefined ||
      this.newDocument.Tags !== undefined && this.newDocument.Tags !== ""
    ) {
      return false;
    } else {
      return true;
    }
  }

  onDocumentTypeChanged() {
    this.newDocument.DocumentSubType = undefined;
    this.documentService
      .getAllDocumentTypes(this.newDocument.DocumentType)
      .subscribe(
        (result) => {
          this.documentSubTypes = JSON.parse(JSON.stringify(result));
        },
        (error) => {
          console.log(error);
        }
      );
  }

  @ViewChild("fileDropRef") fileDropEl: ElementRef;
  files: any[] = [];

  /**
   * on file drop handler
   */
  onFileDropped($event) {
    this.prepareFilesList($event);
  }

  /**
   * handle file from browsing
   */
  fileBrowseHandler(files) {
    this.prepareFilesList(files);
  }

  showSuccess() {
    this.toastrService.success("Document uploaded successfully");
  }

  /**
   * Convert Files list to normal array list
   * @param files (Files List)
   */
  prepareFilesList(files: Array<any>) {
    for (let item of files) {
      if (item.name.includes(".exe")) return;
      item.progress = 0;
      this.upload(item);
      this.files.push(item);
    }
    this.fileDropEl.nativeElement.value = "";
  }

  /**
   * format bytes
   * @param bytes (File size in bytes)
   * @param decimals (Decimals point)
   */
  formatBytes(bytes, decimals = 2) {
    if (bytes === 0) {
      return "0 Bytes";
    }
    const k = 1024;
    const dm = decimals <= 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  }

  documentNameOnBlur() {
    if(this.newDocument.Name === "") {
      this.newDocument.Name = this.files[0].name.substr(0, this.files[0].name.lastIndexOf("."));
    }
    this.VaidateDocExists();
  }
}

class Document {
  Name: string;
  DateOfDocument: Date;
  DocumentType: number;
  DocumentSubType: number;
  DealId: number;
  FirmId: number;
  FundId: number;
  Path: string;
  PortfolioCompanyId: number;
  Tags:string;
  Extension:string;
}
