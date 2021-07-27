import { ChangeDetectorRef, Component, Inject } from '@angular/core';
import { Http } from '@angular/http';
import { Router } from '@angular/router';
import 'datatables.net';
import 'datatables.net-bs4';
import { NgxSpinnerService } from 'ngx-spinner';
import { LazyLoadEvent } from 'primeng/primeng';
import { AccountService } from '../../services/account.service';
import { CashflowService } from '../../services/cashflow.service';
import { MiscellaneousService } from '../../services/miscellaneous.service';
import { FeaturesEnum } from '../../services/permission.service';

@Component({
    selector: 'cashflow-list',
    templateUrl: './cashflow-list.component.html'
})

export class CashflowlListComponent {
    feature: typeof FeaturesEnum = FeaturesEnum;
    public cashflows: any;
    closeResult: string;
    blockedTable: boolean = false;
    totalRecords: number;
    dataTable: any;
    pagerLength: any;
    globalFilter: string = "";
   // casflowUplaodedFiles: any[] = [];
    uploadedFileArray: any=[];
    uploadedFiles: any = {
        cashflowUplaodedFiles: [],
        fundName: ""

    }
    constructor(private miscService: MiscellaneousService, private router: Router, private accountService: AccountService, private _cashflowService: CashflowService, protected changeDetectorRef: ChangeDetectorRef, private spinner: NgxSpinnerService) {
        this.pagerLength = this.miscService.getPagerLength();
    }

    paginationFilterClone: any = {};

    getCashflowFileList(event: any) {
        if (event == null) {
            event = { first: 0, rows: 10, globalFilter: null, sortField: null, sortOrder: 1 };
        }
		event.rows = 1000;
        this.paginationFilterClone = JSON.parse(JSON.stringify(event));
        this.blockedTable = true;
        this._cashflowService.getCashflowFileList({ paginationFilter: event }).subscribe(result => {
            let resp = result["body"]// JSON.parse(result._body);
            if (resp != null && result.code == "OK") {
                this.cashflows = resp.cashFlowList;
                
                var local = this;
                let fundArray: any = [];
                local.uploadedFileArray = [];
                this.cashflows.forEach(function (val: any, key: any) {
                    let cashflowUplaodedFile: any = [];
                    var objFiles: any = {
                        cashflowUplaodedFiles: [],
                        fundName: ""
                    }; 
                   
                    if (local.uploadedFileArray.length < 1) {
                         
                        cashflowUplaodedFile.push(val);
                        objFiles.fundName = val.fund.fundName;
                         objFiles.cashflowUplaodedFiles = cashflowUplaodedFile;
                        local.uploadedFileArray.push(objFiles);
                    }
                    else {
                        local.uploadedFileArray.forEach(function(v:any,k:any){
                            if (val.fund.fundName == v.fundName) {
                                v.cashflowUplaodedFiles.push(val);
                            } 
                        })
                        var isFundExist: any = local.uploadedFileArray.filter(function (f: any, i: any) { return f.fundName == val.fund.fundName });
                        if (isFundExist.length<1) {
                            cashflowUplaodedFile.push(val);
                            objFiles.fundName = val.fund.fundName;
                            objFiles.cashflowUplaodedFiles = cashflowUplaodedFile;
                            local.uploadedFileArray.push(objFiles);
                        }
                    }
                   
                   
                });
                
                this.totalRecords = this.uploadedFileArray.length;
            }
            else {
                this.uploadedFileArray = [];
                this.totalRecords = 0;
            }
            this.blockedTable = false;
        }, error => {
            this.blockedTable = false;
            this.accountService.redirectToLogin(error);

        });
    }

    exportCashflowFile(FileUploadDetails: any) {
        this._cashflowService.downloadCashflowFile(FileUploadDetails).subscribe(response => this.miscService.downloadExcelFile(response));
    }

   

	loadCashflowFileLazy(event: LazyLoadEvent) {
        this.getCashflowFileList(event);
	}

}