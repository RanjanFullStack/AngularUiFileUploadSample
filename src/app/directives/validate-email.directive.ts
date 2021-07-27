import { Directive, Attribute, forwardRef} from '@angular/core';
import { NG_VALIDATORS,FormControl, Validator} from '@angular/forms';
@Directive({
    selector: '[validateEmail][ngModel]',
    providers: [
        {
            provide: NG_VALIDATORS,
            useExisting: forwardRef(() => CustomEmailValidator),
            multi: true
        }
    ]
})

export class CustomEmailValidator implements Validator {
    constructor( @Attribute('validateEmail') public validateEmail: string) { }

    //emailPattern: string = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    pattern: any = /^([a-zA-Z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-zA-Z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-zA-Z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-zA-Z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-zA-Z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-zA-Z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-zA-Z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-zA-Z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-zA-Z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-zA-Z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;

    validate(c: FormControl): { [key: string]: any } | null {
        
        if (c.value != null) {
            //let isValid = /^[_a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/.test(c.value);
            let isValid = this.pattern.test(c.value);
            if (isValid) {
                return null;
            } else {
                return {
                    validateEmail: {
                        valid: false
                    }
                }
            }
        }
        else {
            return null;
        }
    }
      
}