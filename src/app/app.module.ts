import { CommonModule } from "@angular/common";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http"; // to make http request
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpModule } from "@angular/http";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
//import { DataTablesModule } from 'angular-datatables';
import { NgbActiveModal, NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { AngularFontAwesomeModule } from "angular-font-awesome";
import { AngularResizedEventModule } from "angular-resize-event";
import "codemirror/mode/sql/sql.js";
import { NgxSpinnerModule } from "ngx-spinner";
import { BlockUIModule } from "primeng/blockui";
import { CheckboxModule } from "primeng/components/checkbox/checkbox";
import { TreeTableModule } from "primeng/components/treetable/treetable";
import { FileUploadModule } from "primeng/fileupload";
import { GrowlModule } from "primeng/growl";
import { InputSwitchModule } from "primeng/inputswitch";
import { MenuModule } from "primeng/menu";
import { MessagesModule } from "primeng/messages";
import { OverlayPanelModule } from "primeng/overlaypanel";
import {
  AccordionModule,
  AutoCompleteModule,
  CalendarModule,
  ConfirmDialogModule,
  DataTableModule,
  DialogModule,
  EditorModule,
  MultiSelectModule,
  PaginatorModule,
  SplitButtonModule,
} from "primeng/primeng";
import { ProgressBarModule } from "primeng/progressbar";
import { RadioButtonModule } from "primeng/radiobutton";
import { SelectButtonModule } from "primeng/selectbutton";
import { TableModule } from "primeng/table";
import { ToastModule } from "primeng/toast";
import { TreeModule } from "primeng/tree";
import { ChipsModule } from "primeng/chips";
import { environment } from "src/environments/environment";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { LoginComponent } from "./components/auth/login.component";
import { ResetPasswordComponent } from "./components/auth/reset-password.component";
import { ResetPasswordControl } from "./components/auth/reset-password.control";
import { CashflowlListComponent } from "./components/cashflow/cashflow-list.component";
import { CashflowComponent } from "./components/cashflow/cashflow.component";
import { BarChartComponent } from "./components/chart/barChart";
import { BubbleChartComponent } from "./components/chart/bubbleChart";
import { ChartComponent } from "./components/chart/chart";
import { DonutChartComponent } from "./components/chart/donutChart";
import { GraphChartComponent } from "./components/chart/graphChart";
import { lineBarChartComponent } from "./components/chart/lineBarChart";
import { lineChartComponent } from "./components/chart/lineChart";
import { multilineChartComponent } from "./components/chart/multilineChart";
import { multilinePointChartComponent } from "./components/chart/multilinePointChart";
// import { PieChartComponent } from './components/chart/pieChart'
import { Pie3DChartComponent } from "./components/chart/pie3DChart";
import { pieBarChartComponent } from "./components/chart/pieBarChart";
// import { CounterComponent } from './components/counter/counter.component';
import { CommentControlComponent } from "./components/custom-controls/comment-control.component";
import { HorizontalNavBarComponent } from "./components/custom-controls/horizontal-navbar.component";
import { LocationControlComponent } from "./components/custom-controls/location-control.component";
import { TooltipControlComponent } from "./components/custom-controls/tooltip-control.component";
import { TypeAheadControlComponent } from "./components/custom-controls/typeahead-control.component";
import { FilterControlComponent } from "./components/custom-controls/filter-control.component";
import { PortfolioCompanyDataExtractionComponent } from "./components/dataExtraction/portfolioCompany-DataExtraction.component";
import { DealDetailsComponent } from "./components/Deal/deal-details.component";
import { DealListComponent } from "./components/Deal/deal-list.component";
import { SavePortfolioFundHoldingComponent } from "./components/Deal/portfolio-fundHolding.component";
import { SaveDealComponent } from "./components/Deal/save-deals.component";
import { FieldErrorDisplayComponent } from "./components/field-error-display/field-error-display.component";
import { BulkUploadComponent } from "./components/file-uploads/bulk-upload.component";
import { PortfolioCompanyFinancialsReportComponent } from "./components/financials";
import { AddFirmComponent } from "./components/firm/add-firm.component";
import { FirmDetailsComponent } from "./components/firm/firm-details.component";
import { FirmListComponent } from "./components/firm/firm-list.component";
import { AddFundComponent } from "./components/funds/add-funds.component";
import { FundDetailsComponent } from "./components/funds/fund-details.component";
import { FundListComponent } from "./components/funds/fund-list.component";
import { AddFundTrackRecordComponent } from "./components/funds/fund-trackRecord.component";
import { AddGroupComponent } from "./components/group/add-group.component";
import { GroupDetailsComponent } from "./components/group/group-details.component";
import { GroupListComponent } from "./components/group/group-list.component";
import { HomeComponent } from "./components/home/home.component";
import { JSChartComponent } from "./components/js-charts/js-charts";
import { MasterComponent } from "./components/master/master.component";
import { MasterModule } from "./components/master/master.module";
import { NavMenuComponent } from "./components/navmenu/navmenu.component";
import { AddPipelineComponent } from "./components/pipeline/add-pipeline.component";
import { PipelineDetailsComponent } from "./components/pipeline/pipeline-details.component";
import { PipelineListComponent } from "./components/pipeline/pipeline-list.component";
import { AddPortfolioCompanyComponent } from "./components/portfolioCompany/add-portfolioCompany.component";
import { PortfolioCompanyDetailComponent } from "./components/portfolioCompany/portfolioCompany-detail.component";
import { PortfolioCompanyListComponent } from "./components/portfolioCompany/portfolioCompany-list.component";
import { SavePortfolioOperationalKPIComponent } from "./components/portfolioCompany/portfolioCompany-operationalKPI.component";
import { SavePortfolioProfitabilityComponent } from "./components/portfolioCompany/portfolioCompany-profitability.component";
import { UpdateInfoSectionComponent } from "./components/portfolioCompany/update-info-section.component";
import { AddQueryComponent } from "./components/queries/add-queries.component";
import { DynamicQueriesListComponent } from "./components/queries/dynamic-queries.component";
import { AttributionReportsComponent } from "./components/reports/attribution.report";
import { CompanyFinancialsReportComponent } from "./components/reports/company-financials.report";
import { HoldingValuesComponent } from "./components/reports/holding-values.report";
import { ReportsComponent } from "./components/reports/home.report";
import { RepositoryListComponent } from "./components/repository/repository-list.component";
import { TopHoldingsComponent } from "./components/reports/top-holdings.report";
import { AddUserComponent } from "./components/user/add-user.component";
import { UserDetailsComponent } from "./components/user/user-details.component";
import { UserListComponent } from "./components/user/user-list.component";
import { BlockCutCopyPasteDirective } from "./directives/block-cutcopypaste.directive";
import { CheckPermissionDirective } from "./directives/check-permission.directive";
import { DatePicker } from "./directives/datepicker.directive";
import { CustomRequiredValidator } from "./directives/required.directive";
import { CustomBusinessNameValidator } from "./directives/validate-businessname";
import { CustomEmailValidator } from "./directives/validate-email.directive";
import { NumberOnlyDirective } from "./directives/validate-numbers.directive";
import {
  ComparePassword,
  PasswordValidator,
} from "./directives/validate-password.directive";
import {
  GreaterValidator,
  SmallerValidator,
} from "./directives/validate-range.directive";
import { InputValidatorDirective } from "./directives/validate-special-characters.directive";
import { CustomURLValidator } from "./directives/validate-url.directive";
import { AuthGuard } from "./guards/auth.guard";
import { HttpServiceInterceptor } from "./interceptors/http-service-interceptor"; // response interceptor
import { EnumKeyValueListPipe } from "./pipes/enumlist.pipe";
import {
  FormatNumbersPipe,
  MinusSignToBracketsPipe,
} from "./pipes/minus-sign-to-brackets";
import { SumPipe } from "./pipes/sum.pipe";
import { AccountService } from "./services/account.service";
import { AlertService } from "./services/alert.service";
import { CashflowService } from "./services/cashflow.service";
import { DealService } from "./services/deal.service";
import { FileUploadService } from "./services/file-upload.service";
import { FirmService } from "./services/firm.service";
import { FundService } from "./services/funds.service";
import { MiscellaneousService } from "./services/miscellaneous.service";
import { PermissionService } from "./services/permission.service";
import { PipelineService } from "./services/pipeline.service";
import { PortfolioCompanyService } from "./services/portfolioCompany.service";
import { ReportService } from "./services/report.service";
import { AddRepositoryComponent } from "./components/repository/add-repository.component";
import { DndDirective } from "./directives/dnd.directive";
import { DocumentsTableComponent } from "./components/documents-table/documents-table.component";
import { DocumentService } from "./services/document.service";
import { ToastrModule, ToastContainerModule } from "ngx-toastr";
import { OpenDocumentComponent } from "./components/open-document/open-document.component";
import { ModalModule } from "ngx-bootstrap/modal";
import { ProgressComponent } from "./components/progress/progress.component";

import { Button } from "./../../projects/ng-neptune/src/lib/Button/button.component";
import { Alert } from "./../../projects/ng-neptune/src/lib/Alert/alter.component";
import { Toast } from "./../../projects/ng-neptune/src/lib/Toast/toast.component";
import { FilterService } from "./services/filter.services";

import { Table } from "./../../projects/ng-neptune/src/lib/Table/table.component";
import { ConfirmModalComponentComponent } from "./../../projects/ng-neptune/src/lib//confirm-modal-component/confirm-modal.component";
import { PopoverComponentComponent } from "./../../projects/ng-neptune/src/lib/popover-component/popover.component";
import { AdvanceFiltersComponentComponent } from "./components/advance-filters-component/advance-filters.component";
import { CheckboxComponentComponent } from "./../../projects/ng-neptune/src/lib//checkbox-component/checkbox.component";
import { InputComponent } from "./../../projects/ng-neptune/src/lib//Input/input.component";

@NgModule({
  declarations: [
    UpdateInfoSectionComponent,
    GroupListComponent,
    AppComponent,
    MasterComponent,
    NavMenuComponent,
    FundListComponent,
    UserListComponent,
    PortfolioCompanyListComponent,
    AddPortfolioCompanyComponent,
    DynamicQueriesListComponent,
    HomeComponent,
    LoginComponent,
    AddFundComponent,
    AddQueryComponent,
    AddUserComponent,
    PasswordValidator,
    ComparePassword,
    CustomEmailValidator,
    CustomRequiredValidator,
    CustomURLValidator,
    FieldErrorDisplayComponent,
    NumberOnlyDirective,
    AddFirmComponent,
    FirmListComponent,
    LocationControlComponent,
    FirmDetailsComponent,
    FundDetailsComponent,
    PortfolioCompanyDetailComponent,
    TopHoldingsComponent,
    TypeAheadControlComponent,
    FilterControlComponent,
    CommentControlComponent,
    TooltipControlComponent,
    InputValidatorDirective,
    CustomBusinessNameValidator,
    AddFundTrackRecordComponent,
    lineChartComponent,
    multilineChartComponent,
    EnumKeyValueListPipe,
    SumPipe,
    MinusSignToBracketsPipe,
    FormatNumbersPipe,
    AddGroupComponent,
    SaveDealComponent,
    DealListComponent,
    DealDetailsComponent,
    SavePortfolioFundHoldingComponent,
    SavePortfolioProfitabilityComponent,
    CheckPermissionDirective,
    SavePortfolioOperationalKPIComponent,
    multilinePointChartComponent,
    AddPipelineComponent,
    PipelineListComponent,
    HoldingValuesComponent,
    AttributionReportsComponent,
    ReportsComponent,
    RepositoryListComponent,
    lineBarChartComponent,
    pieBarChartComponent,
    DatePicker,
    ChartComponent,
    JSChartComponent,
    BarChartComponent,
    BubbleChartComponent,
    DonutChartComponent,
    HorizontalNavBarComponent,
    GroupDetailsComponent,
    BulkUploadComponent,
    BlockCutCopyPasteDirective,
    CashflowlListComponent,
    CashflowComponent,
    CompanyFinancialsReportComponent,
    SmallerValidator,
    GreaterValidator,
    PipelineDetailsComponent,
    UserDetailsComponent,
    ResetPasswordComponent,
    ResetPasswordControl,
    GraphChartComponent,
    Pie3DChartComponent,
    PortfolioCompanyFinancialsReportComponent,
    PortfolioCompanyDataExtractionComponent,
    AddRepositoryComponent,
    DocumentsTableComponent,
    DndDirective,
    OpenDocumentComponent,
    ProgressComponent,
    ConfirmModalComponentComponent,
    Button,
    Alert,
    Toast,
    PopoverComponentComponent,
    AdvanceFiltersComponentComponent,
    CheckboxComponentComponent,
    Table,
    InputComponent,
  ],
  entryComponents: [
    UpdateInfoSectionComponent,
    AddFundTrackRecordComponent,
    AddFundComponent,
    SavePortfolioFundHoldingComponent,
    SavePortfolioProfitabilityComponent,
    SavePortfolioOperationalKPIComponent,
    DonutChartComponent,
    LocationControlComponent,
    AddQueryComponent,
  ],
  imports: [
    EditorModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    SelectButtonModule,
    TreeModule,
    TreeTableModule,
    InputSwitchModule,
    RadioButtonModule,
    CheckboxModule,
    ProgressBarModule,
    GrowlModule,
    BlockUIModule,
    MenuModule,
    TableModule,
    DataTableModule,
    PaginatorModule,
    AngularFontAwesomeModule,
    NgxSpinnerModule,
    MasterModule,
    CommonModule,
    HttpModule,
    FormsModule,
    ConfirmDialogModule,
    AccordionModule,
    ReactiveFormsModule,
    BrowserModule,
    MessagesModule,
    MessagesModule,
    // NgbModule,
    NgbModule.forRoot(),

    CalendarModule,
    AutoCompleteModule,
    MultiSelectModule,
    OverlayPanelModule,
    HttpClientModule,
    ToastModule,
    DialogModule,
    AngularResizedEventModule,
    FileUploadModule,
    ProgressBarModule,
    SplitButtonModule,
    ToastrModule.forRoot({
      positionClass: "inline",
      timeOut: 5000,
      preventDuplicates: true,
      closeButton: true,
    }),
    ToastContainerModule,
    ModalModule.forRoot(),
  ],
  bootstrap: [AppComponent],
  providers: [
    CashflowService,
    FileUploadService,
    PipelineService,
    PermissionService,
    FundService,
    AccountService,
    FirmService,
    PortfolioCompanyService,
    AlertService,
    AuthGuard,
    MiscellaneousService,
    NgbActiveModal,
    DealService,
    ReportService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpServiceInterceptor,
      multi: true,
    },
    DocumentService,
    FilterService,
  ],
})
export class AppModule {}

export function getBaseUrl() {
  return environment.apiBaseUrl;
}
