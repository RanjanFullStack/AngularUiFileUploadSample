import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";

@Component({
  selector: "nep-input",
  templateUrl: "./input.component.html",
  styleUrls: ["./input.component.css"],
})
export class InputComponent implements OnInit {
  @Input() placeholder: string = "Input Something";
  @Input() inputstyle: string = "";
  @Input() value: string = "";
  @Output() keyup: EventEmitter<any> = new EventEmitter();
  constructor() {}
  ngOnInit() {}
  getStyleClass() {
    return {
      "nep-input": true,
      "nep-input-bottom-border": this.inputstyle === "outlined",
    };
  }
}
