---
title: Habitat Endpoint
permalink: habitat-endpoint.html
---

# Habitat Endpoint

An endpoint, called 'Habitat Endpoint' is bundled with this extension. This allows multuple Habitat depots to be configured and reused across tasks as required.

VSTS endpoints hold secrets secret so this is the best place to add your Habitat signing key and GitHub token. This information will never be displayed in log files, but will be accessed by the tasks that need them.

[[/images/habitat_endpoint.png|Habitat Endpoint Screenshot]]

The following table describes each of the fields in the screenshot:

| Field Name        | Description                                                                                                 | Example                 |
|-------------------|-------------------------------------------------------------------------------------------------------------|-------------------------|
| Connection Name   | Name of this connection. This is what will be seen in the service drop down on appropriate tasks            | Habitat Depot           |
| Habitat Depot URL | This allows for private depots to be targeted when they are available.                                      | https://bldr.habitat.sh |
| Origin Name       | Name of the origin that will be used to build packages                                                      | myorigin                |
| Revision          | The revision of the origin to use                                                                           | 20170610095911          |
| Public Key        | The public key associated with the specified origin                                                         |                         |
| Signing Key       | The signing (private) key associated with the specified origin                                              |                         |
| GitHub Auth Key   | GitHub authentication token for publishing packages to the Habitat depot                                    |                         |
| Use Sudo          | Some habitat tasks may need to use `sudo` to work correctly, this option states if they are allows to do so | True                    |


- **Habitat Depot URL** - it is not possible to set a default value for this field, but it _is_ required. Use `https://bldr.habitat.sh`
- **Use Sudo** - the tasks that use `sudo` if it is configured are:
    - Install Package
    - Package Export
