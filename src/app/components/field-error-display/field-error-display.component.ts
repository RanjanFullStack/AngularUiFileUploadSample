import { Component, Input } from '@angular/core';

@Component({
    selector: 'field-error-display',
    templateUrl: './field-error-display.component.html',
    styleUrls: ['./field-error-display.component.css']
})
export class FieldErrorDisplayComponent {
    @Input() errorMsg: string;
    @Input() displayError: boolean;
}