import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from '../../services/account.service';
import { AlertService } from '../../services/alert.service';
import { MiscellaneousService } from '../../services/miscellaneous.service';


@Component({
    selector: 'reset-password',
    templateUrl: './reset-password.component.html'

})

export class ResetPasswordComponent implements OnInit {
    model:
        {
            userId: "0",
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
            emailId: "",
            eventName:""
        };
    loading = false;
    returnUrl: string;
    msgs: string = "";
    msgTimeSpan: number;
    id: any;
    userModel: any;   
    isPasswordMatch: boolean = true;
    isCurrentPasswordValid: boolean = true;
    pageName: any;  

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
            this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
            this.pageName = this.route.snapshot.queryParams['action'];
        }
      
    }
   
    onReset(status: any) {
      
        this.msgs = status.message;      
    }


}

