---
title: Package Export
permalink: package-export.html
---

# Package Export

| **VSTS Task Name**       | **VSTS Phase** |
|--------------------------|----------------|
| Package Export (Habitat) | Release        |

## Summary

Export a Habitat package to a different format.

## Description

Export a package in a different format. Currently supported formats are:

 - Docker
 - Aci
 - Mesos
 - Tar

If the option to use `sudo` has been set in the Service Endpoint this task will use `sudo` to perform the export.

## Settings

| Setting                            | Required               | Default Value                                  | Description                                   |
|------------------------------------|------------------------|------------------------------------------------|-----------------------------------------------|
| Display name                       | yes                    | Install Habitat                                | Set the display name for this task            |
| Habitat Origin                     | yes                    | None                                           | The Habitat Endpoint to use for this task     |
| Export Format                      | yes                    | docker                                         | Format that the package should be exported to |
| Name                               | yes                    | `$(System.TeamProject)`                        | Name of the exported package                  |
| Version to export the package with | `$(Build.BuildNumber)` | Version that is attached to the exported image |                                               |

The variables specified in the table above come from VSTS. A list of well known variables can be found [here](https://www.visualstudio.com/en-us/docs/build/define/variables).

## Command

| Variable / Setting      | Example Value  |
|-------------------------|----------------|
| `$(System.TeamProject)` | HelloWorld     |
| `$(Build.BuildNumber)`  | 1.1.15         |
| Origin                  | russellseymour |
| Format                  | docker         |

Given the settings and variables in the table above, the resultant command that the task will run is:

```bash
$> hab pkg export docker russellseymour/HelloWorld/1.1.15
```

## Screenshot

[[/images/package_export.png | Package Export Task]]
