---
title: Package Export
permalink: package-export.html
---

# Package Export

| **Azure DevOps Task Name**       | **Azure DevOps Phase** |
|--------------------------|----------------|
| Package Export (Habitat) | Release        |

## Summary

Export a Habitat package to a different format.

{% include warning.html content="Please note that there are breaking changes in this version, 2.x, of this task" %}

## Description

Export a package in a different format. Currently supported formats are:

 - Docker
 - Aci
 - Mesos
 - Tar

If the option to use `sudo` has been set in the Service Endpoint this task will use `sudo` to perform the export.

## Settings

| Setting                            | Group |Required               | Default Value                                  | Description                                   |
|------------------------------------|---|------------------------|------------------------------------------------|-----------------------------------------------|
| Display name                       | | yes                    | Install Habitat                                | Set the display name for this task            |
| Habitat Origin                     | | yes                    | None                                           | The Habitat Endpoint to use for this task     |
| Export Format                      | | yes                    | docker                                         | Format that the package should be exported to |
| Package Path                       | | yes                    |                                                | Path to the `hart` file to export             |
| Package Channel                    | Advanced | no                     |                                                | Channel that packages are pulled from when exporting the package |

The variables specified in the table above come from Azure DevOps. A list of well known variables can be found [here](https://www.visualstudio.com/en-us/docs/build/define/variables).

In this version, 2.x, of the task the `Package Path`, replaces the `Name` and `Version to export the package with` parameters that were available in version 1.x. The recommended way to correctly tag images is to use the [Expose Build Variables](/expose-build-variables.html) task to write out the images file and then use the Docker Tag Images task.

## Command

| Variable / Setting      | Example Value  |
|-------------------------|----------------|
| Package Path            | `$(System.DefaultWorkingDirectory)/mybuild-CI/drop/mybuild-$(Build.BuildNumber)-x86_64-linux.hart`     |
| Origin                  | russellseymour |
| Format                  | docker         |

Given the settings and variables in the table above, the resultant command that the task will run is:

```bash
$> hab pkg export docker --url https://bldr.habitat.sh /vsts/agent/_work/r1/a/mybuild-CI/drop/mybuild-1.2.3-x86_64-linux.hart
```

If the "Package Channel" has been populated on the parameters on the task, the `-c` option will be added to the command.

## Screenshot

![Package Export Task](/images/package_export.png)
