import { Component, OnInit } from "@angular/core";
import {
  FeaturesEnum,
  PermissionService,
} from "../../services/permission.service";
import { ReportCategory, ReportService } from "../../services/report.service";

@Component({
  selector: "nav-menu",
  templateUrl: "./navmenu.component.html",
  styleUrls: ["./navmenu.component.css"],
})
export class NavMenuComponent implements OnInit {
  permissions: any[];
  reportCategory: typeof ReportCategory = ReportCategory;
  feature: typeof FeaturesEnum = FeaturesEnum;
  IsExpanded: boolean = false;
  IsPinned: boolean = false;
  Additional: string = "";
  ReportExpanded: string = "";
  AdminExpanded: string = "";
  ShowReportPopUpMenu: string = "";
  ShowAdminPopupMenu: string = "";
  constructor(
    private permissionService: PermissionService,
    private reportService: ReportService
  ) {}
  ngOnInit(): void {
    if (
      localStorage.getItem("additional") != null &&
      localStorage.getItem("additional") != undefined
    ) {
      this.Additional = localStorage.getItem("additional");
      if (this.Additional.length > 0) {
        this.IsPinned = true;
        this.IsExpanded = true;
      } else {
        this.IsExpanded = false;
        this.IsPinned = false;
      }
    } else {
      this.Additional = "nep-sidebar-expanded";
      localStorage.setItem("additional", this.Additional);
      this.IsPinned = true;
      this.IsExpanded = true;
    }
  }

  checkFeaturePermission(feature: any) {
    return this.permissionService.checkPermission(feature);
  }

  changeReportCategory(cat: any) {
    this.reportService.changeReportCategory(cat);
  }


  ToggleHover(event: String) {
    if (event === "Over") this.IsExpanded = true;
    if (event === "Out") this.IsExpanded = false;
    if (this.IsPinned) this.IsExpanded = true;
  }
  PinnedClicked(event: String) {
    this.ShowReportPopUpMenu = "";
    this.ShowAdminPopupMenu = "";
    if (event === "Pin") {
      this.IsPinned = true;
      this.IsExpanded = true;
      this.Additional = "nep-sidebar-expanded";
      localStorage.setItem("additional", this.Additional);
    }
    if (event === "UnPin") {
      this.IsPinned = false;
      this.IsExpanded = false;
      this.Additional = "";
      localStorage.setItem("additional", this.Additional);
    }
  }
  OnExpandReports() {
    if (this.IsExpanded) {
      this.ShowReportPopUpMenu = "";
      if (this.ReportExpanded.length === 0)
        this.ReportExpanded = "nep-menu-open";
      else this.ReportExpanded = "";
    } else {
      if (this.ShowReportPopUpMenu.length === 0)
        this.ShowReportPopUpMenu = "nep-hidable-show";
      else this.ShowReportPopUpMenu = "";
    }
  }
  OnExpandAdmin() {
    if (this.IsExpanded) {
      this.ShowAdminPopupMenu = "";
      if (this.AdminExpanded.length === 0) this.AdminExpanded = "nep-menu-open";
      else this.AdminExpanded = "";
    } else {
      if (this.ShowAdminPopupMenu.length === 0)
        this.ShowAdminPopupMenu = "nep-hidable-show";
        else this.ShowAdminPopupMenu="";
    }
  }
}
