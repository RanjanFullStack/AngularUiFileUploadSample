import { ChangeDetectorRef, Component, EventEmitter, forwardRef, Input, OnInit, Output, ViewChild } from "@angular/core";
import { ControlValueAccessor, NgForm, NG_VALUE_ACCESSOR } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { Message, MessageService } from "primeng/api";
import { AccountService } from "../../services/account.service";
import { MiscellaneousService } from "../../services/miscellaneous.service";
import { PortfolioCompanyService } from "../../services/portfolioCompany.service";


@Component({
    selector: 'savePortfolioProfitability',
    templateUrl: './portfolioCompany-profitability.component.html',
    providers: [MessageService,
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => SavePortfolioProfitabilityComponent),
            multi: true
        }]
})


export class SavePortfolioProfitabilityComponent implements OnInit, ControlValueAccessor {


    @Input() profitabilityList: any = {};
    @Output() onSave = new EventEmitter<any>();
    saveText: string = "Create";
    resetText: string = "Reset";
    id: string;
    msgTimeSpan: number;
    message: Message[] = [];
    @ViewChild('f') userFrm: NgForm;
    loading: boolean = false;
    yearOptions: any = [];
    quarterOptions: any = [{ value: "Q1", text: "Q1" }, { value: "Q2", text: "Q2" }, { value: "Q3", text: "Q3" }, { value: "Q4", text: "Q4" }]
    private _model: any = {};
    modelClone: any = {};

    get model(): any {
        // transform value for display
        return this._model;
    }

    @Input()
    set model(model: any) {
        //debugger;
        this._model = model;
        this.modelClone = JSON.parse(JSON.stringify(this.model));
        if (model.portfolioCompanyProfitabilityID > -1) {
            this.saveText = "Update"
            this.resetText = "Reload";
            this.validateSelectedQuarter();
        }
    }

    constructor(private _avRoute: ActivatedRoute, public activeModal: NgbActiveModal, private miscService: MiscellaneousService, private messageService: MessageService,
        private _portfolioCompanyService: PortfolioCompanyService, private _router: Router, protected changeDetectorRef: ChangeDetectorRef, private accountService: AccountService) {
        if (this._avRoute.snapshot.params["id"]) {
            this.id = this._avRoute.snapshot.params["id"];
        }
        this.msgTimeSpan = this.miscService.getMessageTimeSpan();
        this.yearOptions = this.miscService.bindYearList();
    }

    ngOnInit() { }


    validateSelectedQuarter() {

        if (this.model.quarter != null && this.model.quarter != "" && this.model.year != undefined && this.model.year != null && this.model.year.toString().length == 4) {
            let quarterDate = this.miscService.getQuarterLastDateByQuarter(this.model.quarter, this.model.year);

            let currentQuarter = this.miscService.getQuarterLastDate(new Date());

            if (currentQuarter < quarterDate) {
                this.model.valuationDate = undefined;
                this.miscService.showInlineMessage(this.messageService, 'error', "Selected quarter should not be greater than current quarter.");
                return;
            }

            this.model.valuationDate = quarterDate;
            this.messageService.clear();

        }

    }


    save(form: any) {

        if (this.model.valuationDate == undefined) {
            this.miscService.showInlineMessage(this.messageService, 'error', "Please select valid year and quarter.");
            return;
        }


        var localModel = this.model;
        var matchingRecords = this.profitabilityList.filter(function (element: any, index: any) { return element.quarter == localModel.quarter && element.year == localModel.year && (element.encryptedPortfolioCompanyProfitabilityID != localModel.encryptedPortfolioCompanyProfitabilityID); });
        if (matchingRecords != null && matchingRecords.length > 0) {
            this.miscService.showInlineMessage(this.messageService, 'error', "The year and quarter pair already exist for this portfolio");
            return;
        }
        if (this.model.enterpriseValue != null || this.model.netDebt != null || this.model.revenue != null || this.model.ebitda != null) {
            this.messageService.clear();
            this.loading = true;
            this._portfolioCompanyService.savePortfolioProfitability(this.model)
                .subscribe((data) => {
                    if (data.code == "OK") {
                        this.onSave.emit(data);
                        this.formReset(form);
                    }
                    else {

                        this.miscService.showInlineMessage(this.messageService, 'error', data.message);
                    }
                    this.loading = false;
                }, error => {
                    this.miscService.showInlineMessage(this.messageService, 'error', error);
                    this.loading = false;
                })

        } else {
            this.miscService.showInlineMessage(this.messageService, 'error', "Please enter any value in EBITDA or Net Debt or Revenue or Enterprise Value");
            return;
        }
    }



    formReset(f: any) {
        f.resetForm();
        this.messageService.clear();
        this.changeDetectorRef.detectChanges();
        setTimeout(function (local: any) {
            local.model = JSON.parse(JSON.stringify(local.modelClone));
        }, 0, this)

    }

    writeValue(value: any) {
        if (value !== undefined && value != null) {
            this.model = value;
        }
    }

    propagateChange = (_: any) => { };

    registerOnChange(fn: any) {
        this.propagateChange = fn;
    }

    registerOnTouched() { }

    //Function to calculate Gross Profit
    calculateNetProfit() {
        this.model.revenue = this.model.revenue != null ? this.model.revenue : 0;
        this.model.goodSoldCost = this.model.goodSoldCost != null ? this.model.goodSoldCost : 0;
        this.model.grossProfit = parseFloat(this.model.revenue) - parseFloat(this.model.goodSoldCost);
        //  }
        //Function to calculate EBIT
        // calculateEbit() {
        this.model.grossProfit = this.model.grossProfit != null ? this.model.grossProfit : 0;
        this.model.otherExpenses = this.model.otherExpenses != null ? this.model.otherExpenses : 0;
        this.model.depriciationAndAmortizationExpenses = this.model.depriciationAndAmortizationExpenses != null ? this.model.depriciationAndAmortizationExpenses : 0;
        this.model.generalAndAdministrativeExpenses = this.model.generalAndAdministrativeExpenses != null ? this.model.generalAndAdministrativeExpenses : 0;
        this.model.marketingAndAdvertisingExpenses = this.model.marketingAndAdvertisingExpenses != null ? this.model.marketingAndAdvertisingExpenses : 0;

        let operatingExpenses = parseFloat(this.model.otherExpenses) + parseFloat(this.model.depriciationAndAmortizationExpenses) + parseFloat(this.model.generalAndAdministrativeExpenses) + parseFloat(this.model.marketingAndAdvertisingExpenses);

        this.model.ebit = parseFloat(this.model.grossProfit) - operatingExpenses;

        //  }

        //Function to calculate Profit Before Tax
        //   calculateProfitBeforeTax() {
        this.model.interestExpense = this.model.interestExpense != null ? this.model.interestExpense : 0;
        this.model.ebit = this.model.ebit != null ? this.model.ebit : 0;

        this.model.profitBeforeTax = parseFloat(this.model.ebit) - parseFloat(this.model.interestExpense);
        //  }

        //Function to calculate Net Profit  
        //  calculateNetProfit() {
        this.model.profitBeforeTax = this.model.profitBeforeTax != null ? this.model.profitBeforeTax : 0;
        this.model.incomeTaxExpense = this.model.incomeTaxExpense != null ? this.model.incomeTaxExpense : 0;

        this.model.netProfit = parseFloat(this.model.profitBeforeTax) - parseFloat(this.model.incomeTaxExpense);
    }
}

