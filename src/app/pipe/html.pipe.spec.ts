import { HTMLPipe } from './html.pipe';

describe('HTMLPipe', () => {
  it('create an instance', () => {
    const pipe = new HTMLPipe();
    expect(pipe).toBeTruthy();
  });
});
