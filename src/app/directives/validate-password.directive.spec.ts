import { PasswordValidator } from './validate-password.directive';

describe('ValidatePasswordDirective', () => {
  it('should create an instance', () => {
    const directive = new PasswordValidator(null);
    expect(directive).toBeTruthy();
  });
});
