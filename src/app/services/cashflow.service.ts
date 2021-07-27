import { Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { Inject } from "@angular/core";
import { map, catchError } from "rxjs/operators";

export class CashflowService {
  myAppUrl: string = "";
  router: Router;
  constructor(private http: HttpClient, @Inject("BASE_URL") baseUrl: string) {
    this.myAppUrl = baseUrl;
  }

  getCashflowFileList(filter: any): Observable<any> {
    return this.http
      .post<any>(this.myAppUrl + "api/cashflow/files/get", filter)
      .pipe(
        map((response: any) => response),
        catchError(this.errorHandler)
      );
  }

  getCashFlowDeatils(fileId: any): Observable<any> {
    return this.http
      .post<any>(this.myAppUrl + "api/cashflow/getbyid", fileId)
      .pipe(
        map((response) => response),
        catchError((error) => this.errorHandler(error))
      );
  }

  saveCashflowData(cashFlowId: any) {
    return this.http
      .post<any>(this.myAppUrl + "api/cashflow/save", cashFlowId)
      .pipe(
        map((response: any) => response),
        catchError((error) => this.errorHandler(error))
      );
  }

  downloadCashflowFile(FileUploadDetails: any) {
    return this.http
      .post(this.myAppUrl + "api/cashflow/export", FileUploadDetails, {
        responseType: "blob",
        observe: "response",
      })
      .pipe(catchError(this.errorHandler));
  }

  exportCashflowData(filter: any) {
    return this.http
      .post(this.myAppUrl + "api/cashflow/exportdata", filter, {
        responseType: "blob",
        observe: "response",
      })
      .pipe(catchError(this.errorHandler));
  }

  errorHandler(error: any) {
    return throwError(error);
  }
}
