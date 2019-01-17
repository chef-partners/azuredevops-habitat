---
title: Install Habitat
layout: default
permalink: install-habitat.html
---

# Install Habitat

| **VSTS Task Name** | **VSTS Phase** |
|--------------------|----------------|
| Install Habitat    | Build          |

## Summary 

Installs Habitat on the agent machine.

## Description

The task will install `hab` to `/tmp/hab`, this is because this is normally world writable in Linux machines. The task will check to see if the file is already there and if not it will download the latest version.

It does not currently handle updates of the command nor does it support specific versions of Habitat.

This is an essential task to have at the start of your pipeline because all subsequent Habitat tasks expect to run it from `/tmp/hab`. This is so that the location is always known and there are no path issues. This means that even if Habitat is installed on the machine in a different location is will not be used.

## Settings

| Setting      | Required | Default Value   | Description                        |
|--------------|----------|-----------------|------------------------------------|
| Display name | yes      | Install Habitat | Set the display name for this task |

## Screenshot

[[/images/install_habitat.png|Install Habitat Task]]
