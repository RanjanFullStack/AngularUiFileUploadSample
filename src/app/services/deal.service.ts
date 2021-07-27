import { Injectable, Inject } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { map, catchError } from "rxjs/operators";
import { HttpClient } from "@angular/common/http";

@Injectable()
export class DealService {
  myAppUrl: string = "";
  constructor(private http: HttpClient, @Inject("BASE_URL") baseUrl: string) {
    this.myAppUrl = baseUrl;
  }

  getDealsList(filter: any): Observable<any> {
    return this.http.post<any>(this.myAppUrl + "api/Deals/Get", filter).pipe(
      map((response: any) => response),
      catchError(this.errorHandler)
    );
  }

  getPortfolioCompanyFundHolding(filter: any) {
    return this.http
      .post<any>(
        this.myAppUrl + "api/Deals/GetPortfolioCompanyFundHolding",
        filter
      )
      .pipe(
        map((response: any) => response),
        catchError(this.errorHandler)
      );
  }

  saveDeal(dealDetail: any) {
    return this.http
      .post<any>(this.myAppUrl + "api/Deals/Save", dealDetail)
      .pipe(
        map((response: any) => response),
        catchError(this.errorHandler)
      );
  }

  savePortfolioCompanyFundHolding(portfolioCompanyFundHolding: any) {
    return this.http
      .post<any>(
        this.myAppUrl + "api/Deals/SavePortfolioCompanyFundHolding",
        portfolioCompanyFundHolding
      )
      .pipe(
        map((response: any) => response),
        catchError(this.errorHandler)
      );
  }

  getMasterDealModel() {
    return this.http.get<any>(this.myAppUrl + "api/deal/master-data").pipe(
      map((response: any) => response),
      catchError(this.errorHandler)
    );
  }

  GetMasterPortfolioFundHoldingModel() {
    return this.http
      .get<any>(this.myAppUrl + "api/master/FundHoldingStatus/get")
      .pipe(
        map((response: any) => response),
        catchError(this.errorHandler)
      );
  }

  exportDealList(filter: any) {
    return this.http
      .post(this.myAppUrl + "api/Deals/Export", filter, {
        responseType: "blob",
        observe: "response",
      })
      .pipe(catchError(this.errorHandler));
  }

  errorHandler(error: any) {
    return throwError(error);
  }
}
