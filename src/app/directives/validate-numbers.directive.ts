import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
    selector: '[numberOnly]'
})
export class NumberOnlyDirective {
    // Allow decimal numbers and negative values
    //private regex: RegExp = new RegExp(/^-?[0-9]+(\.[0-9]*){0,1}$/g);

    private regex: RegExp = new RegExp(/^[0-9]+(\.[0-9]{0,2})?$/g);


    // Allow key codes for special events. Reflect :
    // Backspace, tab, end, home
    private specialKeys: Array<string> = ['Backspace', 'Tab', 'End', 'Home'];

    constructor(private el: ElementRef) {
    }
    @HostListener('keydown', ['$event'])
    onKeyDown(event: KeyboardEvent) {
        
        // Allow Backspace, tab, end, and home keys
        if (this.specialKeys.indexOf(event.key) !== -1) {            
            return;
        }
        let current: string = this.el.nativeElement.value;
        let next: string = current.concat(event.key);
        if (next && !String(next).match(this.regex)) {
            event.preventDefault();
        }



    }
    @HostListener('blur', ['$event'])
    onBlur(event: any) {
        
        let current: string = this.el.nativeElement.value;
        if (current.substr(current.length - 1) == '.') {
            this.el.nativeElement.value = current.substr(0, current.length - 1);
        }
    }

}