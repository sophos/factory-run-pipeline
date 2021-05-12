import { isPOJO } from '../isPOJO';

describe('isPOJO', () => {
  test('should work', () => {
    class A {}

    expect(isPOJO({})).toBeTruthy();
    expect(isPOJO(new Object())).toBeTruthy();
    expect(isPOJO(Object.create(null))).toBeTruthy();

    // falsy
    expect(isPOJO(null)).toBeFalsy();
    expect(isPOJO(undefined)).toBeFalsy();
    expect(isPOJO('test')).toBeFalsy();
    expect(isPOJO(true)).toBeFalsy();
    expect(isPOJO(false)).toBeFalsy();
    expect(isPOJO(0)).toBeFalsy();
    expect(isPOJO([])).toBeFalsy();
    expect(isPOJO(new A())).toBeFalsy();
  });
});
