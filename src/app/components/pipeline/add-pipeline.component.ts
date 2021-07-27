import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Message } from "primeng/components/common/api";
import { MessageService } from "primeng/components/common/messageservice";
import { AccountService } from "../../services/account.service";
import { FirmService } from "../../services/firm.service";
import { FundService } from "../../services/funds.service";
import { MiscellaneousService } from "../../services/miscellaneous.service";
import { PipelineService } from "../../services/pipeline.service";


@Component({
    selector: 'pipeline',
    templateUrl: './add-pipeline.component.html',
    providers: [MessageService]

})
export class AddPipelineComponent implements OnInit {

    title: string = "Create";
    resetText: string = "Reset";
    id: string;
    msgTimeSpan: number;
    msgs: Message[] = [];
    masterModel: any = {};
    model: any = {};
	loading: boolean = false;
	yearRange: string = "";
	today: Date;
    constructor(private pipelineService: PipelineService, private firmService: FirmService, private fundService: FundService, protected changeDetectorRef: ChangeDetectorRef, private _avRoute: ActivatedRoute, private miscService: MiscellaneousService, private accountService: AccountService,
        private _router: Router) {
        if (this._avRoute.snapshot.params["id"]) {
            this.id = this._avRoute.snapshot.params["id"];
            this.loading = true;
            this.title = "Update";
        }
		this.msgTimeSpan = this.miscService.getMessageTimeSpan();
		var year = new Date();
		this.today = year;
		this.yearRange = "2000:" + year.getFullYear();
    }

    sourceURL: any;
    ngOnInit() {
        this.sourceURL = this.miscService.GetPriviousPageUrl();
         this.getPipelineDetails();
        //this.getFundList();
        //this.getStrategyList();
        //this.getStatusList();
        //this.getFirmList();
        this.getMasterData();
    }

    accountTypeLoading: boolean = false;
    getMasterData() {
        this.firmLoading = true;
        this.accountTypeLoading = true;
        this.strategyLoading = true;        
        this.fundsLoading = true;
        this.statusLoading = true;
        
        this.pipelineService.getMasterData().subscribe(result => {

            let resp = result["body"]; 
            if (resp != null) {
                let localModel = this.model;

                this.masterModel.firmList = resp.firmList;
                if (this.model.firmDetail != null && this.model.firmDetail.firmID > 0) {
                    this.model.firmDetail = this.masterModel.firmList.filter(function (element: any, index: any) { return element.firmID == localModel.firmDetail.firmID; })[0];
                }

                this.masterModel.accountTypeList = resp.accountTypeList;
                if (this.model.accountTypeDetails != null && this.model.accountTypeDetails.accountTypeID > 0) {
                    this.model.accountTypeDetails = this.masterModel.accountTypeList.filter(function (element: any, index: any) { return element.accountTypeID == localModel.accountTypeDetails.accountTypeID; })[0];
                }
                //this.masterModel.fundList = resp.fundList;
                //if (this.model.fundDetails != null && this.model.fundDetails.fundID > 0) {
                //    this.model.fundDetails = this.masterModel.fundList.filter(function (element: any, index: any) { return element.fundID == localModel.fundDetails.fundID; })[0];
                //}

                this.masterModel.statusList = resp.pipelineStatusList;
                if (this.model.statusDetail != null && this.model.statusDetail.statusID > 0) {
                    this.model.statusDetail = this.masterModel.statusList.filter(function (element: any, index: any) { return element.statusID == localModel.statusDetail.statusID; })[0];
                }
  
                this.masterModel.strategyList = resp.strategyList;                 
                if (this.model.strategyDetails != null && this.model.strategyDetails.strategyID > 0) {
                    this.model.strategyDetails = this.masterModel.strategyList.filter(function (element: any, index: any) { return element.strategyID == localModel.strategyDetails.strategyID; })[0];
                }

               
            }

            this.firmLoading = false;
            this.accountTypeLoading = false;
            this.strategyLoading = false;
            this.fundsLoading = false;
            this.statusLoading = false;
           
        }, error => {
            this.firmLoading = true;
            this.accountTypeLoading = true;
            this.strategyLoading = true;
            this.fundsLoading = true;
            this.statusLoading = true;          

            this.accountService.redirectToLogin(error);

        });
    }
    getPipelineDetails() {

        if (this.id != undefined) {
            this.loading = true;
            this.title = "Update";
            this.resetText = "Reload";
            //get user details by user id
            this.pipelineService.getPipelineById({ Value: this.id })
                .subscribe(result => {
                    let resp = result["body"];

                    this.model = resp;
                    this.model.closingDate = new Date(this.model.closingDate);
                    this.loading = false;
                }, error => {
                    this.accountService.redirectToLogin(error);
                    this.loading = false;

                });
        }
    }


    addPipeline(form: any) {
        this.loading = true;
        if (this.title == "Create") {
            this.pipelineService.createPipeline(this.model)
                .subscribe(
                    data => {
                        if (data.code == "OK") {
                            this.formReset(form);
                        }
                        this.loading = false;

                        this.msgs = this.miscService.showAlertMessages(data.code == 'OK' ? 'success' : 'error', data.message);
                    },
                    error => {

                        this.msgs = this.miscService.showAlertMessages('error', error.message);
                        this.loading = false;
                    });
        }
        else if (this.title == "Update") {
            this.pipelineService.updatePipeline(this.model)
                .subscribe(
                    data => {
                        this.loading = false;
                        this.msgs = this.miscService.showAlertMessages(data.code == 'OK' ? 'success' : 'error', data.message);

                    },
                    error => {
                        this.msgs = this.miscService.showAlertMessages('error', error.message);
                        this.loading = false;
                    });
        }
    }
    strategyLoading: boolean;
    getStrategyList() {

        this.strategyLoading = true;
        this.miscService.getStrategyList().subscribe(result => {
            let resp = result["body"];
            if (resp != null && result.code == "OK") {
                this.masterModel.strategyList = resp.strategyList;
                let localModel = this.model;
                if (this.model.strategyDetails != null && this.model.strategyDetails.strategyID > 0) {
                    this.model.strategyDetails = this.masterModel.strategyList.filter(function (element: any, index: any) { return element.strategyID == localModel.strategyDetails.strategyID; })[0];
                }
            }
            this.strategyLoading = false;
        }, error => {
            this.strategyLoading = false;
            this.accountService.redirectToLogin(error);

        });
    }

    fundsLoading: boolean;
    getFundListByFirmID() {
        this.fundsLoading = true;
        let firmId = this.model.firmDetails == undefined ? 0 : this.model.firmDetails.firmID;
        this.pipelineService.getFundListByFirmnId(firmId)
            .subscribe((data) => {
                let resp = data["body"];
                
                if (resp != null && data.code == "OK") {
                    this.masterModel.fundList = resp;
                    let localModel = this.model;
                    if (this.model.fundDetails != null && this.model.fundDetails.fundID > 0) {
                        this.model.fundDetails = this.masterModel.fundList.filter(function (element: any, index: any) { return element.fundID == localModel.fundDetails.fundID; })[0];
                    }
                }
                this.fundsLoading = false;
            }, error => { this.fundsLoading = false; this.accountService.redirectToLogin(error); });
        
    }
     

    firmLoading: boolean;
    getFirmList() {
        this.firmLoading = true;
        this.firmService.getFirmList({}).subscribe(result => {
            let resp = result["body"];
            if (resp != null && result.code == "OK") {
                this.masterModel.firmList = resp.firmList;
                let localModel = this.model;
                if (this.model.firmDetails != null && this.model.firmDetails.firmID > 0) {
                    this.model.firmDetails = this.masterModel.firmDetails.filter(function (element: any, index: any) { return element.firmID == localModel.firmDetails.firmID; })[0];
                }
            }
            this.firmLoading = false;
        }, error => {
            this.accountService.redirectToLogin(error);
            this.firmLoading = false;
        })
    }

    statusLoading: boolean;
    getStatusList() {
        this.statusLoading = true;
        this.miscService.getStatusList().subscribe(result => {
            let statusList = result;
            if (statusList != null) {
                this.masterModel.statusList = statusList;
                let localModel = this.model;
                if (this.model.pipelineStatus != null && this.model.pipelineStatus.statusID > 0) {
                    this.model.pipelineStatus = this.masterModel.statusList.filter(function (element: any, index: any) { return element.statusID == localModel.pipelineStatus.statusID; })[0];
                }
            }
            this.statusLoading = false;
        }, error => {
            this.statusLoading = false;
            this.accountService.redirectToLogin(error);

        });
    }

    formReset(f: any) {
        f.resetForm();
        this.changeDetectorRef.detectChanges();

        this.model = {};
        this.getPipelineDetails();
    }

}