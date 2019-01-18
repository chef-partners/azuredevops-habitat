---
title: Task Summary
permalink: summary.html
---

The following shows all the tasks that are in the extension and what they do.

NOTE: Although the tasks are designed to be used in the specified phases, all tasks can be used in either phase.

## Build Tasks

 - [Install Habitat](/install-habitat.html): Installs habitat on the build agent
 - [Signing Key Origin](/signing-key-origin.html): Copies your Habitat origin key to the agent for package signing
 - [Build Plan](/build-plan.html): Build the Habitat package using the project plan.sh
 - [Expose Build Variables](/expose-build-variables.html): Expose variables from the last build to Azure DevOps. Optionally set the build number

## Release Tasks

- [Package Install](/package-install.html): Install a Habitat package locally
- [Package Upload](/package-upload.html): Upload Habitat package to the specified Depot
- [Package Export](/package-export.html): Export a Habitat package to a different format.
- [Tag an Image](/tag-an-image.html): Tag a Docker image that has been created by exporting a Habitat package with the previous task.