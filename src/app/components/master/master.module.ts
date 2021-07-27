import { CommonModule } from "@angular/common";
import {
  Component,
  ElementRef,
  Injectable,
  Input,
  NgModule,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from "@angular/core";
import {
  NavigationEnd,
  NavigationStart,
  Router,
  RouterModule,
} from "@angular/router";
import { Observable, Subject, Subscription } from "rxjs";
import { PermissionService } from "../../services/permission.service";

export interface ContentDescriptor {
  placeholder: string;
  elementRef: ElementRef;
}

@Injectable()
export class ContentService {
  private contentInit$ = new Subject<ContentDescriptor>();

  contentInit(): Observable<ContentDescriptor> {
    return this.contentInit$.asObservable();
  }

  registerContent(content: ContentDescriptor) {
    this.contentInit$.next(content);
  }
}

@Component({
  selector: "my-content",
  template: "<ng-content></ng-content>",
})
export class ContentComponent {
  @Input() placeholder: string;

  constructor(
    private elementRef: ElementRef,
    private contentService: ContentService
  ) {}

  ngOnInit() {
    this.contentService.registerContent({
      placeholder: this.placeholder,
      elementRef: this.elementRef,
    });
  }
}

@Component({
  selector: "my-placeholder",
  template: "<ng-content></ng-content>",
})
export class PlaceholderComponent {
  @Input() name: string;

  private subscription: Subscription;

  constructor(
    private containerRef: ViewContainerRef,
    private contentService: ContentService
  ) {
    this.subscription = contentService
      .contentInit()
      .subscribe((content: ContentDescriptor) => {
        if (content.placeholder == this.name) {
          this.containerRef.clear();
          this.containerRef.element.nativeElement.appendChild(
            content.elementRef.nativeElement
          );
        }
      });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}

@Component({
  selector: "app-breadcrumb",
  templateUrl: "breadcrumb.component.html",
})
export class BreadcrumbComponent implements OnInit {
  @Input() name: string;
  @ViewChild("navBreadcrumb") navBreadcrumb: ElementRef;

  private subscription: Subscription;

  links: any[] = [];
  currentItem: any = null;

  constructor(
    private router: Router,
    private permissionService: PermissionService
  ) {
    this.subscription = router.events.subscribe((event: any) => {
      if (event instanceof NavigationStart) {
        let prevUrl: any =
          localStorage.getItem("currentURL") != null
            ? localStorage.getItem("currentURL")
            : "";
        if (prevUrl != null && prevUrl != "") {
          localStorage.setItem("previousURL", prevUrl);
        }
      }

      if (event instanceof NavigationEnd) {
        let local = this;

        localStorage.setItem("currentURL", event.url);
        let navItem = this.permissionService.navigationItems.filter(function (
          ele: any,
          i: any
        ) {
          return ele.url == event.url;
        });
        if (navItem.length <= 0) {
          navItem = this.permissionService.navigationItems.filter(function (
            ele: any,
            i: any
          ) {
            let segments = event.url.split("/");
            segments.pop();
            segments.splice(0, 1);
            return ele.url == "/" + segments.join("/") + "/:id";
          });
        }
        if (navItem.length > 0) {
          let parentItems = local.getAllNavItemsInHierarchy(navItem[0].parent);
          if (parentItems.length > 0) {
            if (
              localStorage.getItem("currentURL") ==
              localStorage.getItem("previousURL")
            ) {
              localStorage.setItem("previousURL", parentItems[0].url);
            }
            local.links = parentItems;
          }
          this.currentItem = navItem[0];
        }
      }
    });
  }

  ngOnInit() {}

  getAllNavItemsInHierarchy(id: any) {
    let items: any[] = [];
    if (id != "") {
      let item = this.permissionService.navigationItems.filter(function (
        ele: any,
        i: any
      ) {
        return ele.id == id;
      });
      if (item.length > 0) {
        if (item[0].parent != "") {
          items = items.concat(this.getAllNavItemsInHierarchy(item[0].parent));
        }
        items.push(item[0]);
      }
    }
    return items;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}

@NgModule({
  imports: [RouterModule, CommonModule],
  declarations: [PlaceholderComponent, ContentComponent, BreadcrumbComponent],
  exports: [PlaceholderComponent, ContentComponent, BreadcrumbComponent],
  providers: [ContentService],
})
export class MasterModule {}
