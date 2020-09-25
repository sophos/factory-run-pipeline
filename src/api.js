const got = require('got');
const { delay, peekMessage, normalizeUrl } = require('./utils.js');

const DEFAULT_TIMEOUT = 16200000; // ms, default to 4.5h
const DEFAULT_DELAY = 5000; // ms

const VALID_STATUS = {
	SUCCEEDED: 'Succeeded',
	FAILED: 'Failed'
};

let _baseUrl;
const setBaseUrl = (baseUrl) => _baseUrl = baseUrl;
const getUrl = (fragment) => normalizeUrl(`${_baseUrl}/${fragment}`);
const getHeaders = (authToken) => ({
	Authorization: `Bearer ${authToken}`
});

async function scheduleJob(authToken, projectId, jobId, variables) {
	try {
		let req = {
			headers: getHeaders(authToken)
		};
		if (variables) {
			req.headers['Content-Type'] = 'application/json';
			req.json = {
				variables
			};
		}
		const body = await got
			.post(getUrl(`/v1/projects/${projectId}/jobs/${jobId}/run`), req)
			.json();

		return body['_id'];
	} catch(err) {
		if (err.response) {
			throw new Error(peekMessage(err));
		}

		throw err;
	}
}

function checkStatus(
	authToken,
	projectId,
	runId,
	delayMs = DEFAULT_DELAY,
	timeout = DEFAULT_TIMEOUT
) {
	const start = Date.now();
	let currentOffset = 0;

	const _checkStatus = async () => {
		let body;
		try {
			body = await got(
				getUrl(`/v1/projects/${projectId}/runs/${runId}`),
				{
					headers: getHeaders(authToken)
				}
			).json();
		} catch(err) {
			if (err.response) {
				throw new Error(peekMessage(err));
			}

			throw err;
		}

		const events = body && body.events || [];
		if (events.length > 0) {
			for (let i = currentOffset; i < events.length; i++) {
				const event = events[i];

				/* eslint-disable-next-line no-console */
				console.info(
					`${event.occurred} - ${event.level} - ${event.message}`
				);
			}

			currentOffset = events.length;
		}

		if (body.status === VALID_STATUS.FAILED) {
			throw new Error('Job is failed!');
		}

		if (body.status !== VALID_STATUS.SUCCEEDED) {
			const end = Date.now();
			if (end - start >= timeout) {
				throw new Error('Job is timeouted!');
			}

			await delay(delayMs);
			return await _checkStatus();
		}

		return true;
	};

	return _checkStatus();
}

module.exports = {
	checkStatus,
	scheduleJob,
	setBaseUrl
};
