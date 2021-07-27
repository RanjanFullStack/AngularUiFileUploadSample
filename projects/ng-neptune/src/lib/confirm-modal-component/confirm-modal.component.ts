import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";

@Component({
  selector: "confirm-modal",
  templateUrl: "./confirm-modal.component.html",
  styleUrls: ["./confirm-modal.component.css"],
})
export class ConfirmModalComponentComponent implements OnInit {
  @Input() primaryButtonName: string;
  @Input() secondaryButtonName: string;
  @Input() modalTitle: string;
  @Input() modalBody1: string;
  @Input() modalBody2: string;
  @Input() IsPrimaryDisabled: boolean = false;
  @Output() primaryButtonEvent = new EventEmitter<any>();
  @Output() secondaryButtonEvent = new EventEmitter<any>();

  constructor() {}

  ngOnInit() {}

  onPrimaryEvent() {
    this.primaryButtonEvent.emit();
  }

  onSecondaryEvent() {
    this.secondaryButtonEvent.emit();
  }
}
