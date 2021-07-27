import { Component, AfterViewInit, ElementRef } from "@angular/core";
@Component({ selector: "nep-message", templateUrl: "./toast.component.html" })
export class Toast implements AfterViewInit {
  constructor(public el: ElementRef) {}
  ngAfterViewInit(): void {
  }
  Visible: boolean = true;
  Close() {
    this.Visible = false;
  }
}
