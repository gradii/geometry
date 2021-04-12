import { isFunction } from '../src/check-type';

describe('test check-type', () => {
  it('test isFunction', () => {
    const fn = () => {
      expect(isFunction(fn)).toBe(true);
    };

  });
});
