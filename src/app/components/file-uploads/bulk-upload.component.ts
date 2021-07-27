import { Component, ViewChild } from "@angular/core";
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
import { Message } from "primeng/components/common/api";
import { MessageService } from "primeng/components/common/messageservice";
import { FileUploadService } from "../../services/file-upload.service";
import { MiscellaneousService } from "../../services/miscellaneous.service";
import { PortfolioCompanyService } from "src/app/services/portfolioCompany.service";

@Component({
  selector: "bulk-upload",
  templateUrl: "./bulk-upload.component.html",
  providers: [MessageService, FileUploadService],
  styleUrls: ["./bulk-upload.component.css"],
})
export class BulkUploadComponent {
  uploadedFiles: any[] = [];
  messages: any[] = [];
  progress: number;
  messageClass: string = "bulkMessage";
  msgTimeSpan: number;
  safeHtml: SafeHtml;
  loading: boolean;

  moduleDetails: any = {};
  masterModel: any = {};
  model: any = {};
  moduleName: string = "";
  @ViewChild("fileUploader") fileUploader: any = {};
  showClickMessage: boolean;
  TemplateFileName: string = "";
  value: number = 0;
  cancel: boolean = false;
  interval: any = 0;
  ProgressCancel: boolean = true;
  showCancelButton: boolean = true;
  FileProgresStatus: string = "Cancel File Progress";
  uploadResultobj: { [k: string]: any } = {};
  msgs: Message[] = [];
  strModuleType: string = "";
  strAPIURL: string = "";

  PorfolioCompanies: any = [];
  PortfolioCompanyId: number;
  CompanyDisabled: boolean = true;
  IsValidCompany: boolean = false;
  constructor(
    private messageService: MessageService,
    private sanitizer: DomSanitizer,
    private miscService: MiscellaneousService,
    private fileUploadService: FileUploadService,
    private portfolioCompanyService: PortfolioCompanyService
  ) {
    this.msgTimeSpan = this.miscService.getMessageTimeSpan();
  }

  ngOnInit() {
    this.getModuleList();
    this.getCompanies();
  }

  private getCompanies() {
    this.portfolioCompanyService.getPortfolioCompanyList({}).subscribe(
      (result) => {
        if (result.body != null)
          this.PorfolioCompanies = result.body.portfolioCompanyList;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  uploadFiles(file: any) {
    this.uploadResultobj = {};
    this.messages = [];
    file.showCancelButton = true;
    this.ProgressCancel = false;
    this.safeHtml = "";
    this.fileUploader;
    if (file.length === 0) {
      this.safeHtml = "Error :- No file selected. Please select a file.";
      this.messageClass = "errorMessage";
      this.ProgressCancel = true;
      return;
    }

    this.interval = setInterval(() => {
      this.value = this.value + Math.floor(Math.random() * 10) + 1;
      if (this.value >= 90) {
        this.value = 90;
      }

      try {
        const formData = new FormData();
        formData.append("MODULENAME", this.moduleName);

        formData.append(file.name, file);
        if (!this.cancel) {
          this.cancel = true;
          this.FileProgresStatus = "File Processing...";
          this.fileUploadService
            .importBulkData(formData, this.strAPIURL)
            .subscribe(
              (results) => {
                var num = 0;
                for (let result of results["body"]) {
                  try {
                    this.uploadResultobj = {};
                    this.value = 100;
                    this.ProgressCancel = true;
                    clearInterval(this.interval);
                    if (
                      result.code != null &&
                      result.code.trim().toLowerCase() == "ok"
                    ) {
                      this.messageClass = "bulkMessage";
                      this.safeHtml = this.sanitizer.bypassSecurityTrustHtml(
                        result.message
                      );
                      this.uploadedFiles.push(file);

                      this.uploadResultobj.messageClass = this.messageClass;
                      this.uploadResultobj.safeHtml = this.safeHtml;
                      this.messages.push(this.uploadResultobj);
                    } else if (
                      result.code != null &&
                      result.code.trim().toLowerCase() == "info"
                    ) {
                      this.messageClass = "infoMessage";
                      this.safeHtml = this.sanitizer.bypassSecurityTrustHtml(
                        result.message
                      );
                      this.uploadResultobj.messageClass = this.messageClass;
                      this.uploadResultobj.safeHtml = this.safeHtml;
                      this.messages.push(this.uploadResultobj);
                    } else {
                      if (result.message != null && result.message != "") {
                        if (num == 0) {
                          result.message =
                            "<b>Errors : -</b>  <i>One or more records in the file has invalid data or sheet(s) may be empty. Please upload the file again after correction.</i > <br/>" +
                            result.message;
                        }
                        num = num + 1;

                        this.messageClass = "errorMessage";
                        this.safeHtml = this.sanitizer.bypassSecurityTrustHtml(
                          result.message
                        );
                        this.uploadResultobj.messageClass = this.messageClass;
                        this.uploadResultobj.safeHtml = this.safeHtml;
                        this.messages.push(this.uploadResultobj);
                      }
                    }
                  } catch (e) {
                    this.messageClass = "errorMessage";
                    this.messageService.add({
                      severity: "error",
                      summary: "Error",
                      detail: "Please check the file",
                    });
                    this.value = 100;
                    this.ProgressCancel = true;
                  }
                }
              },
              (error) => {
                this.miscService.redirectToLogin(error);
                this.ProgressCancel = false;
              }
            );
        }
      } catch (e) {
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: "Please check the file",
        });
        this.messageClass = "errorMessage";
      }
    }, 2000);
  }

  modulesLoading: boolean;
  getModuleList() {
    this.modulesLoading = true;
    let localModel = this.model;
    this.masterModel.moduleList = [
      { moduleId: 1, moduleName: "User" },
      { moduleId: 2, moduleName: "Deal" },
      { moduleId: 3, moduleName: "Firm" },
      { moduleId: 4, moduleName: "Fund" },
      { moduleId: 5, moduleName: "Portfolio Company" },
      { moduleId: 6, moduleName: "Company KPI" },
      { moduleId: 7, moduleName: "Financials" },
      { moduleId: 8, moduleName: "Impact KPI" },
      { moduleId: 9, moduleName: "Investment KPI" },
      { moduleId: 10, moduleName: "Monthly Report" },
      { moduleId: 11, moduleName: "Trading Record" },
    ];
    if (
      this.model.moduleDetails != null &&
      this.model.moduleDetails.moduleId > 0
    ) {
      this.model.moduleDetails = this.masterModel.moduleList.filter(function (
        element: any,
        index: any
      ) {
        return element.moduleId == localModel.moduleDetails.moduleId;
      })[0];
    }
    this.modulesLoading = false;
  }

  getDropdownValue(f: any) {
    this.messages = [];
    this.CompanyDisabled = true;
    this.IsValidCompany=false;
    this.showClickMessage = true;
    this.moduleName = f.moduleName.toString().trim().toLowerCase();

    if (this.moduleName == "user") {
      this.TemplateFileName = "UserList_Import";
      this.strModuleType = "User";
      this.strAPIURL = "api/user/import";
    } else if (this.moduleName == "firm") {
      this.TemplateFileName = "FirmList_Import";
      this.strModuleType = "Firm";
      this.strAPIURL = "api/firm/import";
    } else if (this.moduleName == "deal") {
      this.TemplateFileName = "DealList_Import";
      this.strModuleType = "Deals";
      this.strAPIURL = "api/deals/import";
    } else if (this.moduleName == "fund") {
      this.TemplateFileName = "FundList_Import";
      this.strModuleType = "Fund";
      this.strAPIURL = "api/fund/import";
    } else if (this.moduleName == "portfolio company") {
      this.TemplateFileName = "PortfolioCompany_Import";
      this.strModuleType = "PortFolioCompany";
      this.strAPIURL = "api/portfolio-company/import";
    } else if (this.moduleName == "company kpi") {
      this.TemplateFileName = "CompanyKPI_Import";
      this.strModuleType = "CompanyKPI";
      this.strAPIURL = "api/portfolio-company/import";
      this.CompanyDisabled = false;
    } else if (this.moduleName == "financials") {
      this.TemplateFileName = "Financials_Import";
      this.strModuleType = "Financials";
      this.strAPIURL = "api/portfolio-company/import";
      this.CompanyDisabled = false;
    } else if (this.moduleName == "impact kpi") {
      this.TemplateFileName = "ImpactKPI_Import";
      this.strModuleType = "ImpactKPI";
      this.strAPIURL = "api/portfolio-company/import";
      this.CompanyDisabled = false;
    } else if (this.moduleName == "investment kpi") {
      this.TemplateFileName = "InvestmentKPI_Import";
      this.strModuleType = "InvestmentKPI";
      this.strAPIURL = "api/portfolio-company/import";
      this.CompanyDisabled = false;
    } else if (this.moduleName == "monthly report") {
      this.TemplateFileName = "MonthlyReport_Import";
      this.strModuleType = "MonthlyReport";
      this.strAPIURL = "api/portfolio-company/import";
      this.CompanyDisabled = false;
    } else if (this.moduleName == "trading record") {
      this.TemplateFileName = "TradingRecord_Import";
      this.strModuleType = "TradingRecord";
      this.strAPIURL = "api/portfolio-company/import";
      this.CompanyDisabled = false;
    }

    if (this.fileUploader != undefined) {
      this.fileUploader.files = [];
    }
    this.safeHtml = "";
    this.value = 0;
    clearInterval(this.interval);
    this.ProgressCancel = true;
  }

  CompanySelected() {
    this.IsValidCompany = false;
  }
  onUpload(event: any) {
    console.log(`Company disabled ${this.CompanyDisabled}`);
    console.log(`Portfolio Company Id: ${this.PortfolioCompanyId}`);
    if (!this.CompanyDisabled && this.PortfolioCompanyId == undefined) {
      this.IsValidCompany = true;
    }
    if (!this.IsValidCompany) {
      for (let file of event.files) {
        this.uploadFiles(file);
      }
    }
  }

  onSelect(event: any) {
    if (event.files[0].size > 20000000) {
      this.uploadResultobj.messageClass = "errorMessage";
      this.uploadResultobj.safeHtml = "File size is greater than 20 MB.";
      this.messages.push(this.uploadResultobj);
      this.fileUploader.files = [];
    } else {
      this.ProgressCancel = true;
      this.value = 0;
      this.cancel = false;
      this.FileProgresStatus = "Cancel File Progress";
    }
  }

  onCancel(event: any) {
    this.value = 0;
    this.cancel = true;
    clearInterval(this.interval);
    this.ProgressCancel = true;
  }

  DownloadTemplate() {
    this.fileUploadService
      .exportTemplates({ moduleType: this.strModuleType })
      .subscribe(
        (response) => {
          if (response.ok) {
            this.miscService.downloadExcelFile(response);
          } else {
            this.msgs = this.miscService.showAlertMessages(
              "error",
              "File is not downloaded."
            );
          }
          this.loading = false;
        },
        (error) => {
          this.msgs = this.miscService.showAlertMessages(
            "error",
            "Something went wrong. Please check the query and try again."
          );
          this.loading = false;
        }
      );
  }
}
