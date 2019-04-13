---
title: Azure DevOps Pipeline YAML file
url: /azdo-pipeline.html
---

# Azure DevOps Pipeline YAML Files

The tasks in the Habitat extension can be configured in an Azure DevOps Pipeline yaml file.

## Fully Qualified Names

In order to use the tasks in such a file the correct fully qualified name is required.

| Task Name | Pipeline File name |
|---|---|
| Expose Habitat Build Variables | `chef-software.vsts-habitat-tasks.vsts-expose-habitat-build-vars.vsts-expose-habitat-build-vars@2` |
| Habitat Build | `chef-software.vsts-habitat-tasks.vsts-habitat-tasks-build.vsts-habitat-build@2` |
| Habitat Install | `chef-software.vsts-habitat-tasks.vsts-habitat-tasks-build.vsts-habitat-install@2` |
| Habitat Package Export | `chef-software.vsts-habitat-tasks.vsts-habitat-tasks-pkg-export.vsts-habitat-pkg-export@2` |
| Habitat Package Install | `chef-software.vsts-habitat-tasks.vsts-habitat-tasks-pkg-install.vsts-habitat-pkg-install@2` |
| Habitat Package Upload | `chef-software.vsts-habitat-tasks.vsts-habitat-tasks-pkg-upload.vsts-habitat-pkg-upload@2` |
| Habitat Signing Key | `chef-software.vsts-habitat-tasks.vsts-habitat-tasks-signing-key.vsts-habitat-signing-key@2` |

NOTE: The '@2' in the table denotes the major version of the extension to use.

## Example

The following YAML file show an example of how the tasks (version 3.x) can be used to:

 - Ensure Habitat is installed
 - Add the necessary signing keys
 - Build the Habitat Plan
 - Expose the build variables
 - Upload HART to the Depot

```yaml
pool:
  name: default

steps:
- task: chef-software.vsts-habitat-tasks.vsts-habitat-tasks-build.vsts-habitat-install@3
  displayName: 'Install Habitat'

- task: chef-software.vsts-habitat-tasks.vsts-habitat-tasks-signing-key.vsts-habitat-signing-key@3
  displayName: 'Signing Origin Key: install'
  inputs:
    habitatOrigin: habitat-service-connection

- task: chef-software.vsts-habitat-tasks.vsts-habitat-tasks-build.vsts-habitat-build@3
  displayName: 'Build Habitat plan'
  inputs:
    habitatOrigin: habitat-service-connection

- task: chef-software.vsts-habitat-tasks.vsts-expose-habitat-build-vars.vsts-expose-habitat-build-vars@3
  displayName: 'Expose Habitat Build Variables'

- task: chef-software.vsts-habitat-tasks.vsts-habitat-tasks-pkg-upload.vsts-habitat-pkg-upload@3
  displayName: 'Package Upload'
  inputs:
    habitatOrigin: habitat-service-connection

```

In this example the Habitat Origin must already exist. Please refer to [Create Habitat Endpoint](/habitat-endpoint.html) for more information.