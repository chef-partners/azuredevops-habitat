---
title: Package Upload
permalink: package-upload.html
---

# Package Upload

| **VSTS Task Name**       | **VSTS Phase** |
|--------------------------|----------------|
| Package Upload (Habitat) | Release        |

## Summary

Uploads a Habitat package to the specified depot.

## Description

Uploads the built Habitat package to the Depot as specfied in the Habitat Endpoint.

## Settings

| Setting        | Required | Default Value   | Description                               |
|----------------|----------|-----------------|-------------------------------------------|
| Display name   | yes      | Install Habitat | Set the display name for this task        |
| Habitat Origin | yes      | None            | The Habitat Endpoint to use for this task |
| Package Path   | yes      | None            | Path to where the built package is        |

It is possible to use the ellipsis at the end of the text field to select the package to be uploaded, however this will be static and will only ever upload that one package. Additionally if the pipeline has not been run then there will be artifacts to select.

It is suggested that the path is built up using [VSTS variables](https://www.visualstudio.com/en-us/docs/build/define/variables), as can be seen in the screenshot below.

## Command

The agent runs the following Habitat command (after all the variable substitutions have been performed)

```bash
$> hab pkg upload <PACKAGE_NAME>
```

## Screenshot

[[/images/package_upload.png | Package Upload Task]]
