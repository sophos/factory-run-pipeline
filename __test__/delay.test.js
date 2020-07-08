const { delay } = require('../src/utils.js');

describe('delay', () => {
	test('should work', async () => {
		const start = Date.now();
		await delay(500);
		const end = Date.now();

		expect(end - start).toBeCloseTo(500, -1);
	});
});
