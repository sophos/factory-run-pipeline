import * as core from '@actions/core';

import { checkRunStatus, getRunOutputs, scheduleJob } from './actions';
import { Client } from './api';
import { isPOJO } from './isPOJO';

const DEFAULT_API_URL = 'https://api.us-west-2.factory.sophos.com/v1';
core.debug(DEFAULT_API_URL)
core.debug(core.getInput('api_url'))
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

  let variables;
  const inputVariables = core.getInput('variables');
  if (inputVariables) {
    try {
      variables = JSON.parse(inputVariables);
    } catch (err) {
      return core.setFailed('Unable to jsonify variables!');
    }
    if (!isPOJO(variables)) {
      return core.setFailed('Expected `variables` field to be JSON object!');
    }
  }
  core.debug(DEFAULT_API_URL)
  core.debug(core.getInput('api_url'))
  const client = new Client(
    core.getInput('api_url') || DEFAULT_API_URL,
    authToken
  );

  const runId = await scheduleJob(client, projectId, jobId, variables);
  if (runId) {
    await checkRunStatus(client, projectId, runId);
    const outputs = await getRunOutputs(client, projectId, runId);

    if (isPOJO(outputs)) {
      Object.entries(outputs).map(([key, val]) => {
        core.setOutput(key, val);
      });
    }
  }
})();
