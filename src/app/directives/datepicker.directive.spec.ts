import { DatePicker } from './datepicker.directive';

describe('DatepickerDirective', () => {
  it('should create an instance', () => {
    const directive = new DatePicker(null,null);
    expect(directive).toBeTruthy();
  });
});
