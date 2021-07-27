import { ChangeDetectorRef, Component } from "@angular/core";
import { NgxSpinnerService } from "ngx-spinner";
import { LazyLoadEvent, MenuItem } from "primeng/primeng";
import { AccountService } from "../../services/account.service";
import { MiscellaneousService } from "../../services/miscellaneous.service";
import { FeaturesEnum } from "../../services/permission.service";
import { PortfolioCompanyService } from "../../services/portfolioCompany.service";

@Component({
  selector: "portfolio-company",
  templateUrl: "./portfolioCompany-list.component.html",
})
export class PortfolioCompanyListComponent {
  feature: typeof FeaturesEnum = FeaturesEnum;
  public pcs: any;
  message: any;
  dataTable: any;
  blockedTable: boolean = false;
  totalRecords: number;
  pagerLength: any;
  globalFilter: string = "";
  paginationFilterClone: any = {};
  exportItems: MenuItem[];
  constructor(
    private miscService: MiscellaneousService,
    private portfolioCompanyService: PortfolioCompanyService,
    protected changeDetectorRef: ChangeDetectorRef,
    private spinner: NgxSpinnerService,
    private accountService: AccountService
  ) {
    this.pagerLength = this.miscService.getPagerLength();
    this.exportItems = [
      {
        label: "Export List",
        icon: "fa fa-file-excel-o",
        command: () => {
          this.exportPortfolioCompanyList();
        },
      },
      {
        label: "Bulk Export",
        icon: "fa fa-file-excel-o",
        command: () => {
          this.exportPortfolioCompanyKPIDataList();
        },
      },
    ];
  }

  getPortfolioList(event: any) {
    if (event == null) {
      event = {
        first: 0,
        rows: 10,
        globalFilter: null,
        sortField: null,
        sortOrder: 1,
      };
    }
    if (event.multiSortMeta == undefined) {
      event.multiSortMeta = [{ field: "PortfolioCompanyID", order: 1 }];
      event.sortField = "PortfolioCompanyID";
    }
    this.paginationFilterClone = JSON.parse(JSON.stringify(event));
    this.blockedTable = true;
    this.portfolioCompanyService
      .getPortfolioCompanyList({ paginationFilter: this.paginationFilterClone })
      .subscribe(
        (result) => {
          let resp = result["body"];
          if (resp != null && result.code == "OK") {
            this.pcs = resp.portfolioCompanyList;
            this.totalRecords = resp.totalRecords;
          } else {
            this.pcs = [];
            this.totalRecords = 0;
          }
          this.blockedTable = false;
        },
        (error) => {
          this.blockedTable = false;
          this.accountService.redirectToLogin(error);
        }
      );
  }

  exportPortfolioCompanyList() {
    let event = JSON.parse(JSON.stringify(this.paginationFilterClone));
    event.globalFilter = this.globalFilter;
    event.filterWithoutPaging = true;
    this.portfolioCompanyService
      .exportPortfolioCompanyList({ paginationFilter: event })
      .subscribe((response) => this.miscService.downloadExcelFile(response));
  }

  exportPortfolioCompanyKPIDataList() {
    this.portfolioCompanyService
      .exportPortfolioCompanyKPIDataList()
      .subscribe((response) => this.miscService.downloadExcelFile(response));
  }

  loadPortfolioLazy(event: LazyLoadEvent) {
    this.getPortfolioList(event);
  }
}
