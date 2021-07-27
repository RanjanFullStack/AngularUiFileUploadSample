import { Pipe, PipeTransform } from "@angular/core";
import { MiscellaneousService } from '../services/miscellaneous.service';

@Pipe({
    name: 'minusSignToBrackets'
})
export class MinusSignToBracketsPipe implements PipeTransform {
	constructor(private miscService: MiscellaneousService) {

	}
	transform(value: any, args?: any): any {
			/*	if (this.miscService.checkIfStringIsFloat(value) || this.miscService.checkIfStringIsIneger(value)) {
			if (value != undefined && value != null && value != "") {
				if (value.toString().trim().indexOf('-') ==0) {
						//return value.toString().replace('-', '(') + ')';
				 return '<span class="red">'+ value.toString().replace('-', '(') + ')' +'</span>';

				}
				else {
					return value;
				}
			}
			else {
				return value;
			}
		}
		else {
			return value;
		}*/
		let isPercentValue : boolean;
		if((value != null && value != "" && value.indexOf('%') == value.length -1)) {
			isPercentValue = true;
			value = value.replace('%','');      
		}
			if (this.miscService.checkIfStringIsFloat(value) || this.miscService.checkIfStringIsIneger(value)) {
			if (value != undefined && value != null && value != "") {
				value = isPercentValue ? value = value +'%' : value;
				if (value.toString().trim().indexOf('-') ==0) {
						//return value.toString().replace('-', '(') + ')';
						if(args!= undefined && args != null && args != "")
						return '<span class="red">'+ value.toString().replace('-', '('+args +" ") + ')' +'</span>';
						else
				 return '<span class="red">'+ value.toString().replace('-', '(') + ')' +'</span>';

				}
				else {
					if(args!= undefined && args != null && args != "")
					return args+ " " +value;
					else
					return value;
				}
			}
			else {
				return value;
			}
		}
		else {
			return value;
		}
	}

}


@Pipe({
	name: 'formatNumbers'
})
export class FormatNumbersPipe implements PipeTransform {
	constructor(private miscService: MiscellaneousService) {
		
	}
	transform(value: any, args?: any): any {
		
		if (value != undefined && value != null && value != "") {
			return this.miscService.formatNumber(value);
		}
		else {
			return value;
		}
	}

}