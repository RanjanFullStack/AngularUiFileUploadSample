import { InputValidatorDirective } from './validate-special-characters.directive';

describe('ValidateSpecialCharactersDirective', () => {
  it('should create an instance', () => {
    const directive = new InputValidatorDirective(null);
    expect(directive).toBeTruthy();
  });
});
