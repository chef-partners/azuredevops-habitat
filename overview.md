This [Habitat](https://habitat.sh) integration for Visual Studio Team Services provides a set of tasks that enable the use of Habitat during the Build and Release phases pipelines. Use these tasks to build and release your software application as a Habitat package that can be deployed anywhere.

[Habitat](https://habitat.sh) provides a toolset that allows software to be packaged up into an immutable configurable archive which can be shared. This archive can be deployed anywhere or even exported to other formats such as Docker.

## Build Tasks
These tasks are typically used in your Build process:

 - **Install Habitat**: Installs habitat on the build agent
 - **Signing Origin Key**: Copies your Habitat origin key to the agent for package signing
 - **Build Plan**: Build the Habitat package using the project plan.sh

## Release Tasks

These tasks are typically used as part of your release process:

 - **Package Install**: Install a Habitat package locally
 - **Package Upload**: Upload Habitat package to the specified Depot
 - **Package Export**: Export a Habitat package to a different format.
 - **Tag an Image**: Tag a Docker image that has been created by exporting a Habitat package with the previous task.

## Getting Started

See our guide to [Getting Started](https://github.com/chef-partners/vsts-habitat/wiki/getting-started).

## Project Configuration / Endpoint

Before you add any Build or Release tasks to your pipelines, you will need to configure your Habitat Origin “endpoint”.

Endpoints are a per-project configuration and be accessed via **Project Settings** (cog) > **Services** from within your VSTS account.

The Habitat Origin endpoint allows you to specify the following information so it does not have to be repeated on each task. It also stores certain information securely.

 - **Habitat Depot URL**: Target depot for uploading packages to, e.g. https://bldr.habitat.sh.
 - **Origin Name**: Name of the origin to use when signing packages.
 - **Revision**: Revision of the origin to use
 - **Public Key**: The public key associated with the specified origin
 - **Use Sudo**: Some tasks may need to use `sudo` to work correctly. This option states that they are able to do so.

The following data on the endpoint is held securely:

 - **Signing Key**: The signing (private) key associated with the specified origin.
 - **GitHub Auth Token**: The authentication token for GitHub for publishing packages to the depot.

## Documentation and Help

For details on installation, please read the [installation guide](https://github.com/chef-partners/vsts-habitat/wiki/install-extension).

For detailed task documentation, please read the [task documentation](https://github.com/chef-partners/vsts-habitat/wiki/summary).

To report an issue, please check our issues list.

## Contributors

This extension was created by Chef Software, Inc.

To get in contact, please email partnereng@chef.io.


