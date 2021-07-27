import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, NgForm } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { Message } from "primeng/components/common/api";
import { MessageService } from "primeng/components/common/messageservice";
import { ConfirmationService } from "primeng/primeng";
import { AccountService } from "../../services/account.service";
import { FirmService } from "../../services/firm.service";
import { MiscellaneousService } from "../../services/miscellaneous.service";
import { PortfolioCompanyService } from "../../services/portfolioCompany.service";

@Component({
  selector: "add-portfolio-company",
  templateUrl: "./add-portfolioCompany.component.html",
  providers: [MessageService, ConfirmationService],
})
export class AddPortfolioCompanyComponent implements OnInit {
  pcForm: FormGroup;
  public sectorList: any[];

  public stockExchangeList: any[];
  id: any;
  msgTimeSpan: number;
  msgs: Message[] = [];
  locationModel: any;
  locationModelClone: any;
  deleteConfirmationMessage: string =
    "Are you sure that you want to delete this record?";
  public masterModel: any;
  title: string = "Create";
  resetText: string = "Reset";
  pcStatus: boolean = true;
  pcEmployee: any = {};
  geographicLocation: any = { isHeadquarter: false };
  model: any = {
    isActive: this.pcStatus,
    geographicLocations: [],
    pcEmployees: [],
  };
  statusOptions: any = [
    { value: "Private", text: "Private" },
    { value: "Public", text: "Public" },
  ];
  loading = false;
  designationList: any[];
  constructor(
    private confirmationService: ConfirmationService,
    private portfolioCompanyService: PortfolioCompanyService,
    private accountService: AccountService,
    private firmService: FirmService,
    private _avRoute: ActivatedRoute,
    protected changeDetectorRef: ChangeDetectorRef,
    private miscService: MiscellaneousService
  ) {
    if (this._avRoute.snapshot.params["id"]) {
      this.id = this._avRoute.snapshot.params["id"];
      this.title = "Update";
      this.resetText = "Reload";
    }

    this.firmService.getMasterFirmModel().subscribe(
      (result) => {
        this.locationModel = result["body"];
        this.locationModelClone = JSON.parse(JSON.stringify(result));
      },
      (error) => this.accountService.redirectToLogin(error)
    );
    this.msgTimeSpan = this.miscService.getMessageTimeSpan();
  }

  sourceURL: any;
  ngOnInit() {
    this.sourceURL = this.miscService.GetPriviousPageUrl();
    if (this.id != undefined) {
      this.loading = true;
      this.title = "Update";
    } else {
      this.loading = false;
    }
    this.portfolioCompanyService.getMasterPCModel().subscribe(
      (result) => {
        this.masterModel = result["body"];
        this.designationList = result["body"].designationList;

        this.setDefaultValues();
      },
      (error) => {
        this.accountService.redirectToLogin(error);
      }
    );
  }

  setDefaultValues() {
    if (this.id != undefined) {
      //this.spinner.show();
      this.title = "Update";
      //get user details by user id
      this.portfolioCompanyService
        .getPortfolioCompanyById({ Value: this.id })
        .subscribe(
          (result) => {
            let resp = result["body"];
            if (resp != null && result.code == "OK") {
              this.model = resp;
              if (this.model != null && this.model.designationId > 0) {
                this.model.designationDetail = this.masterModel.designationList.filter(
                  function (element: any, index: any) {
                    return element.designationId == resp.designationId;
                  }
                )[0];
              }
              if (this.model != null && this.model.sectorID > 0) {
                this.model.sectorDetail = this.masterModel.sectorList.filter(
                  function (element: any, index: any) {
                    return element.sectorID == resp.sectorID;
                  }
                )[0];
              }
              this.GetSubSectorListBySectorId(this.model.sectorID);

              //if (this.model.subSectorDetail != null && this.model.subSectorDetail.subSectorID > 0) {
              //    this.model.subSectorDetail = this.subSectorList.filter(function (element: any, index: any) { return element.subSectorID == resp.subSectorDetail.subSectorID; })[0];
              //}
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
            this.geographicLocation = {};
            this.clearGeographicLocation(form);
          } else {
            this.msgs = this.miscService.showAlertMessages(
              "error",
              "You have already selected the headquarter location for the portfolio company"
            );
          }
        } else {
          this.msgs = this.miscService.showAlertMessages(
            "error",
            "Same location is already added for the portfolio company"
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
        local.locationModel = JSON.parse(
          JSON.stringify(local.locationModelClone)
        );
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
      this.pcEmployee.employeeName != undefined &&
      this.pcEmployee.emailId != undefined
    ) {
      let empEmailId = this.pcEmployee.emailId;
      let existingEmails = this.model.pcEmployees.filter(function (ele: any) {
        return ele.emailId.toLowerCase() == empEmailId.toLowerCase();
      });

      if (this.model.pcEmployees.length == 0 || existingEmails.length == 0) {
        this.pcEmployee.employeeId = 1;
        if (this.model.pcEmployees.length > 0) {
          let maxVal = this.model.pcEmployees.reduce(function (
            prev: any,
            current: any
          ) {
            return prev.employeeId > current.employeeId ? prev : current;
          });
          this.pcEmployee.employeeId = maxVal.employeeId + 1;
        }
        this.model.pcEmployees.push(this.pcEmployee);
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
    this.pcEmployee = {};
    if (form) {
      for (var eachControl in form.form.controls) {
        (<FormControl>form.form.controls[eachControl]).markAsPristine();
      }
    }
  }

  removeEmployee(emailId: any) {
    this.confirmationService.confirm({
      message: this.deleteConfirmationMessage,
      accept: () => {
        this.model.pcEmployees = this.model.pcEmployees.filter(function (
          ele: any
        ) {
          return ele.emailId.toLowerCase() != emailId.toLowerCase();
        });
      },
    });
  }

  savePortfolioCompany(f: any) {
    if (f.valid) {
      this.loading = true;
      // this.loading = true;
      if (this.validateGeographicLocation()) {
        if (this.title == "Create") {
          this.portfolioCompanyService
            .addPortfolioCompany(this.model)
            .subscribe(
              (data) => {
                if (data.code == "OK") {
                  this.formReset(f);
                }
                // this.loading = false;
                this.loading = false;
                this.msgs = this.miscService.showAlertMessages(
                  data.code == "OK" ? "success" : "error",
                  data.message
                );
              },
              (error) => {
                this.loading = false;
                // this.loading = false;
                this.msgs = this.miscService.showAlertMessages(
                  "error",
                  error.message
                );
              }
            );
        } else if (this.title == "Update") {
          this.portfolioCompanyService
            .updatePortfolioCompany(this.model)
            .subscribe(
              (data) => {
                if (data.code == "OK") {
                  this.formReset(f);
                }
                // this.loading = false;
                this.loading = false;
                this.msgs = this.miscService.showAlertMessages(
                  data.code == "OK" ? "success" : "error",
                  data.message
                );
              },
              (error) => {
                this.loading = false;
                this.msgs = this.miscService.showAlertMessages(
                  "error",
                  error.message
                );
              }
            );
        }
      } else {
        this.loading = false;

        this.msgs = this.miscService.showAlertMessages(
          "error",
          "Please select geographic location for the portfolio company"
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
    this.changeDetectorRef.markForCheck();

    this.geographicLocation = { isHeadquarter: false };

    this.model = {
      geographicLocations: [],
      pcEmployees: [],
    };
    this.setDefaultValues();
  }

  employeeEditMode: boolean = false;
  editPCEmployee(employee: any) {
    this.employeeEditMode = true;
    this.pcEmployee = JSON.parse(JSON.stringify(employee));
    let local = this;
    if (
      this.pcEmployee.designation != null &&
      this.pcEmployee.designation.designationId > 0
    ) {
      this.pcEmployee.designation = this.masterModel.designationList.filter(
        function (element: any, index: any) {
          return (
            element.designationId == local.pcEmployee.designation.designationId
          );
        }
      )[0];
    }
  }

  updateEmployee(form: NgForm) {
    if (
      this.pcEmployee.employeeName != undefined &&
      this.pcEmployee.emailId != undefined
    ) {
      let employeeId = this.pcEmployee.employeeId;

      let existingEmployee = this.model.pcEmployees.filter(function (ele: any) {
        return ele.employeeId == employeeId;
      });
      let emailId = this.pcEmployee.emailId;
      let isEmailExist = this.model.pcEmployees.filter(function (ele: any) {
        return (
          ele.emailId.toLowerCase() == emailId.toLowerCase() &&
          ele.employeeId != employeeId
        );
      });

      if (existingEmployee.length != 0 && isEmailExist.length == 0) {
        this.changeDetectorRef.detectChanges();
        this.model.pcEmployees[
          this.model.pcEmployees.indexOf(existingEmployee[0])
        ] = this.pcEmployee;
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

  onSectorChange() {
    this.GetSubSectorListBySectorId(null);
  }
  subSectorLoading: boolean = false;
  subSectorList: any[];
  GetSubSectorListBySectorId(sectorId: any) {
    this.subSectorLoading = true;
    this.subSectorList = [];
    sectorId =
      sectorId != null ? sectorId : this.model.sectorDetail.sectorID;
    this.miscService.getSubSectorListBySectorId(sectorId.toString()).subscribe(
      (data) => {
        this.subSectorList = data["body"];
        var local = this;

        if (
          this.model.subSectorDetail != null &&
          this.model.subSectorDetail.subSectorID > 0
        ) {
          var matchedList = this.subSectorList.filter(function (
            element: any,
            index: any
          ) {
            return (
              element.subSectorID == local.model.subSectorDetail.subSectorID
            );
          });
          if (matchedList.length > 0) {
            this.model.subSectorDetail = matchedList[0];
          } else {
            this.model.subSectorDetail = null;
          }
        }
        this.subSectorLoading = false;
      },
      (error) => {
        this.subSectorLoading = false;
        this.accountService.redirectToLogin(error);
      }
    );
  }
}
