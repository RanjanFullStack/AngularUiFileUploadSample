import { Component, Input, OnInit, ViewChild, ElementRef, HostListener, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'popover',
  templateUrl: './popover.component.html',
  styleUrls: ['./popover.component.css']
})
export class PopoverComponentComponent implements OnInit {

  @Input() showPopoverArrow = false;
  @Input() marginLeft = "0";
  @Input() marginTop = "0";
  @Input() show = false;
  @ViewChild('popover') elementRef: ElementRef;
  @Input() predecessorId = "";
  @Output() onClosePopover = new EventEmitter<any>();

  constructor() { }

  ngOnInit() {
  }

  @HostListener('document:click', ['$event']) onDocumentClick(event) {
    if ((this.elementRef !== undefined && this.elementRef.nativeElement.contains(event.target)) || event.currentTarget.activeElement.id === this.predecessorId) {
      this.show = true;
    } else {
      this.show = false;
      this.onClosePopover.emit();
    }
  }

}
