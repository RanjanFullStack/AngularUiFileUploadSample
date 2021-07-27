import { CustomURLValidator } from './validate-url.directive';

describe('ValidateUrlDirective', () => {
  it('should create an instance', () => {
    const directive = new CustomURLValidator(null);
    expect(directive).toBeTruthy();
  });
});
