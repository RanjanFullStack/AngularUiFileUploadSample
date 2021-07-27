import {
  Directive,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  Renderer,
} from "@angular/core";
declare var jQuery: any;
@Directive({
  selector: "[jqDatepicker]",
})
export class DatePicker {
  @Input() value = "";
  @Input() minimumDate: boolean = false;
  @Input() onlyDatePicker: boolean = false;
  @Output() dateChange = new EventEmitter();

  constructor(public el: ElementRef, public renderer: Renderer) {}
  ngOnInit() {
    if (this.onlyDatePicker === true) {
      jQuery(this.el.nativeElement)
        .datepicker({
          controlType: "select",
          oneLine: true,
          minDate: this.minimumDate === false ? "" : new Date(),
          onSelect: (value: any) => {
            this.value = value;
            this.dateChange.next(value);
          },
        })
        .datepicker("setDate", this.value);
    } else {
      jQuery(this.el.nativeElement)
        .datetimepicker({
          controlType: "select",
          oneLine: true,
          timeFormat: "hh:mm tt",
          minDate: this.minimumDate === false ? "" : new Date(),
          onSelect: (value: any) => {
            this.value = value;
            this.dateChange.next(value);
          },
        })
        .datepicker("setDate", this.value);
    }
  }
}
