import { Directive, ElementRef, Input, OnInit } from "@angular/core";
import { PermissionService, FeaturesEnum } from "../services/permission.service";

@Directive({
    selector: '[hideIfUnauthorized]'
})
export class CheckPermissionDirective implements OnInit {
    @Input('hideIfUnauthorized') permission: FeaturesEnum; 
    constructor(private el: ElementRef, private permissionService: PermissionService) { }
    ngOnInit() {
        
		if (!this.permissionService.checkFeaturePermission(this.permission)) {
			if (this.el.nativeElement.className == "click-view") {
				this.el.nativeElement.style.pointerEvents = 'none'

			} else {
				this.el.nativeElement.style.display = 'none';
			}

		}
    }
}