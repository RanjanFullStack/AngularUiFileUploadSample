import { HttpClient } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { throwError } from "rxjs";
import { catchError, map } from "rxjs/operators";


@Injectable()
export class FirmService {
  myAppUrl: string = "";
  router: Router;

  constructor(private http: HttpClient, @Inject("BASE_URL") baseUrl: string) {
    this.myAppUrl = baseUrl;
  }

  addFirm(firm: any) {
    return this.http.post<any>(this.myAppUrl + "api/firm/add", firm).pipe(
      map((response) => response),
      catchError(this.errorHandler)
    );
  }

  updateFirm(firm: any) {
    return this.http.post<any>(this.myAppUrl + "api/updatefirm", firm).pipe(
      map((response) => response),
      catchError(this.errorHandler)
    );
  }

  getMasterFirmModel() {
    return this.http.get<any>(this.myAppUrl + "api/firm/mastermodel").pipe(
      map((response) => response),
      catchError(this.errorHandler)
    );
  }

  getFirmList(filter: any) {
    return this.http.post<any>(this.myAppUrl + "api/firm/get", filter).pipe(
      map((response) => response),
      catchError((error) => this.errorHandler(error))
    );
  }

  getFirmById(firmId: any) {
    return this.http.post<any>(this.myAppUrl + "api/firm/getbyid", firmId).pipe(
      map((response) => response),
      catchError((error) => this.errorHandler(error))
    );
  }

  exportFirmList(filter: any) {
    return this.http
      .post(this.myAppUrl + "api/Firms/Export", filter, {
        responseType: "blob",
        observe: "response",
      })
      .pipe(catchError(this.errorHandler));
  }

  errorHandler(error: any) {
    return throwError(error);
  }
}
