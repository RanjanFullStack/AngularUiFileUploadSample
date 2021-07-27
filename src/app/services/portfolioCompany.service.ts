import { HttpClient } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { throwError } from "rxjs";
import { catchError, map } from "rxjs/operators";

@Injectable()
export class PortfolioCompanyService {
  myAppUrl: string = "";
  router: Router;

  constructor(private _http: HttpClient, @Inject("BASE_URL") baseUrl: string) {
    this.myAppUrl = baseUrl;
  }

  pdfExport(formData: any) {
    console.log(formData);
    return this._http
      .post(this.myAppUrl + "api/company/pdf", formData, {
        responseType: "blob",
        observe: "response",
      })
      .pipe(
        map((response) => response),
        catchError(this.errorHandler)
      );
  }

  addPortfolioCompany(portfoliocompany: any) {
    return this._http
      .post<any>(this.myAppUrl + "api/portfolio-company/add", portfoliocompany)
      .pipe(
        map((response) => response),
        catchError(this.errorHandler)
      );
  }

  updatePortfolioCompany(portfoliocompany: any) {
    return this._http
      .post<any>(this.myAppUrl + "api/portfolio-company/add", portfoliocompany)
      .pipe(
        map((response) => response),
        catchError(this.errorHandler)
      );
  }

  getPortfolioCompanyList(filter: any) {
    return this._http
      .post<any>(this.myAppUrl + "api/portfoliocompany/get", filter)
      .pipe(
        map((response) => response),
        catchError((error) => this.errorHandler(error))
      );
  }
  getPortfolioCompanyProfitabilityList(filter: any) {
    return this._http
      .post<any>(
        this.myAppUrl + "api/portfoliocompany/getProfitability",
        filter
      )
      .pipe(
        map((response) => response),
        catchError((error) => this.errorHandler(error))
      );
  }

  getPortfolioCompanyById(id: any) {
    return this._http
      .post<any>(this.myAppUrl + "api/portfoliocompany/getbyid", id)
      .pipe(
        map((response) => response),
        catchError((error) => this.errorHandler(error))
      );
  }

  getMasterPCModel() {
    return this._http
      .get<any>(this.myAppUrl + "api/portfolio-company/master-model/get")
      .pipe(
        map((response) => response),
        catchError(this.errorHandler)
      );
  }
  savePortfolioProfitability(portfolioProfitability: any) {
    return this._http
      .post<any>(
        this.myAppUrl + "api/portfoliocompany/saveprofitability",
        portfolioProfitability
      )
      .pipe(
        map((response) => response),
        catchError(this.errorHandler)
      );
  }
  exportPortfolioCompanyList(filter: any) {
    return this._http
      .post(this.myAppUrl + "api/portfolio-company/export", filter, {
        responseType: "blob",
        observe: "response",
      })
      .pipe(catchError(this.errorHandler));
  }

  exportPortfolioCompanyKPIDataList() {
    return this._http
      .get(this.myAppUrl + "api/portfolio-company/kpi-data/export", {
        responseType: "blob",
        observe: "response",
      })
      .pipe(catchError(this.errorHandler));
  }
  
  exportProfitabilityList(filter: any) {
    return this._http
      .post(
        this.myAppUrl + "api/portfolio-company/profitability/export",
        filter,
        { responseType: "blob", observe: "response" }
      )
      .pipe(catchError(this.errorHandler));
  }
  getPortfolioCompanyOperationalKPIValues(filter: any) {
    return this._http
      .post<any>(
        this.myAppUrl + "api/portfoliocompany/getoperationalKPIValues",
        filter
      )
      .pipe(
        map((response) => response),
        catchError((error) => this.errorHandler(error))
      );
  }

  getPortfolioCompanyOperationalKPIValuesTranpose(filter: any) {
    return this._http
      .post<any>(
        this.myAppUrl + "api/portfoliocompany/getoperationalKPIValuesTranpose",
        filter
      )
      .pipe(
        map((response) => response),
        catchError((error) => this.errorHandler(error))
      );
  }

  SavePortfolioCompanyOperationalKPIValue(model: any) {
    return this._http
      .post<any>(
        this.myAppUrl + "api/portfolioCompany/SaveOperationalKPIValue",
        model
      )
      .pipe(
        map((response) => response),
        catchError(this.errorHandler)
      );
  }

  GetOperationalKPIList(portfolioCompanyId: any) {
    return this._http
      .post<any>(this.myAppUrl + "api/portfoliocompany/getoperationalKPI ", {
        value: portfolioCompanyId,
      })
      .pipe(
        map((response) => response),
        catchError(this.errorHandler)
      );
  }

  errorHandler(error: any) {
    return throwError(error);
  }

  redirectToLogin(error: any) {
    if (error.status == 401) {
      this.router.navigate(["/login"]);
    }
  }

  getPCBalanceSheetValues(filter: any) {
    return this._http
      .post<any>(
        this.myAppUrl + "api/portfolio-company/balance-sheet-value/get",
        filter
      )
      .pipe(
        map((response) => response),
        catchError((error) => this.errorHandler(error))
      );
  }
  getPCProfitAndLossValues(filter: any) {
    return this._http
      .post<any>(
        this.myAppUrl + "api/portfolio-company/profit-loss-value/get",
        filter
      )
      .pipe(
        map((response) => response),
        catchError((error) => this.errorHandler(error))
      );
  }
  getPCCashFlowValues(filter: any) {
    return this._http
      .post<any>(
        this.myAppUrl + "api/portfolio-company/cashflow-value/get",
        filter
      )
      .pipe(
        map((response) => response),
        catchError((error) => this.errorHandler(error))
      );
  }
  getSegmentTypeForFinancialsByCompanyID(filter: any) {
    return this._http
      .post<any>(
        this.myAppUrl + "api/getSegmentTypeForFinancialsByCompanyId",
        filter
      )
      .pipe(
        map((response) => response),
        catchError((error) => this.errorHandler(error))
      );
  }
  exportCompanyBalanceSheet(filter: any) {
    return this._http
      .post(
        this.myAppUrl + "api/portfolio-company/balance-sheet/export",
        filter,
        { responseType: "blob", observe: "response" }
      )
      .pipe(catchError(this.errorHandler));
  }
  exportCompanyProfitAndLoss(filter: any) {
    return this._http
      .post(
        this.myAppUrl + "api/portfolio-company/profit-loss/export",
        filter,
        { responseType: "blob", observe: "response" }
      )
      .pipe(catchError(this.errorHandler));
  }

  exportCompanyCashFlow(filter: any) {
    return this._http
      .post(this.myAppUrl + "api/portfolio-company/cashflow/export", filter, {
        responseType: "blob",
        observe: "response",
      })
      .pipe(catchError(this.errorHandler));
  }

  getPortfolioCompanyInvestmentKPIValues(filter: any) {
    return this._http
      .post<any>(
        this.myAppUrl + "api/portfolio-company/investment-kpi-value/get",
        filter
      )
      .pipe(
        map((response) => response),
        catchError((error) => this.errorHandler(error))
      );
  }
  getPCCompanyKPIValues(filter: any) {
    return this._http
      .post<any>(
        this.myAppUrl + "api/portfolio-company/company-kpi-value/get",
        filter
      )
      .pipe(
        map((response) => response),
        catchError((error) => this.errorHandler(error))
      );
  }
  getPortfolioCompanyImpactKPIValues(filter: any) {
    return this._http
      .post<any>(
        this.myAppUrl + "api/portfolio-company/impact-kpi-value/get",
        filter
      )
      .pipe(
        map((response) => response),
        catchError((error) => this.errorHandler(error))
      );
  }
  exportInvestmentKPIList(filter: any) {
    return this._http
      .post(
        this.myAppUrl + "api/portfolio-company/investment-kpi/export",
        filter,
        { responseType: "blob", observe: "response" }
      )
      .pipe(catchError(this.errorHandler));
  }
  exportImpactKPIList(filter: any) {
    return this._http
      .post(this.myAppUrl + "api/portfolio-company/impact-kpi/export", filter, {
        responseType: "blob",
        observe: "response",
      })
      .pipe(catchError(this.errorHandler));
  }
  exportCompanywiseKPIList(filter: any) {
    console.log(filter);
    return this._http
      .post(
        this.myAppUrl + "api/portfolio-company/company-kpi/export",
        filter,
        { responseType: "blob", observe: "response" }
      )
      .pipe(catchError(this.errorHandler));
  }
  saveCompanyCommentaryDetails(portfolioCompanyCommentaryDetailsModel: any) {
    return this._http
      .post<any>(
        this.myAppUrl + "api/portfolio-company/commentary/save",
        portfolioCompanyCommentaryDetailsModel
      )
      .pipe(
        map((response) => response),
        catchError(this.errorHandler)
      );
  }
  getPortfolioCompanyCommentarySections(filter: any) {
    return this._http
      .post<any>(
        this.myAppUrl + "api/portfolio-company/commentary-section/get",
        filter
      )
      .pipe(
        map((response) => response),
        catchError((error) => this.errorHandler(error))
      );
  }
}
