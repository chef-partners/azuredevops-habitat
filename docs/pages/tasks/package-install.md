---
title: Package Install
permalink: package-install.html
---

# Package Install

| **Azure DevOps Task Name**        | **Azure DevOps Phase** |
|---------------------------|----------------|
| Package Install (Habitat) | Release        |

## Summary

Installs a Habitat package locally after building

## Description

Installs the package locally. Usually used before the upload. This is required because the Habitat Studio is not being used for building, thus the package has to be installed locally for the upload task to work correctly.

If the option to use `sudo` has been set in the Service Endpoint this task will use sudo to perform the export.

## Settings

| Setting                     | Required | Default Value                                                                   | Description                                                                                                                                                        |
|-----------------------------|----------|---------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Display name                | yes      | Install Habitat                                                                 | Set the display name for this task                                                                                                                                 |
| Habitat Origin              | yes      | None                                                                            | The Habitat Endpoint to use for this task                                                                                                                          |
| Drop Folder                 | yes      | `$(System.DefaultWorkingDirectory)/$(System.TeamProject)-CI/drop`               | Directory in which the Habitat `.hart` file exists                                                                                                                 |
| Last Build Environment File | yes      | `$(System.DefaultWorkingDirectory)/$(System.TeamProject)-CI/drop/last_build.sh` | Path to the Habitat generated `last_build.sh` file. This contains the version and revision values that the agent requires to find the correct Habitat package file |

The variables specified in the table above come from Azure DevOps. A list of well known variables can be found [here](https://www.visualstudio.com/en-us/docs/build/define/variables).

## Command

| Variable / Setting | Example Value  |
|--------------------|----------------|
| Origin             | russellseymour |
| Package Name       | mypackage      |

The agent runs the following Habitat command (after all the variable substitutions have been performed)

```bash
$> hab pkg install russellseymour/mypackage
```

## Screenshot

![Package Install Task](/images/package_install.png)
