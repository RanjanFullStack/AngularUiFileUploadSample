import { Attribute, Directive } from '@angular/core';
import { FormControl, NG_VALIDATORS } from '@angular/forms';


@Directive({
    selector: '[validateRequired][ngModel]',
    providers: [
        {
            provide: NG_VALIDATORS,
            useExisting: CustomRequiredValidator,
            multi: true
        }
    ]
})

export class CustomRequiredValidator {
    constructor( @Attribute('validateRequired') public validateRequired: string) { }

    validate(c: FormControl): { [key: string]: any } | null {
        
        let eleVal = "";
        if ((c.value != null && c.value != "undefined" && c.value!="") && typeof (c.value) == "object") {
            eleVal =  "1";
        } else {
			eleVal = ((c.value != null && c.value != "undefined" && c.value !== "") && (typeof (c.value) == "object" || c.value.toString().trim() != ""))==true ?c.value:"";
        }
       
		try { eleVal.toString().trim() } catch(e){ console.log("||" + eleVal + "||"); }
		
        if (eleVal !== "") {
            return null;
        } else {
            return {
                validateRequired: {
                    valid: false
                }
            }
        }
     

    }
}