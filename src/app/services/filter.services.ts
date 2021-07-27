import { HttpClient } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { map, catchError } from "rxjs/operators";
import { throwError } from "rxjs";

@Injectable()
export class FilterService {
  appUrl: string = "";
  constructor(private http: HttpClient, @Inject("BASE_URL") baseUrl: string) {
    this.appUrl = baseUrl;
  }

  getFilters() {
    return this.http.get<any>(this.appUrl + `api/report/filters`).pipe(
      map((response) => response),
      catchError(this.errorHandler)
    );
  }
  getFilter(filterId: number) {
    return this.http
      .get<any>(this.appUrl + `api/report/filters/${filterId}`)
      .pipe(
        map((response) => response),
        catchError(this.errorHandler)
      );
  }
  SaveFilter(filter: any) {
    return this.http.post<any>(this.appUrl + `api/report/filters`, filter).pipe(
      map((response) => response),
      catchError(this.errorHandler)
    );
  }
  UpdateFilter(filter: any) {
    return this.http.put<any>(this.appUrl + `api/report/filters/${filter.userReportId}`, filter).pipe(
      map((response) => response),
      catchError(this.errorHandler)
    );
  }
  DeleteFilter(userReportId: number) {
    return this.http
      .delete<any>(this.appUrl + `api/report/filters/${userReportId}`)
      .pipe(
        map((response) => response),
        catchError(this.errorHandler)
      );
  }
  errorHandler(error: any) {
    return throwError(error);
  }
}
