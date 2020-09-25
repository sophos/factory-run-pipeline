const core = require('@actions/core');
const { checkStatus, scheduleJob, setBaseUrl } = require('./api.js');
const { isPOJO } = require('./utils.js');

const DEFAULT_API_URL = 'https://api.refactr.it/';

(async function main() {
	const authToken = core.getInput('api_token');
	const projectId = core.getInput('project_id');
	const jobId = core.getInput('job_id');

	if (!authToken) {
		return core.setFailed('`api_token` field must be non-empty string!');
	}

	if (!projectId) {
		return core.setFailed(
			'`project_id` must be non-empty ObjectID string!'
		);
	}

	if (!jobId) {
		return core.setFailed('`job_id` must be non-empty ObjectID string!');
	}

	let variables = {};
	try {
		const inputVariables = core.getInput('variables');
		if (inputVariables) {
			variables = JSON.parse(inputVariables);
		}

		if (!isPOJO(variables)) {
			return core.setFailed(
				'Expected `variables` field to be JSON object!'
			);
		}
	} catch(err) {
		return core.setFailed('Unable to jsonify variables!');
	}

	setBaseUrl(core.getInput('api_url') || DEFAULT_API_URL);

	let runId;
	try {
		runId = await scheduleJob(authToken, projectId, jobId, variables);
		await checkStatus(authToken, projectId, runId);
	} catch(err) {
		return core.setFailed(err);
	}
})();
