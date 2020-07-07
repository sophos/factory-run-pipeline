const core = require('@actions/core');
const got = require('got');

const DEFAULT_API_URL = 'https://api.refactr.it/';
const DEFAULT_TIMEOUT = Infinity; // ms
const DEFAULT_DELAY = 500; // ms

const VALID_STATUS = {
    SUCCEEDED: 'Succeeded',
    FAILED: 'Failed',
};

let _baseUrl = DEFAULT_API_URL;
const getUrl = (fragment) =>
    `${_baseUrl}/${fragment}`.replace(/\/+/g, '/').replace(/\/$/, '');
const getHeaders = (authToken) => ({
    Authorization: `Bearer ${authToken}`,
});

const isPOJO = (value) => {
    if (value == null || typeof value !== 'object') {
        return false;
    }

    const proto = Object.getPrototypeOf(value);
    if (proto == null) {
        return true;
    }

    return proto.constructor.name === 'Object';
}
const peekMessage = (error) => {
    const body = error.response && error.response.body;
    let errors;
    try {
        const parsedBody = JSON.parse(body);
        errors = parsedBody.errors || [];
    } catch (err) {
        return 'Unknown error!';
    }

    const len = errors && errors.length;
    if (len > 0) {
        return errors[0].message;
    }

    return 'Unknown error!';
};

const delay = (delay) =>
    new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, delay);
    });

async function scheduleJob(authToken, projectId, jobId, variables = {}) {
    try {
        const body = await got
            .post(getUrl(`/v1/projects/${projectId}/jobs/${jobId}/run`), {
                headers: getHeaders(authToken),
                json: {
                    variables,
                },
            })
            .json();

        return body['_id'];
    } catch (err) {
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
                    headers: getHeaders(authToken),
                }
            ).json();
        } catch (err) {
            if (err.response) {
                throw new Error(peekMessage(err));
            }

            throw err;
        }

        const events = (body && body.events) || [];
        if (events.length > 0) {
            for (let i = currentOffset; i < events.length; i++) {
                const event = events[i];
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

(async function main() {
    const authToken = core.getInput('api_token');
    const projectId = core.getInput('project_id');
    const jobId = core.getInput('job_id');

    if (!authToken) {
        return core.setFailed('`api_token` field must be non-empty string!');
    }

    if (!projectId) {
        return core.setFailed('`project_id` must be non-empty ObjectID string!');
    }

    if (!jobId) {
        return core.setFailed('`job_id` must be non-empty ObjectID string!');
    }

    let variables = {};
    try {
        variables = JSON.parse(core.getInput('variables') || {});
        if (!isPOJO(variables)) {
            return core.setFailed('Expected `variables` field to be JSON object!');
        }
    } catch (err) {
        return core.setFailed('Unable to jsonify variables!');
    }

    _baseUrl = core.getInput('api_url') || DEFAULT_API_URL;

    let runId;
    try {
        runId = await scheduleJob(authToken, projectId, jobId, variables);
        await checkStatus(authToken, projectId, runId);
    } catch (err) {
        return core.setFailed(err);
    }
})();
