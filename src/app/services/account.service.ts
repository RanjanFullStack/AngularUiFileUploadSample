import { HttpClient } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { Router } from "@angular/router";
import * as moment from "moment";
import { throwError } from "rxjs";
import { catchError, map } from "rxjs/operators";

@Injectable()
export class AccountService {
  myAppUrl: string = "";
  router: Router;

  constructor(
    private http: HttpClient,
    @Inject("BASE_URL") baseUrl: string
  ) {
    this.myAppUrl = baseUrl;
  }

  authenticateUser(login: any) {
    return this.http.post<any>(this.myAppUrl + "api/login", login).pipe(
      map((response) => response),
      catchError(this.errorHandler)
    );
  }

  login(login: any) {
    login.refreshToken = "";
    login.grantType = "password";

    return this.http.post<any>(this.myAppUrl + "api/login", login).pipe(
      map((response) => {
        let user = response["body"];
        if (user && user.accessToken) {
          this.setSession(user);
        }
        return user;
      })
    );
  }

  refreshToken() {
    let refreshData: any = {};
    let currentUser = JSON.parse(localStorage.getItem("currentUser") + "");
    if (currentUser && currentUser.refreshToken) {
      refreshData.refreshToken = currentUser.refreshToken;
      refreshData.grantType = "refresh_token";
      refreshData.email = currentUser.username;
    }

    return this.http
      .post<any>(this.myAppUrl + "api/authenticate", refreshData)
      .pipe(
        map(
          (response) => {
            let user = response;
            if (user && user.accessToken) {
              this.setSession(user);
            }
          },
          catchError((error) => this.errorHandler(error))
        )
      );
  }

  private setSession(authResult: any) {
    const expiresAt = moment().add(authResult.expiresIn, "minute");

    localStorage.setItem("currentUser", JSON.stringify(authResult));
    localStorage.setItem(
      "userPermissions",
      JSON.stringify(authResult.permissions)
    );
    localStorage.setItem("expires_at", JSON.stringify(expiresAt.valueOf()));
  }

  public isLoggedIn() {
    const expiration = localStorage.getItem("expires_at");
    if (expiration != null) {
      const expiresAt = JSON.parse(expiration);
      return moment().isBefore(moment(expiresAt));
    }
    return false;
  }

  isLoggedOut() {
    return !this.isLoggedIn();
  }

  logout() {
    localStorage.removeItem("currentUser");
  }

  addUser(user: any) {
    return this.http
      .post<any>(this.myAppUrl + "api/user/add-or-update", user)
      .pipe(
        map((response) => response),
        catchError(this.errorHandler)
      );
  }

  updateUser(user: any) {
    return this.http
      .post<any>(this.myAppUrl + "api/user/add-or-update", user)
      .pipe(
        map((response) => response),
        catchError(this.errorHandler)
      );
  }

  getUserById(userId: any) {
    return this.http.post<any>(this.myAppUrl + "api/user/getbyid", userId).pipe(
      map((response) => response),
      catchError(this.errorHandler)
    );
  }

  getUserList(filter: any) {
    return this.http.post<any>(this.myAppUrl + "api/user/get", filter).pipe(
      map((response) => response),
      catchError(this.errorHandler)
    );
  }

  getUserListForGroup(filter: any) {
    return this.http.post<any>(this.myAppUrl + "api/user/get", filter).pipe(
      map((response) => response),
      catchError(this.errorHandler)
    );
  }
  resetPassword(resetPasswordModel: any) {
    return this.http
      .post<any>(this.myAppUrl + "api/user/resetpassword", resetPasswordModel)
      .pipe(
        map((response) => response),
        catchError(this.errorHandler)
      );
  }

  exportUserList(filter: any) {
    return this.http
      .post(this.myAppUrl + "api/user/export", filter, {
        responseType: "blob",
        observe: "response",
      })
      .pipe(catchError(this.errorHandler));
  }

  errorHandler(error: Response) {
    return throwError(error);
  }

  redirectToLogin(error: any) {
    if (error.status == 401 || error.status == 403) {
      this.router.navigate(["/login"]);
    }
  }

  getToken() {
    let currentUser = JSON.parse(localStorage.getItem("currentUser") + "");
    if (currentUser && currentUser.accessToken) {
      return currentUser.accessToken;
    }
    return "";
  }

  public getAlertMessageTime() {
    return 10000;
  }
}
