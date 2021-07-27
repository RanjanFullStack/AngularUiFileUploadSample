import { CustomBusinessNameValidator } from './validate-businessname';

describe('ValidateBusinessnameDirective', () => {
  it('should create an instance', () => {
    const directive = new CustomBusinessNameValidator(null);
    expect(directive).toBeTruthy();
  });
});
