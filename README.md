# Trigger Refactr Job from GitHub Action

A GitHub Action for triggering a job in the Refactr platform.

This action allows you to execute Refactr Pipelines right from the GitHub Actions, enabling you to execute Refactr pipelines from GitHub commits, pull requests, and other GitHub triggers.

### Prerequisites
* An existing GitHub account
* An existing Refactr Project containing a Pipeline and an associated Job.
* A Refactr Platform API token
    * It is recommended to configure this value as a GitHub Secret. [See here for more information.](https://docs.github.com/en/actions/configuring-and-managing-workflows/creating-and-storing-encrypted-secrets))

### Usage
Example of workflow
```yaml
on:
  pull_request: {branches: master}
  push: {branches: master}

jobs:
  test:
    runs-on: ubuntu-latest
    name: Run a Refactr Job
    steps:
      - uses: actions/checkout@v2
      - uses: ./
        with:
          project_id: <project-id> # required
          job_id: <job-id> # required
          api_token: ${{ secrets.REFACTR_API_TOKEN }} # required
          variables: variables # optional
          api_url: api_url # optional
```

### Inputs
Input | Description | Required | Default |
----------|-------------|:----------:|:-------:|
|`project_id` | Project ID containing the specified job|yes|-|
| `job_id` | Job ID to execute. | yes |-|
| `api_token` | Refactr API token | yes | - |
| `api_url` | Parameter can be passed to specify API endpoint | no | https://api.refactr.it/ |
| `variables` | Parameter can be used to provide variables for a job. The value must be in a form of stringified JSON object, e.g. `'{ "my_var": "value" }'` | no | - |

### Outputs
The Action will report if the job run was successful. If the job run fails, the Action will report a failure. The logs from the job are streamed to the Action console.
