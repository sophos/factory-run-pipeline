const { normalizeUrl } = require('../src/utils');

describe('normalizeUrl', () => {
	test('should remove multiple slashes', () => {
		expect(normalizeUrl('////')).toBe('/');
		expect(normalizeUrl('//hello//world')).toBe('/hello/world');
	});

	test('should remove trailing slash', () => {
		expect(normalizeUrl('/world/')).toBe('/world');
		expect(normalizeUrl('/hello/world///')).toBe('/hello/world');
	});
});
