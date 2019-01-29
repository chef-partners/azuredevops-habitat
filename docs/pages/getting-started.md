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

### Build and Release phase tasks

Currently the tasks need to be run on your own private Linux agent. This is so that the extension is able to download Habitat and access `sudo` if and when it needs to.

To setup a private agent please refer to this [Microsoft GitHub page](https://github.com/Microsoft/vsts-agent).

When the agent is run it should be run under a normal user account that has the ability to use `sudo` without a password. For example if it was running under the account `vsts` then the following should be added to `/etc/sudoers.d/vsts`:

```
vsts ALL=(root) NOPASSWD:ALL
```

Each task has been labeled with the phase that is it designed for, but each task _can_ be used in either phase.

### Docker

If you want to be able to export a Habitat package as a Docker image then you will need to ensure that Docker is installed in your agent. The resulting image can then be used with other Azure DevOps tasks to upload it to the Docker Registry or a private one.

This is _only_ required for the [[Tag an Image]] task.

The extension is still under active development and will move towards being able to use a Hosted agent and Windows agents.

# Further Info

More information will appear on this site as and when it is appropriate. In the meantime please visit our [Habitat Integration for Azure DevOps in the Visual Studio Marketplace](https://blog.chef.io/2017/09/19/habitat-integration-for-vsts-in-visual-studio-marketplace/) page.Azure DevOps