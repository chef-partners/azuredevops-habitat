# Azure DevOps Pipeline YAML Files

The tasks in the Habitat extension can be configured in an Azure DevOps Pipeline yaml file.

## Fully Qualified Names

In order to use the tasks in such a file the correct fully qualified name is required. The names have changed in different versions of the extensions.

### Version 3.x

| Task Name | Pipeline File name |
|---|---|
| Expose Habitat Build Variables | `chef-software.habitat.expose-habitat-build-vars-task.expose-habitat-build-vars@3` |
| Habitat Build | `chef-software.habitat.build-task.install@3` |
| Habitat Install | `chef-software.habitat.install-task.install@3` |
| Habitat Package Export | `chef-software.habitat.pkg-export-task.pkg-export@3` |
| Habitat Package Install | `chef-software.habitat.pkg-install-task.pkg-install@3` |
| Habitat Package Upload | `chef-software.habitat.pkg-upload-task.pkg-upload@3` |
| Habitat Signing Key | `chef-software.habitat.signing-key-task.signing-key@3` |


### Versions 2.x

| Task Name | Pipeline File name |
|---|---|
| Expose Habitat Build Variables | `chef-software.vsts-habitat-tasks.vsts-expose-habitat-build-vars.vsts-expose-habitat-build-vars@2` |
| Habitat Build | `chef-software.vsts-habitat-tasks.vsts-habitat-tasks-build.vsts-habitat-build@2` |
| Habitat Install | `chef-software.vsts-habitat-tasks.vsts-habitat-tasks-build.vsts-habitat-install@2` |
| Habitat Package Export | `chef-software.vsts-habitat-tasks.vsts-habitat-tasks-pkg-export.vsts-habitat-pkg-export@2` |
| Habitat Package Install | `chef-software.vsts-habitat-tasks.vsts-habitat-tasks-pkg-install.vsts-habitat-pkg-install@2` |
| Habitat Package Upload | `chef-software.vsts-habitat-tasks.vsts-habitat-tasks-pkg-upload.vsts-habitat-pkg-upload@2` |
| Habitat Signing Key | `chef-software.vsts-habitat-tasks.vsts-habitat-tasks-signing-key.vsts-habitat-signing-key@2` |

NOTE: If still using version 1.x of the extension please substitute `@1` for `@2` in the above table.

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
- task: chef-software.habitat.install-task.install@3
  displayName: 'Install Habitat'

- task: chef-software.habitat.signing-key-task.signing-key@3
  displayName: 'Signing Origin Key: install'
  inputs:
    habitatOrigin: habitat-service-connection

- task: chef-software.habitat.build-task.build@3
  displayName: 'Build Habitat plan'
  inputs:
    habitatOrigin: habitat-service-connection

- task: chef-software.habitat.expose-habitat-build-vars-task.expose-habitat-build-vars@3
  displayName: 'Expose Habitat Build Variables'

- task: chef-software.habitat-preview.pkg-upload-task.pkg-upload-preview@3
  displayName: 'Package Upload'
  inputs:
    habitatOrigin: habitat-service-connection

```

In this example the Habitat Origin must already exist. Please refer to [Create Habitat Endpoint](/habitat-endpoint.html) for more information.