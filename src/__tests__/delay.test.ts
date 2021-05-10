import { delay } from '../delay';

describe('delay', () => {
  test('should work', async () => {
    const start = Date.now();
    await delay(500);
    const end = Date.now();

    expect(end - start).toBeCloseTo(500, -2);
  });
});
