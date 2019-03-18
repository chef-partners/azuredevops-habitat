---
title: Tag an Image
permalink: tag-an-image.html
---

| **Azure DevOps Task Name**     | **Azure DevOps Phase** |
|------------------------|----------------|
| Tag an Image (Habitat) | Release        |

## Summary

Tags a Docker image that has been exported from Habitat.

As of version 3.x of the extension this task is **DEPRECATED**. It will be removed from version 4 onwards.
The reason for the deprecation is because a file of the tags that should be applied to the Docker image can be written out by the Expose Habitat Build Variables task. Then with the Docker task this file can be passed in as a parameter to tag the image accordingly.

## Description

It is not possible to tag a Docker image that is exported from Habitat. However if the image needs to be uploaded to a Docker Registry (using one of the Azure DevOps Docker tasks) then it must be tagged. This task allows the tagging of the exported image.

This task requires Docker to be installed.

NOTE: This is just a tagging task, it does not perform the upload to the specified Docker Repo.

## Settings

| Setting                     | Required                                                                         | Default Value                              | Description                                       |
|-----------------------------|----------------------------------------------------------------------------------|--------------------------------------------|---------------------------------------------------|
| Display name                | yes                                                                              | Install Habitat                            | Set the display name for this task                |
| Docker Repo                 | yes                                                                              | docker.io                                  | Target Docker registry. Can be a private registry |
| Version Tag                 | yes                                                                              | `$(Build.BuildNumber)`                     | Version to tag the image with                     |
| Last Build Environment File | `$(System.DefaultWorkingDirectory)/$(System.TeamProject)-CI/drop/last_build.env` | Path to the Habitat build environment file |                                                   |

The variables specified in the table above come from Azure DevOps. A list of well known variables can be found [here](https://www.visualstudio.com/en-us/docs/build/define/variables).

## Command

| Variable / Setting      | Example Value  |
|-------------------------|----------------|
| `$(System.TeamProject)` | HelloWorld     |
| `$(Build.BuildNumber)`  | 1.1.15         |
| Origin                  | russellseymour |
| Format                  | docker         |
| Package Name            | mypackage      |
| Release                 | 20170607113423 |

Given the settings and variables in the table above, the resultant command that the task will run is:

```bash
$> docker tag russellseymour/mypackage:1.1.15-20170607113423 docker.io/russellseymour/mypackage:1.1.15
```

## Screenshot

![Tag an Image Task](/images/tag_an_image.png)
