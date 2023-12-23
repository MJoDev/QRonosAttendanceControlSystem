import { IncrementarPipe } from './incrementar.pipe';

describe('IncrementarPipe', () => {
  it('create an instance', () => {
    const pipe = new IncrementarPipe();
    expect(pipe).toBeTruthy();
  });
});
