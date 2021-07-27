import { Component, OnInit } from "@angular/core";

@Component({
  selector: "ng-panel",
  template: `
    <div class="nep-panel">
      <ng-content></ng-content>
    </div>
  `,
  styles: [],
})
export class Panel implements OnInit {
  constructor() {}

  ngOnInit() {}
}
