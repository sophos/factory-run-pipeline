# Trigger Refactr Job from GitHub Action

A GitHub Action for triggering a job on Refactr platform.

It allows you to execute any particular job right from the GitHub action
enabling semaless integration GitHub workflow with Refactr.

### Prerequisites
* GitHub account
* Refactr account with one or more projects with arbitrary pipeline jobs
* Refactr API token (suggested to be in encrypted form, see [instruction here](https://docs.github.com/en/actions/configuring-and-managing-workflows/creating-and-storing-encrypted-secrets))

### Usage
Example of workflow
```yaml
on:
  pull_request: {branches: master}
  push: {branches: master}

jobs:
  test:
    runs-on: ubuntu-latest
    name: Test integration with Refactr.it
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

### Parameters
Parameter | Description | Required | Default |
----------|-------------|:----------:|:-------:|
|`project_id` | Project ID containing the specified job|yes|-|
| `job_id` | Job ID to execute. | yes |-|
| `api_token` | Refactr API token | yes | - |
| `api_url` | Parameter can be passed to specify API endpoint | no | https://api.refactr.it/ |
| `variables` | Parameter can be used to provide variables for a job. The value must be in a form of stringified JSON object, e.g. `'{ "my_var": "value" }'` | no | - |

### Outputs
The action will report if the job execution was successful. If the job is failed
the execution the action will also report a fail. The logs from the job are
streamed to the action console.
