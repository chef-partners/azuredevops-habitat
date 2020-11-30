---
title: Azure DevOps Habitat Extension
permalink: index.html
---
# ---- DEPRECATED ----
This extension is now deprecated in favour of the new Chef Extension for Azure DevOps which can be found [here](https://marketplace.visualstudio.com/items?itemName=chef-software.chef-azdo). The new extension allows the execution of any Chef component.

This version of the Chef Extension will not be developed or maintained. We encourage everyone to upgrade to the new extension. Documentation and migration information can be found [here](https://chef-partners.github.io/azuredevops-chef-extension).

[![Build status](https://dev.azure.com/chef-software/vsts-habitat/_apis/build/status/vsts-habitat-CI)](https://dev.azure.com/chef-software/vsts-habitat/_build/latest?definitionId=1)

NOTE: There is a change to the [Expose Habitat Build Variables](https://chef-partners.github.io/azuredevops-habitat/expose-build-variables.html) task in version 3.x that will fail the build if the full path to the `last_build` file is given. Please refer to the task documentation for more information.

NOTE: There are breaking changes for the [Package Export](https://chef-partners.github.io/azuredevops-habitat/package-export.html) task in version 2.x

This [Habitat](https://habitat.sh) integration for Azure Devops provides a set of tasks that enable the use of Habitat during the Build and Release phases pipelines. Use these tasks to build and release your software application as a Habitat package that can be deployed anywhere.

[Habitat](https://habitat.sh) provides a toolset that allows software to be packaged into an immutable configurable archive which can be shared. This archive can be deployed anywhere or exported to other formats such as Docker.

All tasks are compatible with both Windows and Linux based Azure DevOps agents. Additionally the tasks also work with Azure DevOps hosted agents.

## Build Tasks
These tasks are typically used in your Build process:

 - **Install Habitat**: Installs Habitat on the build agent
 - **Signing origin key**: Copies your Habitat origin key to the agent for package signing
 - **Build plan**: Build the Habitat package using the project plan.sh
 - **Expose Build Variables**: Expose the Habitat build variables to Azure Devops

## Release Tasks

These tasks are typically used as part of your release process:

 - **Package install**: Install a Habitat package locally
 - **Package upload**: Upload Habitat package to the specified depot
 - **Package export**: Export a Habitat package to a different format
 - [DEPRECATED] **Tag an image**: Tag a Docker image that has been created by exporting a Habitat package with the previous task.

## Getting Started

See our guide to [Getting Started](https://chef-partners.github.io/azuredevops-habitat/getting-started.html).

## Project Configuration / Endpoint

Before you add any Build or Release tasks to your pipelines, you will need to configure your Habitat Origin "endpoint".

Endpoints are a per-project configuration and be accessed via **Project Settings** (cog) > **Services** from your Azure Devops account.

The Habitat origin endpoint allows you to specify the following information so it does not have to be repeated on each task. It also stores certain information securely.

 - **Habitat depot URL**: Target depot for uploading packages to, e.g. https://bldr.habitat.sh.
 - **Origin name**: Name of the origin to use when signing packages.
 - **Revision**: Revision of the origin to use
 - **Public Key**: The public key associated with the specified origin
 - **Use Sudo**: Some tasks may need to use `sudo` to work correctly.

The following data on the endpoint is held securely:

 - **Signing key**: The signing (private) key associated with the specified origin.
 - **GitHub Auth Token**: The authentication token for GitHub for publishing packages to the depot.

## Documentation and Help

For details on installation, please read the [installation guide](https://chef-partners.github.io/azuredevops-habitat/install-extension.html).

For detailed task documentation, please read the [task documentation](https://chef-partners.github.io/azuredevops-habitat/summary.html).

To report an issue, please check our issues list.

## Contributors

This extension was created by Chef Software, Inc.

To get in contact, please email partnereng@chef.io.