import { CustomRequiredValidator } from './required.directive';

describe('RequiredDirective', () => {
  it('should create an instance', () => {
    const directive = new CustomRequiredValidator(null);
    expect(directive).toBeTruthy();
  });
});
