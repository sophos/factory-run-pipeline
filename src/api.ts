import { Configuration, JobsApi, RunsApi } from '@refactr/api-client';

export class Client {
  public readonly jobs: JobsApi;
  public readonly runs: RunsApi;

  constructor(baseUrl: string, accessToken: string) {
    const config = new Configuration({ basePath: baseUrl, accessToken });

    this.jobs = new JobsApi(config);
    this.runs = new RunsApi(config);
  }
}
