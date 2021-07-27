import { HttpClient, HttpHeaders, HttpResponse } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { saveAs } from "file-saver";
import { throwError } from "rxjs";
import { catchError, map } from "rxjs/operators";

@Injectable()
export class DocumentService {
  myAppUrl: string = "";
  router: Router;

  constructor(private http: HttpClient, @Inject("BASE_URL") baseUrl: string) {
    this.myAppUrl = baseUrl;
  }

  getAllDocuments(term: string) {
    var condition = "";
    if (term !== undefined) {
      condition = "?terms=" + term;
    }
    return this.http.get<any>(this.myAppUrl + "api/documents" + condition).pipe(
      map((response) => response),
      catchError(this.errorHandler)
    );
  }

  getFolders() {
    return this.http.get<any>(this.myAppUrl + "api/folder/types").pipe(
      map((response) => response),
      catchError(this.errorHandler)
    );
  }

  getAllDocumentTypes(typeid: any) {
    return this.http
      .get<any>(this.myAppUrl + "api/document/types?DocumentTypeId=" + typeid)
      .pipe(
        map((response) => response),
        catchError(this.errorHandler)
      );
  }

  AddDocument(Document: any) {
    return this.http.post<any>(this.myAppUrl + "api/documents", Document).pipe(
      map((response) => response),
      catchError(this.errorHandler)
    );
  }

  VaidateDocExists(document: any) {
    return this.http
      .post<any>(this.myAppUrl + "api/vaidateDocExists", document)
      .pipe(
        map((response) => response),
        catchError(this.errorHandler)
      );
  }

  UploadFile(file: any) {
    return this.http.post<any>(this.myAppUrl + "api/file", file).pipe(
      map((response) => response),
      catchError(this.errorHandler)
    );
  }

  RequestDownload(id: any) {
    var url = this.myAppUrl + "api/file/" + id;
    return this.http.get(url, {
      responseType: "blob",
      observe: "response",
    });
  }

  downloadFile(response: HttpResponse<Blob>) {
    if (response.body != null) {
      let file = new Blob([response.body], {
        type: response.headers.get("content-type"),
      });
      let fileName = response.headers
        .get("content-disposition")
        .replace("attachment; filename=", "");
      saveAs(file, fileName);
    }
  }
  Suggest(term: string) {
    return this.http.get<any>(this.myAppUrl + "api/suggest?term=" + term).pipe(
      map((response) => response),
      catchError(this.errorHandler)
    );
  }

  DeleteFiles(fileNames: any) {
    return this.http.post<any>(this.myAppUrl + "api/delete", fileNames).pipe(
      map((response) => response),
      catchError(this.errorHandler)
    );
  }

  MoveToRecycleBin(documents: any) {
    const options = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
      body: documents,
    };
    return this.http
      .delete(this.myAppUrl + "api/documents", {
        ...options,
        responseType: "text",
      })
      .pipe(
        map((response) => response),
        catchError(this.errorHandler)
      );
  }

  errorHandler(error: any) {
    return throwError(error);
  }

  getDocumentByID(docid: any) {
    return this.http.get<any>(this.myAppUrl + "api/document/" + docid).pipe(
      map((response) => response),
      catchError(this.errorHandler)
    );
  }

  UpdatelDocument(id: any, Document: any) {
    return this.http.put<any>(this.myAppUrl + "api/" + id, Document).pipe(
      map((response) => response),
      catchError(this.errorHandler)
    );
  }

  GetAllFilterCategories() {
    return this.http
      .get<any>(this.myAppUrl + "api/GetAllFilterCategories")
      .pipe(
        map((response) => response),
        catchError(this.errorHandler)
      );
  }

  GetAllFileFormats() {
    return this.http.get<any>(this.myAppUrl + "api/GetAllFileFormats").pipe(
      map((response) => response),
      catchError(this.errorHandler)
    );
  }

  GetDocumentsByFilter(advFilters) {
    return this.http
      .post<any>(this.myAppUrl + "api/GetDocumentsByFilter", advFilters)
      .pipe(
        map((response) => response),
        catchError(this.errorHandler)
      );
  }

  getAllSubDocumentTypes() {
    return this.http
      .get<any>(this.myAppUrl + "api/GetAllSubDocumentTypes")
      .pipe(
        map((response) => response),
        catchError(this.errorHandler)
      );
  }
}
