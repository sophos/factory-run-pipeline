# Run a Refactr Pipeline

A GitHub Action for triggering a job in the Refactr Platform.

This action runs Refactr pipelines right from GitHub Actions, enabling you to execute Refactr pipelines from GitHub commits, pull requests, and other GitHub triggers.

## Prerequisites

* An existing GitHub account.
* An existing Refactr Project containing a Pipeline and an associated Job.
* A Refactr Platform API token
    * API tokens can be generated from the Refactr application by visiting the Account Settings page.
    * It is recommended to configure this value as a GitHub Secret. [See here for more information.](https://docs.github.com/en/actions/configuring-and-managing-workflows/creating-and-storing-encrypted-secrets))

## Example Usage

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
      - uses: refactr/action-run-pipeline@master
        with:
          project_id: <project-id>
          job_id: <job-id>
          api_token: ${{ secrets.REFACTR_API_TOKEN }}
          variables: '{ "my_var": "value" }'
```

## Inputs

Input | Description | Required | Default |
----------|-------------|:----------:|:-------:|
| `project_id` | ID of the project containing the job to run.|yes|-|
| `job_id` | ID of the Job to run | yes |-|
| `api_token` | Refactr API token | yes | - |
| `variables` | Input variables for the Job. The variables must be in a form of stringified JSON object, e.g. `'{ "my_var": "value" }'` | no | - |
| `api_url` | Refactr API base URL. Most users will not need to set this value. | no | https://api.refactr.it/ |

## Outputs

The Action will report if the job run was successful. If the job run fails, the Action will report a failure. The output events from the run are streamed to the Action console.

## Terms of Use

Please see [Sophos Services Agreement](https://www.sophos.com/en-us/legal/sophos-services-agreement.aspx) and [Sophos Privacy Notice](https://www.sophos.com/en-us/legal/sophos-group-privacy-notice.aspx).

