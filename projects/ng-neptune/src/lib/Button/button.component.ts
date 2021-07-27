import { Component, Input, OnInit, Output, EventEmitter } from "@angular/core";

@Component({
  selector: "nep-button",
  templateUrl: "./button.component.html",
  styleUrls: ["./button.component.scss"],
})
export class Button implements OnInit {
  @Input() Type: String = "";
  @Input() disabled: boolean = false;
  ngOnInit(): void {}
  @Output() onClick: EventEmitter<any> = new EventEmitter();
  @Output() onFocus: EventEmitter<any> = new EventEmitter();
  @Output() onBlur: EventEmitter<any> = new EventEmitter();

  getStyleClass() {
    return {
      "nep-button": true,
      "btn-space": true,
      "nep-button-primary": this.Type === "Primary",
      "nep-button-secondary": this.Type === "Secondary",
    };
  }
}
