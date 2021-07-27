import { MinusSignToBracketsPipe } from './minus-sign-to-brackets';

describe('MinusSignToBracketsPipe', () => {
  it('create an instance', () => {
    const pipe = new MinusSignToBracketsPipe(null);
    expect(pipe).toBeTruthy();
  });
});
