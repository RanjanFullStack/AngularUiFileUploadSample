import { Injectable } from "@angular/core";
import {
  Router,
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlSegment,
} from "@angular/router";
import { AccountService } from "../services/account.service";
import { PermissionService } from "../services/permission.service";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private accountService: AccountService,
    private permissionService: PermissionService
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (localStorage.getItem("currentUser")) {
      var isLoggedIn = this.accountService.isLoggedIn();
      if (isLoggedIn) {
        if (route.url != null && route.url.length > 0) {
          let url = "";
          route.url.forEach(function (val: UrlSegment) {
            url += "/" + val.path;
          });
          var isAllowed = this.checkPermission(url);
          if (!isAllowed) {
            this.router.navigate(["/login"], { queryParams: {} });
            return false;
          }
        }

        return true;
      } else {
        this.router.navigate(["/login"], {
          queryParams: { returnUrl: state.url },
        });
        return false;
      }
    }

    this.router.navigate(["/login"], { queryParams: { returnUrl: state.url } });
    return false;
  }

  checkPermission(url: any) {
    if (url == "" || url == "/home") {
      return true;
    }
    let navItem = this.permissionService.navigationItems.filter(function (
      ele: any,
      i: any
    ) {
      return ele.url == url;
    });
    if (navItem.length <= 0) {
      navItem = this.permissionService.navigationItems.filter(function (
        ele: any,
        i: any
      ) {
        let segments = url.split("/");
        segments.pop();
        segments.splice(0, 1);
        return ele.url == "/" + segments.join("/") + "/:id";
      });
    }
    if (navItem.length > 0) {
      return this.permissionService.checkFeaturePermission(navItem[0].feature);
    }
    return false;
  }
}
