---
title: Build Habitat Package
permalink: build-habitat-package.html
---

Create a new project or use an existing one to upload your Habitat based application so that a build process can be created around it.

_NOTE: In this example the default project that is created when a new Azure DevOps account is created will be used. This is called 'MyFirstProject'._

1. From the **'Build and Release'** drop down, select **'Builds'**.
2. Click on the **'New Definition'** button.
3. Click the **'Empty Process'** link
4. Select the **'Default agent queue'** that will be used to build this definition
5. Add the following tasks to the definition
    * Install Habitat
      * Leave everything as default
    * Signing Origin Key (Habitat)
      * Select the Habitat Origin that was created in [Create Habitat Endpoint](/habitat-endpoint.html) from the drop down menu
    * Expose Habitat Build Variables
      * Select **'Set Build Number'** which will make Azure DevOps take the build number from Habitat
    * Build Plan (Habitat)
      * For the purposes of this demo the values can be left as default. However if the project being built has a different project structure then path to the plan and the source directory can be modified if required.
    * Copy Files
      * Set the **'Display Name'** to something useful
      * Set the **'Source Folder'** to the path that the hart file and the build number file will be set. In this demo the path is `$(Build.SourcesDirectory)/results`.<br /><br />
      NOTE: The path will not be selectable from the ellipsis as this project has not been built yet thus the results folder will not exist.
      * Set the **'Contents'**, which is a list of the files that need to be copied to the artifacts directory. As the HART and environment variables file is required the following should be set:<br /><br />
	`*-$(Build.BuildNumber)-*.hart`<br />
	`Last_build.env`
      * Set the **'Target Folder'** to `$(Build.ArtifactsStagingDirectory)`.
    * Publish Build Artifacts
      * Set the **'Display name'** to something useful
      * Set the **'Path to Publish'** to the same value as the Target Folder in the last task, so in this example it will be `$(Build.ArtifactsStagingDirectory)`.
      * Leave the **'Artifact Type'** as Server.
6. Now click on **'Save and queue'** and select the option to **'Save'** the new definition.
      * Complete the summary of changes that have been made if so desired.
7. Queue a new build by clicking on the **'Queue'** button at the near the top right of the screen.

