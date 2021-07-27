import { NumberOnlyDirective } from './validate-numbers.directive';

describe('ValidateNumbersDirective', () => {
  it('should create an instance', () => {
    const directive = new NumberOnlyDirective(null);
    expect(directive).toBeTruthy();
  });
});
