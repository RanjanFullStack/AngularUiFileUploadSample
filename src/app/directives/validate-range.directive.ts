import { Directive, forwardRef, Attribute } from '@angular/core';
import { Validator, AbstractControl, NG_VALIDATORS } from '@angular/forms';

@Directive({
	selector: '[validateSmaller][formControlName],[validateSmaller][formControl],[validateSmaller][ngModel]',
	providers: [
		{ provide: NG_VALIDATORS, useExisting: forwardRef(() => SmallerValidator), multi: true }
	]
})
export class SmallerValidator implements Validator {
	constructor(@Attribute('validateSmaller') public validateEqual: string) {

	}


	validate(c: AbstractControl): { [key: string]: any } | null {
		// self value
		let v = c.value;

		// control vlaue
		let e = c.root.get(this.validateEqual);

		// value not equal
		if (e && parseFloat(v) > parseFloat(e.value)) {
			return {
				validateSmaller: false
			}
		}

		// value equal and reverse
		if (e && parseFloat(v) < parseFloat(e.value)) {
			if (e.errors != null) {
				delete e.errors['validateSmaller'];
				if (!Object.keys(e.errors).length) e.setErrors(null);
			}
		}

		return null;
	}
}


@Directive({
	selector: '[validateGreater][formControlName],[validateGreater][formControl],[validateGreater][ngModel]',
	providers: [
		{ provide: NG_VALIDATORS, useExisting: forwardRef(() => GreaterValidator), multi: true }
	]
})
export class GreaterValidator implements Validator {
	constructor(@Attribute('validateGreater') public validateEqual: string) {

	}


	validate(c: AbstractControl): { [key: string]: any } | null {
		// self value
		let v = c.value;

		// control vlaue
		let e = c.root.get(this.validateEqual);

		// value not equal
		if (e && parseFloat(v)< parseFloat(e.value)) {
			return {
				validateGreater: false
			}
		}

		// value equal and reverse
		if (e && parseFloat(v) > parseFloat(e.value)) {
			if (e.errors != null) {
				delete e.errors['validateGreater'];
				if (!Object.keys(e.errors).length) e.setErrors(null);
			}
		}

		return null;
	}
}