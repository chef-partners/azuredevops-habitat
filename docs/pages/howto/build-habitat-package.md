---
title: Build Habitat Package
permalink: build-habitat-package.html
---

Create a new project or use an existing one to upload your Habitat based application so that a build process can be created around it.

_NOTE: In this example the default project that is created when a new VSTS account os created will be used. This is called 'MyFirstProject'._

1. From the **'Build and Release'** drop down, select **'Builds'**.
2. Click on the **'New Definition'** button.
3. Click the **'Empty Process'** link
4. Select the **'Default agent queue'** that will be used to build this definition
5. Add the following tasks to the definition
    * Install Habitat
      * Leave everything as default
    * Signing Origin Key (Habitat)
      * Select the Habitat Origin that was created in step 2 from the drop down menu
    * Shell Script<br />
    In order to set the Habitat package version to the same value as the VSTS Build Number a very simple script is used to write the build number to a file. This is then read by the build task to version the package. The script contents are and, in this case, should be called `setBuildNumber.sh` in the project:

          echo $1 > buildnumber

      * Set the **'Display name'** to something useful
      * Set the **'Script Path'** to where the script that will take the build number as a parameter exists. (Use the ellipsis at the end of the textbox to select the file from the GUI).
      * Set the **'Arguments'** to the VSTS variable for the build number - $(Build.BuildNumber).
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
6. Select **'Options'** and in the **'Build number format'** set the following pattern `0.0$(Rev:.r)`.
      * This will ensure that the build number increments each time if there have been no other changes to the build number.
7. Now click on **'Save and queue'** and select the option to **'Save'** the new definition.
      * Complete the summary of changes that have been made if so desired.
10. Queue a new build by clicking on the **'Queue'** button at the near the top right of the screen.

`*` In order to set the Habitat package version to the same value 

<div style="text-align: center">
<a href="http://www.youtube.com/watch?feature=player_embedded&v=IwDtpri0j5Q" target="_blank"><img src="http://img.youtube.com/vi/IwDtpri0j5Q/0.jpg" alt="Install shared extension" width="480" height="360" border="10" /></a>
</div>