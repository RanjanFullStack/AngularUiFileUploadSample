import { Component, OnInit } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { Message } from "primeng/components/common/api";
import { AccountService } from "../../services/account.service";
import { FirmService } from "../../services/firm.service";
import { MiscellaneousService } from "../../services/miscellaneous.service";

@Component({
  selector: "firm-details",
  templateUrl: "./firm-details.component.html",
})
export class FirmDetailsComponent implements OnInit {
  msgs: Message[] = [];
  id: any;
  headquarterLocation: any;
  geographicLocation: any = { isHeadquarter: false };
  model: any = {
    geographicLocations: [],
    firmEmployees: [],
  };
  loading = false;
  constructor(
    private accountService: AccountService,
    private miscService: MiscellaneousService,
    private firmService: FirmService,
    private _avRoute: ActivatedRoute
  ) {
    if (this._avRoute.snapshot.params["id"]) {
      this.id = this._avRoute.snapshot.params["id"];
    }
  }
  sourceURL: any;
  ngOnInit() {
    this.sourceURL = this.miscService.GetPriviousPageUrl();
    if (this.id != undefined) {
      this.loading = true;
      //get user details by user id
      this.firmService.getFirmById({ Value: this.id }).subscribe(
        (result) => {
          let resp = result["body"];

          if (resp != null && result.code == "OK") {
            this.model = resp;
          } else {
            if (resp.code != null && resp.message != "") {
              this.msgs = this.miscService.showAlertMessages(
                "error",
                resp.status.message
              );
            }
          }

          this.loading = false;
          if (this.model.geographicLocations != null) {
            this.headquarterLocation = this.model.geographicLocations.filter(
              function (element: any, index: any) {
                return element.isHeadquarter == true;
              }
            )[0];
            this.model.geographicLocations = this.model.geographicLocations.filter(
              function (element: any, index: any) {
                return element.isHeadquarter == false;
              }
            );
          }
        },
        (error) => {
          this.accountService.redirectToLogin(error);
          this.loading = false;
        }
      );
    }
  }
}
