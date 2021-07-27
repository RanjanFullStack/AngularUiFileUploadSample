import { Directive, forwardRef, Attribute } from '@angular/core';
import { Validator, AbstractControl, NG_VALIDATORS } from '@angular/forms';
@Directive({
	selector: '[validatePassword][ngModel]',
	providers: [
        { provide: NG_VALIDATORS, useExisting: forwardRef(() => PasswordValidator), multi: true }
	]
})

 

export class PasswordValidator implements Validator {
    constructor(@Attribute('validatePassword') public validatePassword: string) { }

    validate(c: AbstractControl): { [key: string]: any } | null {
      
        let isValid = /^(?=.*?[A-Z])(?=.*?[a-z])(?!\s)(?!.*\s$)(?=.*[a-zA-Z0-9])[a-zA-Z0-9#?!@$%&*+-]{7,15}$/.test(c.value);
            if (isValid) {
                return null;
            } else {
                return {
                    validatePassword: {
                        valid: false
                    }
                }
            }
        
	}
}

@Directive({
    selector: '[comparePassword]',
    providers: [{ provide: NG_VALIDATORS, useExisting: ComparePassword, multi: true }]
})
export class ComparePassword implements Validator {

    constructor(@Attribute('comparePassword') public comparer: string,
        @Attribute('parent') public parent: string) { }

    validate(c: AbstractControl): { [key: string]: any } | null {
        let e = c.root.get(this.comparer);

        // value not equal in verify control
        if (e && c.value !== e.value && !this.isParent) {
            return { "compare": true };
        } 

        // user typing in password and match
        if (e && e.errors!=null && c.value === e.value && this.isParent) {
            delete e.errors['compare'];
            if (!Object.keys(e.errors).length) e.setErrors(null);
        }

        // user typing in password and mismatch
        if (e && c.value !== e.value && this.isParent) {
            e.setErrors({ "compare": true });
        }
        return null;
    }

    private get isParent() {
        if (!this.parent)
            return false;

        return this.parent === 'true' ? true : false;
    }
}