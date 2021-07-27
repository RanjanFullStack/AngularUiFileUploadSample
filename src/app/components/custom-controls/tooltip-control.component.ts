﻿import { Component, Input} from '@angular/core';

@Component({
	selector: 'tooltip',
	templateUrl: './tooltip-control.component.html',
})
export class TooltipControlComponent {
	@Input() iconClass: string;
}
