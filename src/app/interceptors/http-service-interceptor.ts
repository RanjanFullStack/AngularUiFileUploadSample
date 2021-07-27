import { Injectable, Inject } from "@angular/core";
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpResponse,
  HttpErrorResponse,
} from "@angular/common/http";
import { DOCUMENT } from "@angular/common";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/do";
import { AccountService } from "../services/account.service";

@Injectable()
export class HttpServiceInterceptor implements HttpInterceptor {
  myAppUrl: string = "";
  constructor(
    @Inject(DOCUMENT) private document: any,
    private accountService: AccountService,
    @Inject("BASE_URL") baseUrl: string
  ) {
    this.myAppUrl = baseUrl;
  }
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${this.accountService.getToken()}`,
      },
    });

    return next.handle(req).do(
      (event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          return event;
        }
      },
      (err) => {
        if (err instanceof HttpErrorResponse) {
          if (err.status === 401 || err.status === 403) {
            this.accountService.redirectToLogin(err);
          } else {
            return err;
          }
        }
      }
    );
  }
}
