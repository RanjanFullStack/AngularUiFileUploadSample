﻿import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  forwardRef,
  Input,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";
import {
  ControlValueAccessor,
  NgForm,
  NG_VALUE_ACCESSOR,
} from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { Message } from "primeng/components/common/api";
import { MessageService } from "primeng/components/common/messageservice";
import { DealService } from "../../services/deal.service";
import { MiscellaneousService } from "../../services/miscellaneous.service";

@Component({
  selector: "savePortfolioFundHolding",
  templateUrl: "./portfolio-fundHolding.component.html",
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SavePortfolioFundHoldingComponent),
      multi: true,
    },
    MessageService,
  ],
})
export class SavePortfolioFundHoldingComponent
  implements OnInit, ControlValueAccessor {
  @Input() fundHoldingList: any = {};
  @Input() masterModel: any = {};
  @Input() dealModel: any = {};
  @Output() onSave = new EventEmitter<any>();
  saveText: string = "Create";
  resetText: string = "Reset";
  id: string;
  msgs: Message[] = [];
  @ViewChild("f") userFrm: NgForm;
  loading: boolean = false;
  yearOptions: any = [];
  quarterOptions: any = [
    { value: "Q1", text: "Q1" },
    { value: "Q2", text: "Q2" },
    { value: "Q3", text: "Q3" },
    { value: "Q4", text: "Q4" },
  ];
  private _model: any = {};
  msgTimeSpan: number;
  modelClone: any = {};
  today: Date;

  get model(): any {
    // transform value for display
    return this._model;
  }

  @Input()
  set model(model: any) {
    this._model = model;

    if (this.model.investementDate != null) {
      this.model.investementDate = new Date(this.model.investementDate);
    }

    if (this.model.valuationDate != null) {
      this.model.valuationDate = new Date(this.model.valuationDate);
    }
    this.modelClone = JSON.parse(JSON.stringify(this.model));
    if (model.portfolioCompanyFundHoldingID > 0) {
      this.saveText = "Update";
      this.resetText = "Reload";
    }
  }

  constructor(
    private _avRoute: ActivatedRoute,
    public activeModal: NgbActiveModal,
    private miscService: MiscellaneousService,
    private messageService: MessageService,
    private _dealService: DealService,
    protected changeDetectorRef: ChangeDetectorRef,
  ) {
    if (this._avRoute.snapshot.params["id"]) {
      this.id = this._avRoute.snapshot.params["id"];
    }
    var year = new Date();
    this.today = year;
    this.msgTimeSpan = this.miscService.getMessageTimeSpan();
    this.yearOptions = this.miscService.bindYearList();
  }

  ngOnInit() {}

  save(form: any) {
    if (this.model.valuationDate == undefined) {
      this.miscService.showInlineMessage(
        this.messageService,
        "error",
        "Please select valid year and quarter later than investment date."
      );
      return;
    }
    var localModel = this.model;
    var matchingRecords = this.fundHoldingList.filter(function (
      element: any,
      index: any
    ) {
      return (
        element.quarter == localModel.quarter &&
        element.year == localModel.year &&
        (localModel.encryptedPortfolioCompanyFundHoldingID == undefined ||
          localModel.encryptedPortfolioCompanyFundHoldingID == null ||
          element.encryptedPortfolioCompanyFundHoldingID !=
            localModel.encryptedPortfolioCompanyFundHoldingID)
      );
    });
    if (matchingRecords != null && matchingRecords.length > 0) {
      this.miscService.showInlineMessage(
        this.messageService,
        "error",
        "The year and quarter pair already exist for this deal"
      );
      return;
    }
    this.messageService.clear();
    this.loading = true;
    this._dealService.savePortfolioCompanyFundHolding(this.model).subscribe(
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
        this.loading = false;
        this.miscService.showInlineMessage(this.messageService, "error", error);
      }
    );
  }

  calculateValuationDate() {
    if (
      this.model.quarter != null &&
      this.model.quarter != "" &&
      this.model.year != undefined &&
      this.model.year != null &&
      this.model.year.toString().length == 4
    ) {
      let quarterDate = this.miscService.getQuarterLastDateByQuarter(
        this.model.quarter,
        this.model.year
      );

      let currentQuarter = this.miscService.getQuarterLastDate(new Date());

      if (currentQuarter < quarterDate) {
        this.model.valuationDate = undefined;
        this.miscService.showInlineMessage(
          this.messageService,
          "error",
          "Valuation date should not be greater than current quarter's last date."
        );
        return;
      }

      if (quarterDate >= new Date(this.dealModel.investmentDate)) {
        this.model.valuationDate = quarterDate;
        this.messageService.clear();
      } else {
        this.model.valuationDate = undefined;
        this.miscService.showInlineMessage(
          this.messageService,
          "error",
          "Valuation date should not be less than investment date."
        );
      }
    }
  }

  onInvestmentCostChange() {
    this.calculateGrossMultiple();
  }

  onRealizedValueChange() {
    this.calculateTotalValue();
  }

  onUnRealizedValueChange() {
    this.calculateTotalValue();
  }

  calculateGrossMultiple() {
    if (
      this.model.totalValue != null &&
      this.model.investmentCost != null &&
      this.model.investmentCost > 0
    ) {
      this.model.grossMultiple =
        this.model.totalValue / this.model.investmentCost;
    }
  }

  calculateTotalValue() {
    if (
      this.hasValueInNumber(this.model.realizedValue) &&
      this.hasValueInNumber(this.model.unrealizedValue)
    ) {
      this.model.totalValue =
        parseFloat(this.model.realizedValue) +
        parseFloat(this.model.unrealizedValue);
      this.calculateGrossMultiple();
    }
  }

  calculateRealizedValue() {
    if (
      this.hasValueInNumber(this.model.totalValue) &&
      this.hasValueInNumber(this.model.unrealizedValue)
    ) {
      this.model.realizedValue =
        this.model.totalValue - this.model.unrealizedValue;
    }
  }

  calculateUnRealizedValue() {
    if (
      this.hasValueInNumber(this.model.totalValue) &&
      this.hasValueInNumber(this.model.realizedValue)
    ) {
      this.model.unrealizedValue =
        this.model.totalValue - this.model.realizedValue;
    }
  }

  hasValueInNumber(val: any) {
    if (val != null && val != undefined && val !== "") {
      return true;
    }
    return false;
  }

  formReset(f: any) {
    f.resetForm();
    this.messageService.clear();
    this.changeDetectorRef.detectChanges();
    setTimeout(
      function (local: any) {
        local.model = JSON.parse(JSON.stringify(local.modelClone));
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
