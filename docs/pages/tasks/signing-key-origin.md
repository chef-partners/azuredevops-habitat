---
title: Signing Key Origin
permalink: signing-key-origin.html
---

# Signing Key Origin

| **VSTS Task Name**           | **VSTS Phase** |
|------------------------------|----------------|
| Signing Origin Key (Habitat) | Build          |

## Summary

Copies the signing key to the agent.

## Description

Copy the signing key, as specified in the [[Habitat Endpoint]], so that built Habitat packages can be signed before being upload to the specified depot.

## Settings

| Setting        | Required | Default Value   | Description                               |
|----------------|----------|-----------------|-------------------------------------------|
| Display name   | yes      | Install Habitat | Set the display name for this task        |
| Habitat Origin | yes      | None            | The Habitat Endpoint to use for this task |

## Screenshot

[[/images/signing_key_origin.png|Signing Key Origin Task]]
