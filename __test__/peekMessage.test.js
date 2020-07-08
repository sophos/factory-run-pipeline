const { peekMessage } = require('../src/utils.js');

class CustomError extends Error {
	constructor(message, response) {
		super(message);

		this.response = response;
	}
}

describe('peekMessage', () => {
	test('should peek message from response body', () => {
		expect(
			peekMessage(
				new CustomError('CustomError', {
					body: '{ "errors": [{"message": "hello world"}] }'
				})
			)
		).toBe('hello world');
	});

	test('should peek first message', () => {
		expect(
			peekMessage(
				new CustomError('CustomError', {
					body:
						'{ "errors": [{"message": "test1"}, {"message": "test2"}] }'
				})
			)
		).toBe('test1');
	});

	test('should return unknown error if cannot figure out', () => {
		expect(
			peekMessage(
				new CustomError('CustomError', {
					body: '{ "errors": [] }'
				})
			)
		).toBe('Unknown error!');
		expect(peekMessage(new Error('error'))).toBe('Unknown error!');
		expect(
			peekMessage(
				new CustomError('CustomError', {
					body: null
				})
			)
		).toBe('Unknown error!');

	});
});
