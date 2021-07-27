import { HttpClient } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { catchError, map } from "rxjs/operators";
import { AccountService } from "./account.service";

@Injectable()
export class PermissionService {
  myAppUrl: string = "";
  router: Router;

  constructor(
    private _http: HttpClient,
    @Inject("BASE_URL") baseUrl: string,
    private accountService: AccountService
  ) {
    this.myAppUrl = baseUrl;
  }

  addGroup(group: any) {
    return this._http.post<any>(this.myAppUrl + "api/group/add", group).pipe(
      map((response) => response),
      catchError(this.accountService.errorHandler)
    );
  }

  getGroupList(filter: any) {
    return this._http.post<any>(this.myAppUrl + "api/group/get", filter).pipe(
      map((response) => response),
      catchError((error) => this.accountService.errorHandler(error))
    );
  }

  getGroupById(groupId: any) {
    return this._http
      .post<any>(this.myAppUrl + "api/group/getbyid", groupId)
      .pipe(
        map((response) => response),
        catchError((error) => this.accountService.errorHandler(error))
      );
  }

  updateGroup(group: any) {
    return this._http.post<any>(this.myAppUrl + "api/group/add", group).pipe(
      map((response) => response),
      catchError(this.accountService.errorHandler)
    );
  }

  getFeatureList(groupId: any) {
    return this._http
      .post<any>(this.myAppUrl + "api/feature/get", groupId)
      .pipe(
        map((response) => response),
        catchError((error) => this.accountService.errorHandler(error))
      );
  }

  checkPermission(feature: any) {
    let permissions;
    var permissionData = localStorage.getItem("userPermissions");
    if (
      permissionData != null &&
      permissionData != undefined &&
      permissionData != "[]"
    ) {
      permissions = JSON.parse(permissionData + "");
    }
    var isAllow = permissions.filter(function (val: any, key: any) {
      return val.featureID == feature;
    });
    return isAllow.length > 0 ? true : false;
  }

  exportGroupList(filter: any) {
    return this._http
      .post(this.myAppUrl + "api/group/export", filter, {
        responseType: "blob",
        observe: "response",
      })
      .pipe(catchError((error) => this.accountService.errorHandler(error)));
  }

  checkFeaturePermission(permission: any) {
    let permissions;
    var permissionData = localStorage.getItem("userPermissions");
    if (
      permissionData != null &&
      permissionData != undefined &&
      permissionData != "[]"
    ) {
      permissions = JSON.parse(permissionData + "");
    }
    if (
      permissions != undefined &&
      permissions != null &&
      permission != undefined &&
      permission != null
    ) {
      var isAllow = permissions.filter(function (val: any, key: any) {
        if (val.featureID == permission.featureId) {
          if (permission.action != undefined) {
            switch (permission.action) {
              case "add":
                return val.canAdd == 1;
              case "view":
                return val.canView == 1;
              case "edit":
                return val.canEdit == 1;
              case "export":
                return val.canExport == 1;
              case "import":
                return val.canImport == 1;
              default:
                return false;
            }
          } else {
            return true;
          }
        }
      });
      return isAllow.length > 0 ? true : false;
    } else {
      return false;
    }
  }

  navigationItems: any = [
    {
      id: "1",
      label: "Firm",
      url: "/firm",
      parent: "",
      feature: { featureId: FeaturesEnum.Firm },
    },
    {
      id: "2",
      label: "Fund",
      url: "/fund-list",
      parent: "",
      feature: { featureId: FeaturesEnum.Fund },
    },
    {
      id: "3",
      label: "Portfolio Company",
      url: "/portfolio-company",
      parent: "",
      feature: { featureId: FeaturesEnum.PortfolioCompany },
    },
    {
      id: "4",
      label: "Deal",
      url: "/deal-list",
      parent: "",
      feature: { featureId: FeaturesEnum.Deal },
    },
    {
      id: "5",
      label: "Pipeline",
      url: "/pipeline-list",
      parent: "",
      feature: { featureId: FeaturesEnum.Pipeline },
    },
    {
      id: "6",
      label: "Report",
      url: "",
      parent: "",
      feature: { featureId: FeaturesEnum.Report },
    },
    {
      id: "7",
      label: "Admin",
      url: "",
      parent: "",
      feature: { featureId: FeaturesEnum.Admin },
    },

    {
      id: "8",
      label: "Create Firm",
      url: "/add-firm",
      parent: "1",
      feature: { featureId: FeaturesEnum.Firm, action: "add" },
    },
    {
      id: "9",
      label: "Update Firm",
      url: "/add-firm/:id",
      parent: "1",
      feature: { featureId: FeaturesEnum.Firm, action: "edit" },
    },
    {
      id: "9",
      label: "Firm Details",
      url: "/firm-details/:id",
      parent: "1",
      feature: { featureId: FeaturesEnum.Firm, action: "view" },
    },

    {
      id: "10",
      label: "Create Fund",
      url: "/create-fund",
      parent: "2",
      feature: { featureId: FeaturesEnum.Fund, action: "add" },
    },
    {
      id: "11",
      label: "Update Fund",
      url: "/create-fund/:id",
      parent: "2",
      feature: { featureId: FeaturesEnum.Fund, action: "edit" },
    },
    {
      id: "12",
      label: "Fund Details",
      url: "/fund-details/:id",
      parent: "2",
      feature: { featureId: FeaturesEnum.Fund, action: "view" },
    },

    {
      id: "13",
      label: "Create Portfolio Company",
      url: "/add-portfolio-company",
      parent: "3",
      feature: { featureId: FeaturesEnum.PortfolioCompany, action: "add" },
    },
    {
      id: "14",
      label: "Update Portfolio Company",
      url: "/add-portfolio-company/:id",
      parent: "3",
      feature: { featureId: FeaturesEnum.PortfolioCompany, action: "edit" },
    },
    {
      id: "15",
      label: "Portfolio Company Details",
      url: "/portfolio-company-detail/:id",
      parent: "3",
      feature: { featureId: FeaturesEnum.PortfolioCompany, action: "view" },
    },

    {
      id: "16",
      label: "Create Deal",
      url: "/save-deal",
      parent: "4",
      feature: { featureId: FeaturesEnum.Deal, action: "add" },
    },
    {
      id: "17",
      label: "Update Deal",
      url: "/save-deal/:id",
      parent: "4",
      feature: { featureId: FeaturesEnum.Deal, action: "edit" },
    },
    {
      id: "18",
      label: "Deal Details",
      url: "/deal-details/:id",
      parent: "4",
      feature: { featureId: FeaturesEnum.Deal, action: "view" },
    },

    {
      id: "19",
      label: "Create Pipeline",
      url: "/pipeline",
      parent: "5",
      feature: { featureId: FeaturesEnum.Pipeline, action: "add" },
    },
    {
      id: "20",
      label: "Update Pipeline",
      url: "/pipeline/:id",
      parent: "5",
      feature: { featureId: FeaturesEnum.Pipeline, action: "edit" },
    },

    {
      id: "21",
      label: "Top Holdings",
      url: "/reports/Holdings",
      parent: "6",
      feature: { featureId: FeaturesEnum.Holdings },
    },
    {
      id: "22",
      label: "Valuation Analysis",
      url: "/reports/ValuationCharts",
      parent: "6",
      feature: { featureId: FeaturesEnum.ValuationCharts },
    },
    {
      id: "23",
      label: "Attribution Reports",
      url: "/reports/Attribution",
      parent: "6",
      feature: { featureId: FeaturesEnum.Attribution },
    },

    {
      id: "24",
      label: "Group",
      url: "/groups",
      parent: "7",
      feature: { featureId: FeaturesEnum.Group },
    },
    {
      id: "25",
      label: "User",
      url: "/user",
      parent: "7",
      feature: { featureId: FeaturesEnum.User },
    },

    {
      id: "26",
      label: "Create Group",
      url: "/update-group",
      parent: "24",
      feature: { featureId: FeaturesEnum.Group, action: "add" },
    },
    {
      id: "27",
      label: "Update Group",
      url: "/update-group/:id",
      parent: "24",
      feature: { featureId: FeaturesEnum.Group, action: "edit" },
    },
    {
      id: "28",
      label: "Group Details",
      url: "/group-details/:id",
      parent: "24",
      feature: { featureId: FeaturesEnum.Group, action: "view" },
    },

    {
      id: "29",
      label: "Create User",
      url: "/register",
      parent: "25",
      feature: { featureId: FeaturesEnum.User, action: "add" },
    },
    {
      id: "30",
      label: "Update User",
      url: "/register/:id",
      parent: "25",
      feature: { featureId: FeaturesEnum.User, action: "edit" },
    },

    {
      id: "31",
      label: "Financial/Operational KPIs",
      url: "/reports/CompanyFinancials",
      parent: "6",
      feature: { featureId: FeaturesEnum.CompanyFinancials },
    },
    {
      id: "32",
      label: "Dynamic Query",
      url: "/dynamic-queries",
      parent: "7",
      feature: { featureId: FeaturesEnum.Admin },
    },

    {
      id: "33",
      label: "Create Query",
      url: "/create-update-queries",
      parent: "32",
      feature: { featureId: FeaturesEnum.Query, action: "add" },
    },
    {
      id: "34",
      label: "Update Query",
      url: "/create-update-queries/:id",
      parent: "32",
      feature: { featureId: FeaturesEnum.Query, action: "edit" },
    },

    {
      id: "35",
      label: "Bulk Upload",
      url: "/bulk-upload",
      parent: "7",
      feature: { featureId: FeaturesEnum.BulkUpload },
    },
    {
      id: "36",
      label: "Fund Cashflow",
      url: "/cashflow-list",
      parent: "",
      feature: { featureId: FeaturesEnum.Cashflow },
    },
    {
      id: "37",
      label: "Cashflow Details",
      url: "/cashflow/:id",
      parent: "36",
      feature: { featureId: FeaturesEnum.Cashflow, action: "view" },
    },
    {
      id: "38",
      label: "Upload Cashflow",
      url: "/cashflow",
      parent: "36",
      feature: { featureId: FeaturesEnum.Cashflow, action: "import" },
    },
    {
      id: "39",
      label: "Pipeline Details",
      url: "/pipeline-details/:id",
      parent: "5",
      feature: { featureId: FeaturesEnum.Pipeline, action: "view" },
    },
    {
      id: "40",
      label: "User Details",
      url: "/user-details/:id",
      parent: "25",
      feature: { featureId: FeaturesEnum.User, action: "view" },
    },
    {
      id: "41",
      label: "Change Password",
      url: "/change-password/:id",
      parent: "",
      feature: { featureId: FeaturesEnum.ChangePassword },
    },
    {
      id: "42",
      label: "Financials",
      url: "/financials",
      parent: "",
      feature: { featureId: FeaturesEnum.Financials },
    },
    {
      id: "43",
      label: "Data Extraction",
      url: "/dataextraction",
      parent: "",
      feature: { featureId: FeaturesEnum.DataExtraction },
    },
    {
      id: "44",
      label: "Repository",
      url: "/repository",
      parent: "",
      feature: { featureId: FeaturesEnum.Repository },
    },
{ id: "45", label: "OpenDocument", url: "/open-document", parent: "", feature: { featureId: FeaturesEnum.OpenDocument}}
  ];
}

export enum FeaturesEnum {
    User = 1,
    Group = 5,
    Firm = 9,
    Fund = 13,
    PortfolioCompany = 14,
    Deal = 15,
    Pipeline = 16,
    Report = 17,
    Holdings = 18,
    Attribution = 19,
    ValuationCharts = 20,
	Cashflow = 21,
    Admin = 22,
	CompanyFinancials = 23,
     Query = 24,
    BulkUpload = 25,
    ChangePassword=26,
    Financials=27,
    DataExtraction = 28,
    Repository = 29,
    OpenDocument = 30
}