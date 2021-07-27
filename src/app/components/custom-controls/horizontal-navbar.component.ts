﻿import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  Input,
  OnChanges,
  Output,
  ViewChild,
} from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";

export interface SelectItemEvent {
  item: any;
}

@Component({
  selector: "horizontal-navbar",
  templateUrl: "./horizontal-navbar.component.html",
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => HorizontalNavBarComponent),
      multi: true,
    },
  ],
  styles: [
    `
    drag-scroll {
      height: 50px
      width: 100px
    }
    `,
  ],
})
export class HorizontalNavBarComponent
  implements ControlValueAccessor, OnChanges {
  componentRef: any;
  @Input("ngModel") model: any = {};
  @Input() itemList: any = [];
  @Input() displayField: string = "";
  @Input() resultField: string = "";
  showLeftScroll: boolean = false;
  showRightScroll: boolean = true;
  toggle: boolean = false;
  @ViewChild("panel", { read: ElementRef }) public panel: ElementRef<any>;

  @Output() selectItem = new EventEmitter<SelectItemEvent>();

  results: any;
  constructor(protected changeDetectorRef: ChangeDetectorRef) {}

  ngOnChanges() {
    setTimeout(
      function (local: any) {
        local.setScrollButtonVisibility();
      },
      1000,
      this
    );
  }

  selectionChanged() {
    this.propagateChange(this.model);
    this.selectItem.emit({ item: this.model });
  }

  writeValue(value: any) {}

  propagateChange = (_: any) => {};

  registerOnChange(fn: any) {
    this.propagateChange = fn;
  }

  registerOnTouched() {}

  moveLeft() {
    try {
      this.panel.nativeElement.scrollLeft.scrollTo({
        left: this.panel.nativeElement.scrollLeft - 300,
        top: 0,
        behavior: "smooth",
      });
    } catch {
      this.panel.nativeElement.scrollLeft =
        this.panel.nativeElement.scrollLeft - 300;
    }

    setTimeout(
      function (local: any) {
        local.setScrollButtonVisibility();
      },
      500,
      this
    );
  }

  moveRight() {
    let scroll = 300;
    let remainingScroll =
      this.panel.nativeElement.scrollWidth -
      (this.panel.nativeElement.offsetWidth +
        this.panel.nativeElement.scrollLeft);
    if (remainingScroll > scroll && remainingScroll < scroll * 2) {
      scroll = remainingScroll;
    }
    try {
      this.panel.nativeElement.scrollTo({
        left: this.panel.nativeElement.scrollLeft + scroll,
        top: 0,
        behavior: "smooth",
      });
    } catch {
      this.panel.nativeElement.scrollLeft =
        this.panel.nativeElement.scrollLeft + scroll;
    }

    setTimeout(
      function (local: any) {
        local.setScrollButtonVisibility();
      },
      500,
      this
    );
  }

  rightScrollTimer: any;
  leftScrollTimer: any;
  startLeftScrolling() {
    this.leftScrollTimer = setInterval(
      function (local: any) {
        local.moveLeft();
      },
      500,
      this
    );
  }
  startRightScrolling() {
    this.rightScrollTimer = setInterval(
      function (local: any) {
        local.moveRight();
      },
      500,
      this
    );
  }

  stopLeftScrolling() {
    clearInterval(this.leftScrollTimer);
  }
  stopRightScrolling() {
    clearInterval(this.rightScrollTimer);
  }

  setScrollButtonVisibility() {
    this.changeDetectorRef.detectChanges();
    if (
      this.panel.nativeElement.offsetWidth +
        this.panel.nativeElement.scrollLeft ==
      this.panel.nativeElement.scrollWidth
    ) {
      this.stopRightScrolling();
      this.showRightScroll = false;
    } else {
      this.showRightScroll = true;
    }
    if (this.panel.nativeElement.scrollLeft == 0) {
      this.stopLeftScrolling();
      this.showLeftScroll = false;
    } else {
      this.showLeftScroll = true;
    }
  }
}
