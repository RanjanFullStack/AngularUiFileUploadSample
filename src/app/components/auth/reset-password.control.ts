import { Component, ElementRef, EventEmitter, forwardRef, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from '../../services/account.service';
import { AlertService } from '../../services/alert.service';
import { MiscellaneousService } from '../../services/miscellaneous.service';

@Component({
    selector: 'app-reset-password',
    templateUrl: './reset-password.control.html',
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => ResetPasswordControl),
        multi: true
    }]
})

export class ResetPasswordControl implements OnInit {
    @ViewChild('divResetPassword') resetPasswordContainer: ElementRef;
    model: ResetPasswordModel =
        {
            userId: 0,
            encryptedUserId: "",
            oldPassword:"",
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",            
            emailId: "",
            eventName: ""

        };
        
    loading = false;
    returnUrl: string;
    msgs: string = "";
    msgTimeSpan: number;
    id: any;
    userModel: any;
    pageName: any;
    validateForgotPassword: any;
        Storeorgnailmodel:any;
    @Input() eventName: string = "";
    @Input() isCurrentPasswordValid: boolean = true;
    @Input() isPasswordMatch: boolean = true;
    @Output() onReset = new EventEmitter<any>();

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private accountService: AccountService,
        private alertService: AlertService, private miscService: MiscellaneousService, private _avRoute: ActivatedRoute) {
        if (this._avRoute.snapshot.params["id"]) {
            this.id = this._avRoute.snapshot.params["id"];
        }
    }

    ngOnInit() {

        if (this.id != undefined) {
            this.getUserDetails();
            this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
            this.pageName = this.route.snapshot.queryParams['action'];
            this.msgs = "";
        }
    }


    resetPasswordClone: any;

    get resetPasswordData(): any {
        return this.model;
    }

    @Input()
    set resetPasswordData(data: any) {
        if (data != undefined) {
            this.model = JSON.parse(JSON.stringify(data));
            
        }
    }

    getUserDetails() {
        this.accountService.getUserById({ Value: this.id }).subscribe(result => {
            let resp = result["body"];
            let msgs: any;
            if (resp.length == 1) {
                this.Storeorgnailmodel=resp
                if (resp[0] != null && resp[0] != "") {

                    msgs = this.miscService.showAlertMessages('error', resp[0].message);
                }
            } else {
                this.model = {
                    currentPassword: "",
                    oldPassword:resp.password,
                    newPassword: "",
                    encryptedUserId: resp.encryptedUserID,
                    emailId: resp.emailID,
                    userId: resp.userID,
                    confirmPassword: "",
                    eventName: this.pageName
                   
                };


            }

        }, error => {
            this.accountService.redirectToLogin(error);
        })
    }

    chkcurrentpasswordandnewpassword()
    {
      
    }
    resetPassword() {
       
        
        this.loading = true;        
        if (this.eventName == 'forgotPassword') {
            this.accountService.resetPassword(this.model)
                .subscribe(
                    data => {
                        if (data != null && data.code == "OK") {
                           // this.msgs = data.message;    
                            this.onReset.emit(data);
                           // this.model.displayForgotPasswordDialog = false;
                            this.loading = false;
                        }
                        else {
                            //this.msgs = data.message;
                            this.onReset.emit(data);
                            this.loading = false;
                        }
                    },
                    error => {

                        if (error.statusText == "Unauthorized") {
                            
                            this.onReset.emit(error);
                            //this.msgs = "Something went wrong";
                        }

                        this.loading = false;
                    });
        }
        else {
            this.chkPasswordMatch();
            // this.chkCurrentPassword();
            if (this.isPasswordMatch && this.isCurrentPasswordValid) {
               
                this.accountService.resetPassword(this.model)
                    .subscribe(
                        data => {
                            if (data != null && data.code == "OK") {
                                this.msgs = data.message;
                                this.onReset.emit(data);
                                this.router.navigate([this.returnUrl]);
                            }
                            else {
                                this.msgs = data.message;
                                this.loading = false;
                            }
                        },
                        error => {

                            if (error.statusText == "Unauthorized") {

                                this.msgs = "Something went wrong";
                            }

                            this.loading = false;
                        });
            }
            else {
                this.loading = false;
            }
        }
    }

    chkPasswordMatch() {

        if (this.model.confirmPassword == this.model.newPassword) {
            this.isPasswordMatch = true;
        }
        else {
            this.isPasswordMatch = false;
        }
    }



    chkCurrentPassword() {
        if (this.model.eventName == undefined || this.model.eventName == "createPassword" || this.model.eventName == "setForgotPassword") {
            this.isCurrentPasswordValid = true;
        }
        else {
            if (this.model.currentPassword != this.model.newPassword) {
            // if (this.model.oldPassword == this.model.currentPassword) {
                this.isCurrentPasswordValid = true;
            }
            else {
                this.isCurrentPasswordValid = false;
            }
        }
    }
    
}
interface ResetPasswordModel {
    userId: number;
    oldPassword: string;
    currentPassword: string;
    encryptedUserId:string,
    newPassword: string;
    confirmPassword: string;
    emailId: string;
    eventName: string;
 
}
