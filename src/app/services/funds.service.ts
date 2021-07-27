import { HttpClient } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { Headers } from "@angular/http";
import { Router } from "@angular/router";
import { throwError } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { AccountService } from "./account.service";
@Injectable()
export class FundService {
  myAppUrl: string = "";
  constructor(private _http: HttpClient, @Inject("BASE_URL") baseUrl: string) {
    this.myAppUrl = baseUrl;
  }

  getFundsList(filter: any) {
    return this._http
      .post<any>(this.myAppUrl + "api/Funds/GetFunds", filter)
      .pipe(
        map((response) => response),
        catchError((error) => this.errorHandler(error))
      );
  }

  getFundNamesList(filter: any) {
    return this._http
      .post<any>(this.myAppUrl + "api/Funds/GetFundNames", filter)
      .pipe(
        map((response) => response),
        catchError((error) => this.errorHandler(error))
      );
  }

  getFundTrackRecordList(filter: any) {
    return this._http
      .post<any>(this.myAppUrl + "api/Funds/GetTrackRecordList", filter)
      .pipe(
        map((response) => response),
        catchError((error) => this.errorHandler(error))
      );
  }

  getFundById(fundId: any) {
    return this._http
      .post<any>(this.myAppUrl + "api/Funds/GetFunds", fundId)
      .pipe(
        map((response) => response),
        catchError((error) => this.errorHandler(error))
      );
  }

  createFund(fundDetail: any) {
    return this._http
      .post<any>(this.myAppUrl + "api/Funds/CreateFund", fundDetail)
      .pipe(
        map((response) => response),
        catchError(this.errorHandler)
      );
  }

  updateFund(fundDetail: any) {
    return this._http
      .post<any>(this.myAppUrl + "api/Funds/CreateFund", fundDetail)
      .pipe(
        map((response) => response),
        catchError(this.errorHandler)
      );
  }

  saveFundTrackRecord(fundTrackRecord: any) {
    return this._http
      .post<any>(
        this.myAppUrl + "api/Funds/SaveFundTrackRecord",
        fundTrackRecord
      )
      .pipe(
        map((response) => response),
        catchError(this.errorHandler)
      );
  }

  getMasterFundModel() {
    return this._http.get<any>(this.myAppUrl + "api/Funds/master-model").pipe(
      map((response) => response),
      catchError(this.errorHandler)
    );
  }

  exportFundList(filter: any) {
    return this._http
      .post(this.myAppUrl + "api/Funds/Export", filter, {
        responseType: "blob",
        observe: "response",
      })
      .pipe(catchError(this.errorHandler));
  }

  downloadFile(filter: any) {
    var headers = new Headers();
    headers.append("responseType", "arraybuffer");

    return this._http
      .post(this.myAppUrl + "api/Funds/Export", filter, {
        responseType: "blob",
        observe: "response",
      })
      .subscribe(
        (response) => {
          if (response.body != null) {
            let file = new Blob([response.body], {
              type:
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            });
            var header = response.headers.get("Content-Disposition");
            if (header != null) {
              let fileName = header.split(";")[1].trim().split("=")[1];
              saveAs(file, fileName);
            }
          }
        },
        (err) => this.errorHandler(err)
      );
  }

  errorHandler(error: any) {
    return throwError(error);
  }
}
