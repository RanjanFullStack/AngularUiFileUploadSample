import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { environment } from "src/environments/environment";
import { LoginComponent } from "./components/auth/login.component";
import { ResetPasswordComponent } from "./components/auth/reset-password.component";
import { CashflowlListComponent } from "./components/cashflow/cashflow-list.component";
import { CashflowComponent } from "./components/cashflow/cashflow.component";
import { BarChartComponent } from "./components/chart/barChart";
import { BubbleChartComponent } from "./components/chart/bubbleChart";
import { DonutChartComponent } from "./components/chart/donutChart";
import { lineBarChartComponent } from "./components/chart/lineBarChart";
import { lineChartComponent } from "./components/chart/lineChart";
import { multilineChartComponent } from "./components/chart/multilineChart";
import { PortfolioCompanyDataExtractionComponent } from "./components/dataExtraction/portfolioCompany-DataExtraction.component";
import { DealDetailsComponent } from "./components/Deal/deal-details.component";
import { DealListComponent } from "./components/Deal/deal-list.component";
import { SavePortfolioFundHoldingComponent } from "./components/Deal/portfolio-fundHolding.component";
import { SaveDealComponent } from "./components/Deal/save-deals.component";
import { BulkUploadComponent } from "./components/file-uploads/bulk-upload.component";
import { PortfolioCompanyFinancialsReportComponent } from "./components/financials";
import { AddFirmComponent } from "./components/firm/add-firm.component";
import { FirmDetailsComponent } from "./components/firm/firm-details.component";
import { FirmListComponent } from "./components/firm/firm-list.component";
import { AddFundComponent } from "./components/funds/add-funds.component";
import { FundDetailsComponent } from "./components/funds/fund-details.component";
import { FundListComponent } from "./components/funds/fund-list.component";
import { AddGroupComponent } from "./components/group/add-group.component";
import { GroupDetailsComponent } from "./components/group/group-details.component";
import { GroupListComponent } from "./components/group/group-list.component";
import { HomeComponent } from "./components/home/home.component";
import { MasterComponent } from "./components/master/master.component";
import { MasterModule } from "./components/master/master.module";
import { AddPipelineComponent } from "./components/pipeline/add-pipeline.component";
import { PipelineDetailsComponent } from "./components/pipeline/pipeline-details.component";
import { PipelineListComponent } from "./components/pipeline/pipeline-list.component";
import { AddPortfolioCompanyComponent } from "./components/portfolioCompany/add-portfolioCompany.component";
import { PortfolioCompanyDetailComponent } from "./components/portfolioCompany/portfolioCompany-detail.component";
import { PortfolioCompanyListComponent } from "./components/portfolioCompany/portfolioCompany-list.component";
import { AddQueryComponent } from "./components/queries/add-queries.component";
import { DynamicQueriesListComponent } from "./components/queries/dynamic-queries.component";
import { ReportsComponent } from "./components/reports/home.report";
import { AddUserComponent } from "./components/user/add-user.component";
import { UserDetailsComponent } from "./components/user/user-details.component";
import { UserListComponent } from "./components/user/user-list.component";
import { RepositoryListComponent } from "./components/repository/repository-list.component";
import { AuthGuard } from "./guards";
import { OpenDocumentComponent } from "./components/open-document/open-document.component";

const routes: Routes = [
  {
    path: "",
    component: MasterComponent,
    children: [
      {
        outlet: "master",
        path: "",
        component: HomeComponent,
      },
    ],
    canActivate: [AuthGuard],
  },
  {
    path: "home",
    component: MasterComponent,
    children: [
      {
        outlet: "master",
        path: "",
        component: HomeComponent,
      },
    ],
    canActivate: [AuthGuard],
  },
  {
    path: "register/:id",
    component: MasterComponent,
    children: [
      {
        outlet: "master",
        path: "",
        component: AddUserComponent,
      },
    ],
    canActivate: [AuthGuard],
  },
  {
    path: "register",
    component: MasterComponent,
    children: [
      {
        outlet: "master",
        path: "",
        component: AddUserComponent,
      },
    ],
    canActivate: [AuthGuard],
  },
  {
    path: "user-details/:id",
    component: MasterComponent,
    children: [
      {
        outlet: "master",
        path: "",
        component: UserDetailsComponent,
      },
    ],
    canActivate: [AuthGuard],
  },
  {
    path: "create-fund/:id",
    component: MasterComponent,
    children: [
      {
        outlet: "master",
        path: "",
        component: AddFundComponent,
      },
    ],
    canActivate: [AuthGuard],
  },
  {
    path: "create-fund",
    component: MasterComponent,
    children: [
      {
        outlet: "master",
        path: "",
        component: AddFundComponent,
      },
    ],
    canActivate: [AuthGuard],
  },
  {
    path: "dynamic-queries",
    component: MasterComponent,
    children: [
      {
        outlet: "master",
        path: "",
        component: DynamicQueriesListComponent,
      },
    ],
    canActivate: [AuthGuard],
  },
  {
    path: "create-update-queries/:id",
    component: MasterComponent,
    children: [
      {
        outlet: "master",
        path: "",
        component: AddQueryComponent,
      },
    ],
    canActivate: [AuthGuard],
  },
  {
    path: "create-update-queries",
    component: MasterComponent,
    children: [
      {
        outlet: "master",
        path: "",
        component: AddQueryComponent,
      },
    ],
    canActivate: [AuthGuard],
  },
  {
    path: "fund-list",
    component: MasterComponent,
    children: [
      {
        outlet: "master",
        path: "",
        component: FundListComponent,
      },
    ],
    canActivate: [AuthGuard],
  },
  {
    path: "user",
    component: MasterComponent,
    children: [
      {
        outlet: "master",
        path: "",
        component: UserListComponent,
      },
    ],
    canActivate: [AuthGuard],
  },
  {
    path: "repository",
    component: MasterComponent,
    children: [
      {
        outlet: "master",
        path: "",
        //loadChildren: () => import('./components/repository/repository-list.component').then(m => m.RepositoryListComponent),
        component: RepositoryListComponent,
      },
    ],
    canActivate: [AuthGuard],
  },
  {
    path: "open-document/:id",
    component: MasterComponent,
    children: [
      {
        outlet: "master",
        path: "",
        component: OpenDocumentComponent,
      },
    ],
    canActivate: [AuthGuard],
  },
  {
    path: "open-document",
    component: MasterComponent,
    children: [
      {
        outlet: "master",
        path: "",
        component: OpenDocumentComponent,
      },
    ],
    canActivate: [AuthGuard],
  },
  {
    path: "add-firm/:id",
    component: MasterComponent,
    children: [
      {
        outlet: "master",
        path: "",
        component: AddFirmComponent,
      },
    ],
    canActivate: [AuthGuard],
  },
  {
    path: "firm",
    component: MasterComponent,
    children: [
      {
        outlet: "master",
        path: "",
        component: FirmListComponent,
      },
    ],
    canActivate: [AuthGuard],
  },
  {
    path: "add-firm",
    component: MasterComponent,
    children: [
      {
        outlet: "master",
        path: "",
        component: AddFirmComponent,
      },
    ],
    canActivate: [AuthGuard],
  },
  {
    path: "firm-details/:id",
    component: MasterComponent,
    children: [
      {
        outlet: "master",
        path: "",
        component: FirmDetailsComponent,
      },
    ],
    canActivate: [AuthGuard],
  },
  {
    path: "fund-details/:id",
    component: MasterComponent,
    children: [
      {
        outlet: "master",
        path: "",
        component: FundDetailsComponent,
      },
    ],
    canActivate: [AuthGuard],
  },
  {
    path: "portfolio-company",
    component: MasterComponent,
    children: [
      {
        outlet: "master",
        path: "",
        component: PortfolioCompanyListComponent,
      },
    ],
    canActivate: [AuthGuard],
  },
  {
    path: "portfolio-company-detail/:id",
    component: MasterComponent,
    children: [
      {
        outlet: "master",
        path: "",
        component: PortfolioCompanyDetailComponent,
      },
    ],
    canActivate: [AuthGuard],
  },
  {
    path: "add-portfolio-company/:id",
    component: MasterComponent,
    children: [
      {
        outlet: "master",
        path: "",
        component: AddPortfolioCompanyComponent,
      },
    ],
    canActivate: [AuthGuard],
  },
  {
    path: "add-portfolio-company",
    component: MasterComponent,
    children: [
      {
        outlet: "master",
        path: "",
        component: AddPortfolioCompanyComponent,
      },
    ],
    canActivate: [AuthGuard],
  },
  {
    path: "save-deal",
    component: MasterComponent,
    children: [
      {
        outlet: "master",
        path: "",
        component: SaveDealComponent,
      },
    ],
    canActivate: [AuthGuard],
  },
  {
    path: "save-deal/:id",
    component: MasterComponent,
    children: [
      {
        outlet: "master",
        path: "",
        component: SaveDealComponent,
      },
    ],
    canActivate: [AuthGuard],
  },
  {
    path: "deal-list",
    component: MasterComponent,
    children: [
      {
        outlet: "master",
        path: "",
        component: DealListComponent,
      },
    ],
    canActivate: [AuthGuard],
  },
  {
    path: "deal-details/:id",
    component: MasterComponent,
    children: [
      {
        outlet: "master",
        path: "",
        component: DealDetailsComponent,
      },
    ],
    canActivate: [AuthGuard],
  },
  {
    path: "save-portfolio-fundholding",
    component: MasterComponent,
    children: [
      {
        outlet: "master",
        path: "",
        component: SavePortfolioFundHoldingComponent,
      },
    ],
    canActivate: [AuthGuard],
  },
  {
    path: "update-group/:id",
    component: MasterComponent,
    children: [
      {
        outlet: "master",
        path: "",
        component: AddGroupComponent,
      },
    ],
    canActivate: [AuthGuard],
  },
  {
    path: "group-details/:id",
    component: MasterComponent,
    children: [
      {
        outlet: "master",
        path: "",
        component: GroupDetailsComponent,
      },
    ],
    canActivate: [AuthGuard],
  },
  {
    path: "update-group",
    component: MasterComponent,
    children: [
      {
        outlet: "master",
        path: "",
        component: AddGroupComponent,
      },
    ],
    canActivate: [AuthGuard],
  },
  {
    path: "groups",
    component: MasterComponent,
    children: [
      {
        outlet: "master",
        path: "",
        component: GroupListComponent,
      },
    ],
    canActivate: [AuthGuard],
  },
  {
    path: "pipeline/:id",
    component: MasterComponent,
    children: [
      {
        outlet: "master",
        path: "",
        component: AddPipelineComponent,
      },
    ],
    canActivate: [AuthGuard],
  },
  {
    path: "pipeline",
    component: MasterComponent,
    children: [
      {
        outlet: "master",
        path: "",
        component: AddPipelineComponent,
      },
    ],
    canActivate: [AuthGuard],
  },
  {
    path: "pipeline-list",
    component: MasterComponent,
    children: [
      {
        outlet: "master",
        path: "",
        component: PipelineListComponent,
      },
    ],
    canActivate: [AuthGuard],
  },
  {
    path: "pipeline-details/:id",
    component: MasterComponent,
    children: [
      {
        outlet: "master",
        path: "",
        component: PipelineDetailsComponent,
      },
    ],
    canActivate: [AuthGuard],
  },
  {
    path: "bar-chart",
    component: MasterComponent,
    children: [
      {
        outlet: "master",
        path: "",
        component: BarChartComponent,
      },
    ],
    canActivate: [AuthGuard],
  },
  {
    path: "bubble-chart",
    component: MasterComponent,
    children: [
      {
        outlet: "master",
        path: "",
        component: BubbleChartComponent,
      },
    ],
    canActivate: [AuthGuard],
  },
  {
    path: "donut-chart",
    component: MasterComponent,
    children: [
      {
        outlet: "master",
        path: "",
        component: DonutChartComponent,
      },
    ],
    canActivate: [AuthGuard],
  },
  {
    path: "line-chart",
    component: MasterComponent,
    children: [
      {
        outlet: "master",
        path: "",
        component: lineChartComponent,
      },
    ],
    canActivate: [AuthGuard],
  },
  {
    path: "multiline-chart",
    component: MasterComponent,
    children: [
      {
        outlet: "master",
        path: "",
        component: multilineChartComponent,
      },
    ],
    canActivate: [AuthGuard],
  },
  {
    path: "line-bar-chart",
    component: MasterComponent,
    children: [
      {
        outlet: "master",
        path: "",
        component: lineBarChartComponent,
      },
    ],
    canActivate: [AuthGuard],
  },

  {
    path: "reports",
    component: MasterComponent,
    children: [
      {
        outlet: "master",
        path: "",
        component: ReportsComponent,
      },
    ],
    canActivate: [AuthGuard],
  },
  {
    path: "reports/:id",
    component: MasterComponent,
    children: [
      {
        outlet: "master",
        path: "",
        component: ReportsComponent,
      },
    ],
    canActivate: [AuthGuard],
  },
  {
    path: "bulk-upload",
    component: MasterComponent,
    children: [
      {
        outlet: "master",
        path: "",
        component: BulkUploadComponent,
      },
    ],
    canActivate: [AuthGuard],
  },
  {
    path: "cashflow-list",
    component: MasterComponent,
    children: [
      {
        outlet: "master",
        path: "",
        component: CashflowlListComponent,
      },
    ],
    canActivate: [AuthGuard],
  },
  {
    path: "cashflow/:id",
    component: MasterComponent,
    children: [
      {
        outlet: "master",
        path: "",
        component: CashflowComponent,
      },
    ],
    canActivate: [AuthGuard],
  },
  {
    path: "cashflow",
    component: MasterComponent,
    children: [
      {
        outlet: "master",
        path: "",
        component: CashflowComponent,
      },
    ],
    canActivate: [AuthGuard],
  },
  {
    path: "change-password/:id",
    component: MasterComponent,
    children: [
      {
        outlet: "master",
        path: "",
        component: ResetPasswordComponent,
      },
    ],
    canActivate: [AuthGuard],
  },
  {
    path: "financials",
    component: MasterComponent,
    children: [
      {
        outlet: "master",
        path: "",
        component: PortfolioCompanyFinancialsReportComponent,
      },
    ],
  },
  {
    path: "dataextraction",
    component: MasterComponent,
    children: [
      {
        outlet: "master",
        path: "",
        component: PortfolioCompanyDataExtractionComponent,
      },
    ],
  },
  { path: "login", component: LoginComponent },
  { path: "reset-password/:id", component: ResetPasswordComponent },
  { path: "**", component: MasterComponent, redirectTo: "" },
];

@NgModule({
  imports: [MasterModule, RouterModule.forRoot(routes, { useHash: true })],
  providers: [
    { provide: "BASE_URL", useFactory: getBaseUrl },
    { provide: "Pager_Option", useFactory: getPagerOption },
  ],
})
export class AppRoutingModule {}

export function getBaseUrl() {
  return environment.apiBaseUrl;
}
export function getPagerOption() {
  return "[10,25,100]";
}
