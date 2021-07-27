import { Directive, ElementRef, HostListener } from '@angular/core';
import { Input } from '@angular/core';

@Directive({
    selector: '[inputValidator]'
})
export class InputValidatorDirective {
    inputElement: ElementRef;

    @Input('inputValidator') inputValidator: string;
    arabicRegex = '[\u0600-\u06FF]';
	regexForName = /\`|\~|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\+|\=|\[|\{|\]|\}|\||\\|\<|\,|\.|\>|\?|"|\/|\""|\;|\:|\d/g;
	regexForBusinessName = "/^(?!\s)(?!.*\s$)(?=.*[a-zA-Z0-9])[a-zA-Z0-9 '~? !]{ 2,} $/g";

    constructor(el: ElementRef) {
        this.inputElement = el;
    }

    @HostListener('keypress', ['$event']) onKeyPress(event: KeyboardEvent) {
         
		if (this.inputValidator === 'integer') {
			this.integerOnly(event);
		} else if (this.inputValidator === 'noSpecialChars') {
			this.noSpecialChars(event);
		}
		else if (this.inputValidator === 'validatePersonName') {
			this.validatePersonName(event);
		}
    }

    integerOnly(event: KeyboardEvent) {
         
        const e = event;
        if (e.key === 'Tab' || e.key === 'TAB') {
            return;
        }
        if ([8, 9, 27, 13].indexOf(e.keyCode) !== -1 ||
            // Allow: Ctrl+A
            (e.keyCode === 65 && e.ctrlKey === true) ||
            // Allow: Ctrl+C
            (e.keyCode === 67 && e.ctrlKey === true) ||
            // Allow: Ctrl+V
            (e.keyCode === 86 && e.ctrlKey === true) ||
            // Allow: Ctrl+X
            (e.keyCode === 88 && e.ctrlKey === true)) {
            // let it happen, don't do anything
            return;
        }
        if (['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'].indexOf(e.key) === -1) {
            e.preventDefault();
        }
    }

    noSpecialChars(event: KeyboardEvent) {
        const e = event;
        if (e.key === 'Tab' || e.key === 'TAB') {
            return;
        }
        let k;
        k = event.keyCode;  // k = event.charCode;  (Both can be used)
        if ((k > 64 && k < 91) || (k > 96 && k < 123) || k === 8 || k === 32) {
            return;
		}

		const ch = String.fromCharCode(e.keyCode);
		if (!/[^a-zA-Z0-9]/.test(ch)) {
			return;
		}

        const regEx = new RegExp(this.arabicRegex);
        if (regEx.test(ch)) {
            return;
        }        

        e.preventDefault();
    }

    validatePersonName(event: KeyboardEvent) {
        const e = event;
        if (e.key === 'Tab' || e.key === 'TAB') {
            return;
        }
        let k;
        k = event.keyCode;  // k = event.charCode;  (Both can be used)
        if ((k > 64 && k < 91) || (k > 96 && k < 123) || k === 8 || k === 32 ) {
            return;
        }
         
        const ch = String.fromCharCode(e.keyCode);
        const regEx = new RegExp(this.regexForName);
        if (!regEx.test(ch)) {
            return;
        }

        e.preventDefault();
	}


    @HostListener('paste', ['$event']) onPaste(event: any) {
        event.preventDefault();
       /* let regex:any;
        if (this.inputValidator === 'integer') {
            regex = /[0-9]/g;
        } else if (this.inputValidator === 'noSpecialChars') {
            regex = /\`|\~|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\+|\=|\[|\{|\]|\}|\||\\|\'|\<|\,|\.|\>|\?|\/|\""|\;|\:/g;
        }
        else if (this.inputValidator === 'validatePersonName') {
            regex = /\`|\~|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\+|\=|\[|\{|\]|\}|\||\\|\<|\,|\.|\>|\?|\/|\""|\;|\:|\d/g;
        }

        const e = event;
         
        if ((<any>window).clipboardData || e.clipboardData) {
            var clipboardData = (<any>window).clipboardData != null ? (<any>window).clipboardData : e.clipboardData
            alert(clipboardData);
            const pasteData = clipboardData.getData('text/plain');
        
        let m;
        let matches = 0;
        while ((m = regex.exec(pasteData)) !== null) {
            // This is necessary to avoid infinite loops with zero-width matches
            if (m.index === regex.lastIndex) {
                regex.lastIndex++;
            }
            // The result can be accessed through the `m`-variable.
            m.forEach((match:any, groupIndex:any) => {
                matches++;
            });
        }
        if (matches === pasteData.length) {
            return;
        } else {
            e.preventDefault();
        }
        }
        */
    }
}