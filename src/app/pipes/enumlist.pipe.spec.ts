import { EnumKeyValueListPipe } from './enumlist.pipe';

describe('EnumlistPipe', () => {
  it('create an instance', () => {
    const pipe = new EnumKeyValueListPipe();
    expect(pipe).toBeTruthy();
  });
});
