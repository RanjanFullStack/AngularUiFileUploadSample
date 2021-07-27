import { HttpClient } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { throwError } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { AccountService } from "./account.service";

@Injectable()
export class PipelineService {
  myAppUrl: string = "";
  constructor(
    private _http: HttpClient,
    @Inject("BASE_URL") baseUrl: string
  ) {
    this.myAppUrl = baseUrl;
  }

  createPipeline(pipelineModel: any) {
    return this._http
      .post<any>(this.myAppUrl + "api/pipeline/add", pipelineModel)
      .pipe(
        map((response) => response),
        catchError(this.errorHandler)
      );
  }

  updatePipeline(pipelineModel: any) {
    return this._http
      .post<any>(this.myAppUrl + "api/pipeline/add", pipelineModel)
      .pipe(
        map((response) => response),
        catchError(this.errorHandler)
      );
  }
  getPipelineById(pipelineId: any) {
    return this._http
      .post<any>(this.myAppUrl + "api/pipeline/getbyid", pipelineId)
      .pipe(
        map((response) => response),
        catchError(this.errorHandler)
      );
  }

  getPipelineList(filter: any) {
    return this._http
      .post<any>(this.myAppUrl + "api/pipeline/get", filter)
      .pipe(
        map((response) => response),
        catchError(this.errorHandler)
      );
  }

  exportPipelineList(filter: any) {
    return this._http
      .post(this.myAppUrl + "api/pipeline/export", filter, {
        responseType: "blob",
        observe: "response",
      })
      .pipe(catchError(this.errorHandler));
  }

  getMasterData() {
    return this._http.get<any>(this.myAppUrl + "api/pipeline/getmaster").pipe(
      map((response) => response),
      catchError(this.errorHandler)
    );
  }

  getFundListByFirmnId(firmId: any) {
    return this._http
      .post<any>(this.myAppUrl + "api/pipeline/getfundbyfirm", {
        value: "" + firmId + "",
      })
      .pipe(
        map((response) => response),
        catchError((error) => this.errorHandler(error))
      );
  }

  errorHandler(error: any) {
    return throwError(error);
  }
}
