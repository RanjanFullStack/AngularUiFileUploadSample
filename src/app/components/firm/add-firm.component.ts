import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, NgForm } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { Message } from "primeng/components/common/api";
import { MessageService } from "primeng/components/common/messageservice";
import { ConfirmationService } from "primeng/primeng";
import { AccountService } from "../../services/account.service";
import { FirmService } from "../../services/firm.service";
import { MiscellaneousService } from "../../services/miscellaneous.service";

@Component({
  selector: "add-firm",
  templateUrl: "./add-firm.component.html",
  providers: [MessageService, ConfirmationService],
})
export class AddFirmComponent implements OnInit {
  firmForm: FormGroup;
  countryList: any[];
  cityList: any[];
  stateList: any[];
  deleteConfirmationMessage: string =
    "Are you sure that you want to delete this record?";
  id: any;
  title: string = "Create";
  resetText: string = "Reset";
  firmStatus: boolean = true;
  masterModel: any;
  masterModelClone: any;
  msgTimeSpan: number;
  firmEmployee: any = {};
  geographicLocation: any = { isHeadquarter: false };
  model: any = {
    geographicLocations: [],
    firmEmployees: [],
  };
  msgs: Message[] = [];
  designationList: any[];
  loading = false;
  sourceURL: any;
  constructor(
    private confirmationService: ConfirmationService,
    private accountService: AccountService,
    private firmService: FirmService,
    private _avRoute: ActivatedRoute,
    protected changeDetectorRef: ChangeDetectorRef,
    private miscService: MiscellaneousService
  ) {
    if (this._avRoute.snapshot.params["id"]) {
      this.id = this._avRoute.snapshot.params["id"];
    }
    this.firmService.getMasterFirmModel().subscribe(
      (result) => {
        this.masterModel = result["body"];
        this.masterModelClone = JSON.parse(JSON.stringify(result));
      },
      (error) => this.accountService.redirectToLogin(error)
    );
    this.msgTimeSpan = this.miscService.getMessageTimeSpan();
  }

  ngOnInit() {
    this.sourceURL = this.miscService.GetPriviousPageUrl();

    if (this.id != undefined) {
      this.loading = true;
      this.title = "Update";
      this.resetText = "Reload";
    } else {
      this.loading = false;
    }

    this.miscService.getDesignationList().subscribe(
      (result) => {
        this.designationList = result["body"];
        this.setDefaultValues();
      },
      (error) => {
        this.accountService.redirectToLogin(error);
      }
    );
  }

  setDefaultValues() {
    if (this.id != undefined) {
      this.loading = true;
      //get user details by user id
      this.firmService.getFirmById({ Value: this.id }).subscribe(
        (result) => {
          let resp = result["body"];

          if (resp != null && result.code == "OK") {
            this.model = resp;

            if (this.model.geographicLocations != null) {
              this.model.geographicLocations.forEach(function (value: any) {
                value.uniquelocationID = value.locationID;
              });
            }
          } else {
            if (resp.status != null && resp.status.message != "") {
              this.msgs = this.miscService.showAlertMessages(
                "error",
                resp.status.message
              );
            }
          }

          this.loading = false;
        },
        (error) => {
          this.accountService.redirectToLogin(error);
          this.loading = false;
        }
      );
    }
  }

  addGeographicLocation(form: any) {
    if (form.valid) {
      if (this.geographicLocation.country != undefined) {
        let isHeadquarterExist = this.model.geographicLocations.filter(
          function (ele: any) {
            return ele.isHeadquarter == true;
          }
        );
        let local = this;
        let isLocationExist = this.model.geographicLocations.filter(function (
          ele: any
        ) {
          let res = false;
          if (ele.city && local.geographicLocation.city) {
            res = ele.city.cityId == local.geographicLocation.city.cityId;
          } else if (ele.city == local.geographicLocation.city) {
            if (ele.state && local.geographicLocation.state) {
              res = ele.state.stateId == local.geographicLocation.state.stateId;
            } else if (ele.state == local.geographicLocation.state) {
              if (ele.country && local.geographicLocation.country) {
                res =
                  ele.country.countryId ==
                  local.geographicLocation.country.countryId;
              } else if (ele.country == local.geographicLocation.country) {
                if (ele.region && local.geographicLocation.region) {
                  res =
                    ele.region.regionId ==
                    local.geographicLocation.region.regionId;
                } else {
                  res = ele.region == local.geographicLocation.region;
                }
              }
            }
          }

          return res;
        });
        if (isLocationExist.length == 0) {
          if (
            isHeadquarterExist.length == 0 ||
            !this.geographicLocation.isHeadquarter
          ) {
            this.geographicLocation.uniquelocationID = 1;
            if (this.model.geographicLocations.length > 0) {
              let maxVal = this.model.geographicLocations.reduce(function (
                prev: any,
                current: any
              ) {
                return prev.uniquelocationID > current.uniquelocationID
                  ? prev
                  : current;
              });
              this.geographicLocation.uniquelocationID =
                maxVal.uniquelocationID + 1;
            }
            this.model.geographicLocations.push(
              JSON.parse(JSON.stringify(this.geographicLocation))
            );

            this.clearGeographicLocation(form);
          } else {
            this.msgs = this.miscService.showAlertMessages(
              "error",
              "You have already selected the headquarter location for the firm"
            );
          }
        } else {
          this.msgs = this.miscService.showAlertMessages(
            "error",
            "Same location is already added for the firm"
          );
        }
      }
    } else {
      this.msgs = this.miscService.showAlertMessages(
        "error",
        "Please select the required fields"
      );
    }
  }
  clearGeographicLocation(geoForm: any) {
    //this.changeDetectorRef.markForCheck();
    this.geographicLocation = {};
    setTimeout(
      function (local: any) {
        local.masterModel = JSON.parse(JSON.stringify(local.masterModelClone));
        local.geographicLocation = { isHeadquarter: false };
        local.changeDetectorRef.detectChanges();
      },
      10,
      this
    );
  }
  removeLocation(locationId: any) {
    this.confirmationService.confirm({
      message: this.deleteConfirmationMessage,
      accept: () => {
        this.model.geographicLocations = this.model.geographicLocations.filter(
          function (ele: any) {
            return locationId != ele.uniquelocationID;
          }
        );
      },
    });
  }
  addEmployees(form: NgForm) {
    if (!form.valid) {
      for (var eachControl in form.form.controls) {
        (<FormControl>form.form.controls[eachControl]).markAsDirty();
      }
      return;
    }
    if (this.employeeEditMode) {
      this.updateEmployee(form);
    } else if (
      this.firmEmployee.employeeName != undefined &&
      this.firmEmployee.emailId != undefined
    ) {
      let empEmailId = this.firmEmployee.emailId;
      let isEmployeeExist = this.model.firmEmployees.filter(function (
        ele: any
      ) {
        return ele.emailId.toLowerCase() != empEmailId.toLowerCase();
      });

      if (this.model.firmEmployees.length == 0 || isEmployeeExist.length != 0) {
        this.firmEmployee.employeeId = 1;
        if (this.model.firmEmployees.length > 0) {
          let maxVal = this.model.firmEmployees.reduce(function (
            prev: any,
            current: any
          ) {
            return prev.employeeId > current.employeeId ? prev : current;
          });
          this.firmEmployee.employeeId = maxVal.employeeId + 1;
        }
        this.model.firmEmployees.push(this.firmEmployee);
        this.clearEmployees(form);
      } else {
        this.msgs = this.miscService.showAlertMessages(
          "error",
          "Employee with the same email id is already added in the list"
        );
      }
    } else {
      this.msgs = this.miscService.showAlertMessages(
        "error",
        "Please select the required fields"
      );
    }
  }

  clearEmployees(form: NgForm) {
    this.employeeEditMode = false;
    this.firmEmployee = {};
    for (var eachControl in form.form.controls) {
      (<FormControl>form.form.controls[eachControl]).markAsPristine();
    }
  }
  removeEmployee(emailId: any) {
    this.confirmationService.confirm({
      message: this.deleteConfirmationMessage,
      accept: () => {
        this.model.firmEmployees = this.model.firmEmployees.filter(function (
          ele: any
        ) {
          return ele.emailId.toLowerCase() != emailId.toLowerCase();
        });
      },
    });
  }

  saveFirm(f: any) {
    if (f.valid) {
      this.loading = true;
      if (this.validateGeographicLocation()) {
        if (this.title == "Create") {
          this.firmService.addFirm(this.model).subscribe(
            (data) => {
              if (data.code == "OK") {
                this.formReset(f);
              }
              this.loading = false;

              this.msgs = this.miscService.showAlertMessages(
                data.code == "OK" ? "success" : "error",
                data.message
              );
            },
            (error) => {
              this.msgs = this.miscService.showAlertMessages(
                "error",
                error.message
              );

              this.loading = false;
            }
          );
        } else if (this.title == "Update") {
          this.firmService
            .addFirm(this.model)
            // this.firmService.updateFirm(this.model)
            .subscribe(
              (data) => {
                this.loading = false;
                this.msgs = this.miscService.showAlertMessages(
                  data.code == "OK" ? "success" : "error",
                  data.message
                );
              },
              (error) => {
                this.msgs = this.miscService.showAlertMessages(
                  "error",
                  error.message
                );
                this.loading = false;
              }
            );
        }
      } else {
        this.loading = false;
        this.msgs = this.miscService.showAlertMessages(
          "error",
          "Please select geographic location for the firm"
        );
      }
    }
  }

  validateGeographicLocation(): boolean {
    if (
      this.model.geographicLocations != undefined &&
      this.model.geographicLocations != [] &&
      this.model.geographicLocations.length > 0
    ) {
      return true;
    } else {
      return false;
    }
  }
  formReset(f: any) {
    f.resetForm();
    // this.changeDetectorRef.detectChanges();
    this.changeDetectorRef.markForCheck();
    this.geographicLocation = { isHeadquarter: false };

    this.model = {
      geographicLocations: [],
      firmEmployees: [],
    };
    this.setDefaultValues();
  }

  employeeEditMode: boolean = false;
  editFirmEmployee(employee: any) {
    this.employeeEditMode = true;
    this.firmEmployee = JSON.parse(JSON.stringify(employee));
    let local = this;
    if (
      this.firmEmployee.designation != null &&
      this.firmEmployee.designation.designationId > 0
    ) {
      this.firmEmployee.designation = this.masterModel.designationList.filter(
        function (element: any, index: any) {
          return (
            element.designationId ==
            local.firmEmployee.designation.designationId
          );
        }
      )[0];
    }
  }

  updateEmployee(form: NgForm) {
    if (
      this.firmEmployee.employeeName != undefined &&
      this.firmEmployee.emailId != undefined
    ) {
      let employeeId = this.firmEmployee.employeeId;

      let existingEmployee = this.model.firmEmployees.filter(function (
        ele: any
      ) {
        return ele.employeeId == employeeId;
      });
      let emailId = this.firmEmployee.emailId;
      let isEmailExist = this.model.firmEmployees.filter(function (ele: any) {
        return (
          ele.emailId.toLowerCase() == emailId.toLowerCase() &&
          ele.employeeId != employeeId
        );
      });

      if (existingEmployee.length != 0 && isEmailExist.length == 0) {
        this.changeDetectorRef.detectChanges();
        this.model.firmEmployees[
          this.model.firmEmployees.indexOf(existingEmployee[0])
        ] = this.firmEmployee;
        this.clearEmployees(form);
      } else {
        this.msgs = this.miscService.showAlertMessages(
          "error",
          "Employee with the same email id is already added in the list"
        );
      }
    } else {
      this.msgs = this.miscService.showAlertMessages(
        "error",
        "Please select the required fields"
      );
    }
  }
}
