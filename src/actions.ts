import * as core from '@actions/core';
import { RunStatusEnum } from '@refactr/api-client';

import { withError } from './withError';
import { Client } from './api';
import { delay } from './delay';

export const scheduleJob = withError(
  async (
    client: Client,
    projectId: string,
    jobId: string,
    variables?: Record<string, unknown>
  ): Promise<string> => {
    const { data } = await client.jobs.runJob(projectId, jobId, { variables });
    const id = data._id;
    if (typeof id !== 'string') {
      throw new Error('Unable to run a job!');
    }

    return id;
  }
);

export const getRunOutputs = withError(
  async (
    client: Client,
    projectId: string,
    runId: string
  ): Promise<Record<string, unknown> | undefined> => {
    const { data } = await client.runs.getRun(projectId, runId);

    // @ts-expect-error: `outputs` property is not defined on `Run` type
    //                   but actually exists.
    return data.outputs;
  }
);

function createRunStatusStream(
  apiClient: Client,
  projectId: string,
  runId: string
) {
  const api = apiClient.runs;
  let offset = 0;

  async function getRunEvents() {
    let run;
    try {
      run = (await api.getRun(projectId, runId)).data;
    } catch (err) {
      return {
        events: [],
        done: true,
        isErrored: true
      };
    }

    const events = run?.events?.slice(offset) ?? [];
    offset += events.length;

    return {
      events,
      done:
        run?.status === RunStatusEnum.Failed ||
        run?.status === RunStatusEnum.Succeeded,
      isErrored: false
    };
  }

  return (async function* () {
    while (1) {
      const { events, done } = await getRunEvents();

      yield* events;
      await delay(1000);

      if (done) return;
    }
  })();
}

export const checkRunStatus = withError(
  async (client: Client, projectId: string, runId: string): Promise<void> => {
    const stream = createRunStatusStream(client, projectId, runId);
    for await (const event of stream) {
      core.info(`${event.occurred} [${event.level}]: ${event.message}`);
      if (event.details) {
        core.info(event.details);
      }
    }
  }
);
