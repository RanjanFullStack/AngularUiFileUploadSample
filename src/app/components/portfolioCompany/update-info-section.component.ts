import {
	ChangeDetectorRef,
	Component,
	EventEmitter,
	forwardRef,
	Input,
	OnInit,
	Output
} from "@angular/core";
import {
	ControlValueAccessor,
	NgForm,
	NG_VALUE_ACCESSOR
} from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { ConfirmationService, Message, MessageService } from "primeng/api";
import { AccountService } from "src/app/services/account.service";
import {
	ErrorMessage,
	MiscellaneousService
} from "src/app/services/miscellaneous.service";
import { PortfolioCompanyService } from "src/app/services/portfolioCompany.service";

@Component({
  selector: "update-info-section",
  templateUrl: "./update-info-section.component.html",
  providers: [
    MessageService,
    ConfirmationService,
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => UpdateInfoSectionComponent),
      multi: true,
    },
  ],
})
export class UpdateInfoSectionComponent
  implements OnInit, ControlValueAccessor {
  @Input() sectionName: string;
  @Input() portfolioCompanyCommentaryDetails: any;
  @Input() kpiUpdateModel: any = {};
  @Input() kpiType: string;
  kpiValues: any[] = [];
  @Output() onSave = new EventEmitter<any>();
  saveText: string = "Update";
  resetText: string = "Reset";
  id: string;
  sectionDetails: string;
  msgTimeSpan: number;
  loading: boolean = false;
  selectedYear: any;
  selectedQuarter: any;
  today: Date;
  yearOptions: any = [];
  quarterOptions: any = [
    { value: "Q1", text: "Q1" },
    { value: "Q2", text: "Q2" },
    { value: "Q3", text: "Q3" },
    { value: "Q4", text: "Q4" },
  ];
  monthOptions: any = [
    { value: "1", text: "January" },
    { value: "2", text: "February" },
    { value: "3", text: "March" },
    { value: "4", text: "April" },
    { value: "5", text: "May" },
    { value: "6", text: "June" },
    { value: "7", text: "July" },
    { value: "8", text: "August" },
    { value: "9", text: "September" },
    { value: "10", text: "October" },
    { value: "11", text: "November" },
    { value: "12", text: "December" },
  ];

  quarterNo: any;
  quarterName: any;
  currentYear: any;
  deleteConfirmationMessage: string = ErrorMessage.AreYouSureYouWantToRemoveKpi;
  infoSectionModelClone: any = {};
  kpiValueModel: any = { kpiInfo: "" };
  infoSectionModel: any = {};
 financialKPIListEdit: any[];
  KPIListNew: any[];
  kpiModelClone: any = {};
  message: Message[] = [];

  get model(): any {
    // transform value for display
    return this.portfolioCompanyCommentaryDetails;
  }

  @Input()
  set model(model: any) {
    this.infoSectionModel = JSON.parse(JSON.stringify(model));
    this.infoSectionModelClone = JSON.parse(JSON.stringify(model));
    if (model.portfolioCompanyFinancialKPIMonthID > 0) {
      this.saveText = "Update";
      this.resetText = "Reload";
      //this.validateSelectedQuarter();
    }
  }

  constructor(
    private _avRoute: ActivatedRoute,
    public activeModal: NgbActiveModal,
    private portfolioCompanyService: PortfolioCompanyService,
    private miscService: MiscellaneousService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private _portfolioCompanyService: PortfolioCompanyService,
    protected changeDetectorRef: ChangeDetectorRef,
    private accountService: AccountService
  ) {
    if (this._avRoute.snapshot.params["id"]) {
      this.id = this._avRoute.snapshot.params["id"];
    }
    var year = new Date();
    this.today = year;
    this.msgTimeSpan = this.miscService.getMessageTimeSpan();
    this.yearOptions = this.miscService.bindYearList();
    this.quarterNo = Math.floor(this.miscService.getQuarter(new Date()));
    this.quarterName = "Q" + this.quarterNo;
    this.currentYear = new Date().getFullYear();
  }

  ngOnInit() {
    if (this.sectionName == "Significant Events") {
      this.sectionDetails =
        this.portfolioCompanyCommentaryDetails.significantEventsSectionData !=
        null
          ? this.portfolioCompanyCommentaryDetails.significantEventsSectionData
              .item4
          : "";
      this.selectedQuarter =
        this.portfolioCompanyCommentaryDetails != null &&
        this.portfolioCompanyCommentaryDetails.significantEventsSectionData !=
          null
          ? this.portfolioCompanyCommentaryDetails.significantEventsSectionData
              .item3 == null
            ? this.quarterName
            : this.portfolioCompanyCommentaryDetails
                .significantEventsSectionData.item3
          : this.quarterName;
      this.selectedYear =
        this.portfolioCompanyCommentaryDetails != null &&
        this.portfolioCompanyCommentaryDetails.significantEventsSectionData !=
          null
          ? this.portfolioCompanyCommentaryDetails.significantEventsSectionData
              .item2 == null
            ? this.currentYear
            : this.portfolioCompanyCommentaryDetails
                .significantEventsSectionData.item2
          : this.currentYear;
    } else if (this.sectionName == "Assessment") {
      this.sectionDetails =
        this.portfolioCompanyCommentaryDetails.assessmentSectionData != null
          ? this.portfolioCompanyCommentaryDetails.assessmentSectionData.item4
          : "";
      this.selectedQuarter =
        this.portfolioCompanyCommentaryDetails != null &&
        this.portfolioCompanyCommentaryDetails.assessmentSectionData != null
          ? this.portfolioCompanyCommentaryDetails.assessmentSectionData
              .item3 == null
            ? this.quarterName
            : this.portfolioCompanyCommentaryDetails.assessmentSectionData.item3
          : this.quarterName;
      this.selectedYear =
        this.portfolioCompanyCommentaryDetails != null &&
        this.portfolioCompanyCommentaryDetails.assessmentSectionData != null
          ? this.portfolioCompanyCommentaryDetails.assessmentSectionData
              .item2 == null
            ? this.currentYear
            : this.portfolioCompanyCommentaryDetails.assessmentSectionData.item2
          : this.currentYear;
    } else if (this.sectionName == "Exit Plans") {
      this.sectionDetails =
        this.portfolioCompanyCommentaryDetails.exitPlansSectionData != null
          ? this.portfolioCompanyCommentaryDetails.exitPlansSectionData.item4
          : "";
      this.selectedQuarter =
        this.portfolioCompanyCommentaryDetails != null &&
        this.portfolioCompanyCommentaryDetails.exitPlansSectionData != null
          ? this.portfolioCompanyCommentaryDetails.exitPlansSectionData.item3 ==
            null
            ? this.quarterName
            : this.portfolioCompanyCommentaryDetails.exitPlansSectionData.item3
          : this.quarterName;
      this.selectedYear =
        this.portfolioCompanyCommentaryDetails != null &&
        this.portfolioCompanyCommentaryDetails.exitPlansSectionData != null
          ? this.portfolioCompanyCommentaryDetails.exitPlansSectionData.item2 ==
            null
            ? this.currentYear
            : this.portfolioCompanyCommentaryDetails.exitPlansSectionData.item2
          : this.currentYear;
    } else if (this.sectionName == "Impact Highlights") {
      this.sectionDetails =
        this.portfolioCompanyCommentaryDetails.impactSectionData != null
          ? this.portfolioCompanyCommentaryDetails.impactSectionData.item4
          : "";
      this.selectedQuarter =
        this.portfolioCompanyCommentaryDetails != null &&
        this.portfolioCompanyCommentaryDetails.impactSectionData != null
          ? this.portfolioCompanyCommentaryDetails.impactSectionData.item3 ==
            null
            ? this.quarterName
            : this.portfolioCompanyCommentaryDetails.impactSectionData.item3
          : this.quarterName;
      this.selectedYear =
        this.portfolioCompanyCommentaryDetails != null &&
        this.portfolioCompanyCommentaryDetails.impactSectionData != null
          ? this.portfolioCompanyCommentaryDetails.impactSectionData.item2 ==
            null
            ? this.currentYear
            : this.portfolioCompanyCommentaryDetails.impactSectionData.item2
          : this.currentYear;
    } else if (this.sectionName == "Footnote Investment KPI") {
      this.sectionDetails =
        this.portfolioCompanyCommentaryDetails
          .footNoteInvestmentKPISectionData != null
          ? this.portfolioCompanyCommentaryDetails
              .footNoteInvestmentKPISectionData.item4
          : "";
      this.selectedQuarter =
        this.portfolioCompanyCommentaryDetails != null &&
        this.portfolioCompanyCommentaryDetails
          .footNoteInvestmentKPISectionData != null
          ? this.portfolioCompanyCommentaryDetails
              .footNoteInvestmentKPISectionData.item3 == null
            ? this.quarterName
            : this.portfolioCompanyCommentaryDetails
                .footNoteInvestmentKPISectionData.item3
          : this.quarterName;
      this.selectedYear =
        this.portfolioCompanyCommentaryDetails != null &&
        this.portfolioCompanyCommentaryDetails
          .footNoteInvestmentKPISectionData != null
          ? this.portfolioCompanyCommentaryDetails
              .footNoteInvestmentKPISectionData.item2 == null
            ? this.currentYear
            : this.portfolioCompanyCommentaryDetails
                .footNoteInvestmentKPISectionData.item2
          : this.currentYear;
    } else if (this.sectionName == "Footnote Trading Record") {
      this.sectionDetails =
        this.portfolioCompanyCommentaryDetails
          .footNoteTradingRecordSectionData != null
          ? this.portfolioCompanyCommentaryDetails
              .footNoteTradingRecordSectionData.item4
          : "";
      this.selectedQuarter =
        this.portfolioCompanyCommentaryDetails != null &&
        this.portfolioCompanyCommentaryDetails
          .footNoteTradingRecordSectionData != null
          ? this.portfolioCompanyCommentaryDetails
              .footNoteTradingRecordSectionData.item3 == null
            ? this.quarterName
            : this.portfolioCompanyCommentaryDetails
                .footNoteTradingRecordSectionData.item3
          : this.quarterName;
      this.selectedYear =
        this.portfolioCompanyCommentaryDetails != null &&
        this.portfolioCompanyCommentaryDetails
          .footNoteTradingRecordSectionData != null
          ? this.portfolioCompanyCommentaryDetails
              .footNoteTradingRecordSectionData.item2 == null
            ? this.currentYear
            : this.portfolioCompanyCommentaryDetails
                .footNoteTradingRecordSectionData.item2
          : this.currentYear;
    } else this.sectionDetails = "";
    this.id = this.infoSectionModel.encryptedPortfolioCompanyId;
  }

save(form: any) {
    if (this.selectedQuarter == undefined || this.selectedYear == undefined) {
      this.miscService.showInlineMessage(
        this.messageService,
        "error",
        ErrorMessage.SelectValidYearAndQtr
      );
      return;
    }
    this.model.portfolioCompanyId = this.infoSectionModel.portfolioCompanyID.toString();
    this.model.year = this.selectedYear;
    this.model.quarter = this.selectedQuarter;

    if (this.sectionName == "Significant Events") {
      this.model.significantEventsSection = this.sectionDetails;
      if (this.model.significantEventsSectionData != undefined)
        this.model.encryptedCommentaryID = this.model.significantEventsSectionData.item1;
      this.model.sectionName = "SignificantEventsSection";
    } else if (this.sectionName == "Assessment") {
      this.model.assessmentSection = this.sectionDetails;
      if (this.model.assessmentSectionData != undefined)
        this.model.encryptedCommentaryID = this.model.assessmentSectionData.item1;
      this.model.sectionName = "AssessmentSection";
    } else if (this.sectionName == "Exit Plans") {
      this.model.exitPlansSection = this.sectionDetails;
      if (this.model.exitPlansSectionData != undefined)
        this.model.encryptedCommentaryID = this.model.exitPlansSectionData.item1;
      this.model.sectionName = "ExitPlansSection";
    } else if (this.sectionName == "Impact Highlights") {
      this.model.impactSection = this.sectionDetails;
      if (this.model.impactSectionData != undefined)
        this.model.encryptedCommentaryID = this.model.impactSectionData.item1;
      this.model.sectionName = "ImpactSection";
    }
    delete this.model.significantEventsSectionData;
    delete this.model.impactSectionData;
    delete this.model.assessmentSectionData;
    delete this.model.exitPlansSectionData;
    delete this.model.footNoteInvestmentKPISectionData;
    delete this.model.footNoteTradingRecordSectionData;
    this.messageService.clear();
    this.loading = true;
    this._portfolioCompanyService
      .saveCompanyCommentaryDetails(this.model)
      .subscribe(
        (data) => {
          if (data.code == "OK") {
            this.onSave.emit(data);
            this.formReset(form);
          } else {
            this.miscService.showInlineMessage(
              this.messageService,
              "error",
              data.message
            );
          }
          this.loading = false;
        },
        (error) => {
          this.miscService.showInlineMessage(
            this.messageService,
            "error",
            ErrorMessage.SomethingWentWrong
          );
          this.loading = false;
        }
      );
  }

  delete(form: NgForm) {}

  getPortfolioCompanyCommentarySections(
    companyId: any = undefined,
    quarterName: any = this.quarterName,
    year: any = this.currentYear
  ) {
    companyId = companyId == undefined ? this.id : companyId;
    this.portfolioCompanyService
      .getPortfolioCompanyCommentarySections({
        encryptedPortfolioCompanyId: companyId.toString(),
        quarter: quarterName,
        year: year,
      })
      .subscribe(
        (result) => {
          let resp = result;
          if (resp != null && resp.code == "OK") {
            this.portfolioCompanyCommentaryDetails = resp.body;
            if (this.sectionName == "Significant Events") {
              this.sectionDetails = this.portfolioCompanyCommentaryDetails.significantEventsSection;
            } else if (this.sectionName == "Assessment") {
              this.sectionDetails = this.portfolioCompanyCommentaryDetails.assessmentSection;
            } else if (this.sectionName == "Exit Plans") {
              this.sectionDetails = this.portfolioCompanyCommentaryDetails.exitPlansSection;
            } else if (this.sectionName == "Impact Highlights") {
              this.sectionDetails = this.portfolioCompanyCommentaryDetails.impactSection;
            } else if (this.sectionName == "Footnote Investment KPI") {
              this.sectionDetails = this.portfolioCompanyCommentaryDetails.footNoteInvestmentKPISection;
            } else if (this.sectionName == "Footnote Trading Record") {
              this.sectionDetails = this.portfolioCompanyCommentaryDetails.footNoteTradingRecordSection;
            } else this.sectionDetails = "";
            // this.significantEventsSection=  this.portfolioCompanyCommentaryDetails.significantEventsSection;
            // this.exitPlansSection=  this.portfolioCompanyCommentaryDetails.exitPlansSection;
            // this.assessmentSection=  this.portfolioCompanyCommentaryDetails.assessmentSection;
            // this.impactSection=  this.portfolioCompanyCommentaryDetails.impactSection;
          } else {
            this.portfolioCompanyCommentaryDetails = null;
          }
        },
        (error) => {
          this.accountService.redirectToLogin(error);
        }
      );
  }

  formReset(f: any) {
    f.reset();
    this.messageService.clear();
    setTimeout(
      function (local: any) {
        local.kpiModel = JSON.parse(JSON.stringify(local.kpiModelClone));
      },
      0,
      this
    );
  }

  writeValue(value: any) {
    if (value !== undefined && value != null) {
      this.model = value;
    }
  }

  propagateChange = (_: any) => {};

  registerOnChange(fn: any) {
    this.propagateChange = fn;
  }

  registerOnTouched() {}
}
