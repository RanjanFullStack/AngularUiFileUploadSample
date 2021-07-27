import {
  Component,
  Input,
  Output,
  EventEmitter,
  ElementRef,
  AfterViewInit,
} from "@angular/core";

@Component({
  selector: "nep-alert",
  templateUrl: "./alter.component.html",
})
export class Alert implements AfterViewInit {
  constructor(public el: ElementRef) {}
  @Input() type: String = "";
  @Output() OnClose: EventEmitter<any> = new EventEmitter();

  getStyleClass() {
    let example = this.el.nativeElement.className;
    return {
      "nep-alert": true,
      "nep-alert-success": this.type === "success",
      "nep-alert-info": this.type === "info",
      "nep-alert-warning": this.type === "warning",
      "nep-alert-danger": this.type === "danger",
      example: true,
    };
  }
  ngAfterViewInit(): void {
  }
  Close() {
    this.OnClose.emit();
  }
}
