---
title: Getting Started
permalink: getting-started.html
---

Please visit our blog post announcing the features of the extension:

[Habitat Integration for Azure DevOps in the Visual Studio Marketplace](https://blog.chef.io/2017/09/19/habitat-integration-for-vsts-in-visual-studio-marketplace/)

## Prequisites

### Habitat

You need to have an account set up with [Habitat](https://bldr.habitat.sh/#/sign-in) so that you have a an origin and public / private key.

You will also need to create a Personal Access Token (PAT) on your Habitat Builder Profile page. This information is required to upload built packages to the Habitat depot.

![Habitat Profile Page](/images/habitat_profile_page.png)

### License

From Habitat version 0.81 onwards a license must be accepted before the software can be used. To do this add a variable to the pipeline:

  `HAB_LICENSE=accept-no-persist`

This can be done in the Azure DevOps UI or within a pipeline file.

![Set HAB_LICENSE in Azure DevOps Portal](/images/set_var_in_portal.png)

```yaml
variables:
- name: HAB_LICENSE
  value: accept-no-persist
```

### Build and Release phase tasks

Each task has been labeled with the phase that is it designed for, but each task _can_ be used in either phase.

### Docker

If you want to be able to export a Habitat package as a Docker image then you will need to ensure that Docker is installed in your agent. The resulting image can then be used with other Azure DevOps tasks to upload it to the Docker Registry or a private one.

This is _only_ required for the [[Tag an Image]] task.

# Further Info

More information will appear on this site as and when it is appropriate. In the meantime please visit our [Habitat Integration for Azure DevOps in the Visual Studio Marketplace](https://blog.chef.io/2017/09/19/habitat-integration-for-vsts-in-visual-studio-marketplace/) page.Azure DevOps