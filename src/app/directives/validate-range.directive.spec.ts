import { GreaterValidator } from './validate-range.directive';

describe('ValidateRangeDirective', () => {
  it('should create an instance', () => {
    const directive = new GreaterValidator(null);
    expect(directive).toBeTruthy();
  });
});
