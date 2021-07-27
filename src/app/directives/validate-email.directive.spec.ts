import { CustomEmailValidator } from './validate-email.directive';

describe('ValidateEmailDirective', () => {
  it('should create an instance', () => {
    const directive = new CustomEmailValidator(null);
    expect(directive).toBeTruthy();
  });
});
