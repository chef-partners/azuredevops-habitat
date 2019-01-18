---
title: Build Plan
permalink: build-plan.html
---

# Build Plan

| **Azure DevOps Task Name**   | **Azure DevOps Phase** |
|----------------------|----------------|
| Build Plan (Habitat) | Build          |

## Summary

Builds the Habitat package

## Description

Builds the package using the specified plan.sh. Some defaults have been added to the task but these can be modified as required.

## Settings

| Setting      | Required | Default Value               | Description                                                |
|--------------|----------|-----------------------------|------------------------------------------------------------|
| Display name | yes      | Install Habitat             | Set the display name for this task                         |
| Source Path  | yes      | `$(Build.SourcesDirectory)` | Root of the project                                        |
| Plan Context | yes      | habitat                     | Directory within the project that holds the `plan.sh` file |

The variable specified in the "Source Path" above comes from Azure DevOps. A list of well known variables can be found [here](https://www.visualstudio.com/en-us/docs/build/define/variables).

## Command

| Variable                    | Example Value                   |
|-----------------------------|---------------------------------|
| `$(Build.SourcesDirectory)` | `/usr/local/vsts-agent/_work/s` |

Given the variables in the table above this task would run the following command:

```bash
$> hab pkg -s /usr/local/vsts-agent/_work/s habitat
```

## Screenshot

![Build Plan Task](/images/build_plan.png)
