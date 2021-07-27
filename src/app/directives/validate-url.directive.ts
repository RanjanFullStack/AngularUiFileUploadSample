import { Directive, Attribute, forwardRef } from '@angular/core';
import { NG_VALIDATORS, FormControl, Validator } from '@angular/forms';
@Directive({
	selector: '[validateURL][ngModel]',
	providers: [
		{
			provide: NG_VALIDATORS,
			useExisting: forwardRef(() => CustomURLValidator),
			multi: true
		}
	]
})

export class CustomURLValidator implements Validator {
	constructor( @Attribute('validateURL') public validateURL: string) { }

	validate(c: FormControl): { [key: string]: any } | null {
		if (c.value == "" || c.value == null) {
			return null;
		} else {
			let isValid = /^(([a-z0-9]|[a-z0-9][a-z0-9\-]*[a-z0-9])\.)*([a-z0-9]|[a-z0-9][a-z0-9\-]*[a-z0-9])(:[0-9]+)?$/.test(c.value);
			if (isValid) {
				return null;
			} else {
				return {
					validateURL: {
						valid: false
					}
				}
			}
		}
	}

}

