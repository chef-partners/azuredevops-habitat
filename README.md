# Habitat Extension for Azure DevOps

[![Build status](https://dev.azure.com/chef-software/vsts-habitat/_apis/build/status/vsts-habitat-CI)](https://dev.azure.com/chef-software/vsts-habitat/_build/latest?definitionId=1)

This repo contains the code and build process for the Habitat Extension for Azure DevOps.

## Documentation

For usage documentation please refer to the [Azure DevOps Habitat Extension](https://chef-partners.github.io/azuredevops-habitat) documentation website.

If you find a mistake or an error in the documentation then please raise an issue here so we can fix it or submit the correction using a PR.

Is it possible to run the documentation locally, if you have cloned this repo and have Docker installed. To do so run the following:

## Linux / MacOS

```bash
docker run --rm --it --volume "docs/:/srv/jekyll" -p 4000:4000 jekyll/jekyll:3.8 jekyll serve
```

## PowerShell

```powershell
docker run --rm --it --volume "${PWD}/docs/:/srv/jekyll" -p 4000:4000 jekyll/jekyll:3.8 jekyll serve
```


## Development

The extension is written in TypeScript which is transpiled to JavaScript using a build process written, again, in TypeScript. If you wish to look at how things work and create the package on a local machine then use the following command:

```bash
npm run build:tasks
```

This will execute all of the processes that are required and create two packages in the `build` directory.

The build process is configured using the `build.json` file. This file contains information about the tasks to include and the files that need to be added to the resultant VSIX file.

| Property Name | Description |
|---|---|
| `dirs.output` | Output directory for build and artifacts |
| `task_libs` | Hash containing a list of common library files that need to be copied into task directories |
| `files.task` | Array of static files that need to copied from each src task folder into the built task folder |
| `files.extension` | Array of hash containing `source` and optionally a `target` of files or directories that need to copied into the root of the extension. |

