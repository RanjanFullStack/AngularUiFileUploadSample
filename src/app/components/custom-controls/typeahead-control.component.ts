﻿﻿import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  forwardRef,
  Input,
  Output,
  ViewChild,
} from "@angular/core";
import {
  ControlValueAccessor,
  FormControl,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
} from "@angular/forms";
import { MiscellaneousService } from "../../services/miscellaneous.service";

/**
 * Payload of the selectItem event.
 */
export interface TypeaheadSelectItemEvent {
  /**
   * An item about to be selected
   */
  item: any;
}

export interface TypeaheadClearItemEvent {
  /**
   * An item about to be cleared
   */
  item: any;
}

@Component({
  selector: "typeahead-control",
  templateUrl: "./typeahead-control.component.html",
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TypeAheadControlComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => TypeAheadControlComponent),
      multi: true,
    },
  ],
})
export class TypeAheadControlComponent implements ControlValueAccessor {
  @ViewChild("pAutoComplate") pAutoComplate: any;
  @Input("ngModel") location: any = {};

  @Input() isRequired: boolean = false;
  @Input() displayField: string = "";
  @Input() disabled: boolean = false;
  @Input() resultField: string = "";
  @Input() placeholder: string = "Select";
  @Input() loadingOptions: boolean = false;
  @Input() isAscendingOptions: boolean;
  @Input() isDecendingOptions: boolean;
  private _optionList: any[];

  get optionList(): any[] {
    return this._optionList;
  }

  @Input()
  set optionList(data: any[]) {
    let local = this;
    if (data != undefined) {
      if (this.isAscendingOptions == undefined) {
        this._optionList = this.miscService.sortArray(data, this.displayField);
      }
      if (this.isAscendingOptions) {
        this._optionList = this.miscService.sortArray(data, this.displayField);
      }
      if (this.isDecendingOptions) {
        this._optionList = this.miscService.sortArrayDesc(
          data,
          this.displayField
        );
      } else {
        this._optionList = data;
      }
    }
  }

  /**
   * An event emitted when a match is selected. Event payload is of type NgbTypeaheadSelectItemEvent.
   */
  @Output() selectItem = new EventEmitter<TypeaheadSelectItemEvent>();
  @Output() clearItem = new EventEmitter<TypeaheadClearItemEvent>();

  results: any;
  constructor(
    protected changeDetectorRef: ChangeDetectorRef,
    private miscService: MiscellaneousService
  ) {}

  search(event: any) {
    var prop = this.displayField;
    if (this.optionList != undefined && this.optionList != null) {
      this.results = this.optionList.filter(function (
        element: any,
        index: any
      ) {
        return (
          element[prop].toLowerCase().indexOf(event.query.toLowerCase()) > -1
        );
      });
    } else {
      this.results = [];
    }
  }
  onBlur() {
    if (
      this.location &&
      this.pAutoComplate.inputEL.nativeElement.value !=
        this.location[this.displayField]
    ) {
      this.onClear();
    }
  }
  onClear() {
    this.location = undefined;
    this.propagateChange(this.location);
    this.clearItem.emit({ item: undefined });
  }

  onLocationChange() {
    if (
      this.resultField != null &&
      this.resultField != undefined &&
      this.resultField != ""
    ) {
      this.propagateChange(this.location[this.resultField]);
      this.selectItem.emit({ item: this.location[this.resultField] });
      setTimeout(() => {
        this.writeValue(this.location);
      }, 0);
    } else {
      this.propagateChange(this.location);
      this.selectItem.emit({ item: this.location });
    }
  }

  writeValue(value: any) {
    if (value !== undefined && value != null) {
      if (
        this.resultField != null &&
        this.resultField != undefined &&
        this.resultField != ""
      ) {
        let prop = this.resultField;
        let result = this.optionList.filter(function (
          element: any,
          index: any
        ) {
          return (
            element[prop].toString().toLowerCase() ==
            value.toString().toLowerCase()
          );
        });
        if (result.length > 0) {
          this.location = result[0];
        }
      } else {
        this.location = value;
      }
    }
  }

  propagateChange = (_: any) => {};

  registerOnChange(fn: any) {
    this.propagateChange = fn;
  }

  registerOnTouched() {}

  validate(c: FormControl) {
    let isValid = true;
    if (this.isRequired && c.value == null) {
      isValid = false;
    } else {
      if (
        this.isRequired &&
        (c.value == undefined || c.value == "undefined" || c.value == "")
      ) {
        isValid = false;
      }
    }
    if (isValid) {
      return null;
    } else {
      return {
        validateRequired: {
          valid: false,
        },
      };
    }
  }
}
