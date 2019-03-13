/**
 * Script to read in the `last_build.env` file and expose the variables
 * to the VSTS environment for other tasks to be able to access
 *
 * @author Russell Seymour
 */

// Import tasks from vsts
import * as tl from "azure-pipelines-task-lib/task";

// Import common tasks
import * as task from "./common/TaskConfiguration";

// Import library to read environment vars from files
import {config, parse} from "dotenv";
import * as fs from "fs";
import * as path from "path";

import {sprintf} from "sprintf-js";

async function run() {

  // initialise the settings class
  let taskParameters = new task.TaskParameters();

  // define the parameters that this task requires
  let required = [
      "habitatLastBuildEnvPath",
      "habitatSetBuildNumber",
      "habitatSetImageNames",
      "habitatImageNames",
      "habitatImageNamesFilename"
  ];

  let params = await taskParameters.getTaskParameters(required);

  let filepath = params.lastBuildEnvPath;
  if (!tl.exist(filepath)) {
    tl.setResult(tl.TaskResult.Failed, sprintf("Unable to locate last build environment: %s", filepath));
  } else {

    // check to see if the lastBuildEnvPath has the file ste on it
    // if it does raise a warning with advice on how to fix it
    let env_file_specified = filepath.match(/last_build\.(ps1|env)/g);
    if (env_file_specified != null) {
      tl.setResult(tl.TaskResult.Failed, sprintf("The full path to the last build environment file has been specified. The task will determine the correct file based on the agent operating system. Please change the task parameter 'Build Environment File' to a directory containing the environment file"));
    }

    // Using the params.isWindows property determine the path to the last_build file and parse it accordingly
    if (params.isWindows) {

      // set the the path to the powershell file
      filepath = path.join(filepath, "last_build.ps1");

      // Fail the task if the file does not exist
      if (!tl.exist(filepath)) {
        tl.setResult(tl.TaskResult.Failed, sprintf("Unable to locate last build environment file: %s", filepath));
      }

      // this is a powershell file so it will not be read by the dotenv module properly
      // it needs to be read it, the preceeding $ removed and then parsed
      tl.debug(sprintf("Reading last build environment file: %s", filepath));
      let content = fs.readFileSync(filepath, "utf8");

      // remove $ from the beginning of any lines
      tl.debug("Removing '$' from the beginning of each line");
      let pattern = /\$/g;
      content = content.replace(pattern, "");

      // parse the string to get the necessary config object
      let parsed = parse(content);

      // Iterate around the object setting the environment variables
      // This is because the parse is an exposed method from dotenv and it does not
      // have an exposed function to turn the object into env vars
      Object.keys(parsed).forEach(function (key) {
        if (!process.env.hasOwnProperty(key)) {
          tl.debug(sprintf("Processing build env '[%s]': %s", key, parsed[key]));
          process.env[key] = parsed[key];
        } else {
          tl.debug(sprintf("Environment variable is already set, not overwriting: %s", key));
        }
      });

    } else {

      // set the path
      filepath = path.join(filepath, "last_build.env");

      tl.debug(sprintf("Reading last build environment file: %s", path));

      // Fail the task if the file does not exist
      if (!tl.exist(filepath)) {
        tl.setResult(tl.TaskResult.Failed, sprintf("Unable to locate last build environment file: %s", filepath));
      }

      // read in the environment variables
      config({path: path});
    }

    // define list of habitat variables that are to be exposed
    // this is so that it can be iterated over
    let habitat_var_names = [
      "pkg_origin",
      "pkg_name",
      "pkg_version",
      "pkg_release",
      "pkg_ident",
      "pkg_artifact",
      "pkg_sha256sum",
      "pkg_blake2bsum"
    ];

    // iterate around the habitat var names and set the build environment variables
    for (let habitat_var_name of habitat_var_names)
    {
      tl.debug(sprintf("Setting variable '%s': %s", habitat_var_name, process.env[habitat_var_name]));

      // now set the variable
      tl.setVariable(habitat_var_name, process.env[habitat_var_name]);
    }

    // if the option has been set to set the build number do it now
    if (params.setBuildNumber) {
      let build_number = sprintf("%s-%s", process.env["pkg_version"], process.env["pkg_release"]);
      console.log("Setting Build Number: %s", build_number);
      console.log("##vso[build.updatebuildnumber]%s", build_number);
    }

    // if the option has been specified to set the images to tag, write out the filename
    // and set the variable name to use
    if (params.setImageNames) {
      console.log("Writing image names file: %s", params.imageNamesFilename);

      // evaluate the string so that variables can be expanded
      let contents = expandenv(params.imageNames);
      tl.writeFile(params.imageNamesFilename, contents);

      // set the path to the imagefilename as a variable
      tl.setVariable("image_names_filename", params.imageNamesFilename);
    }
  }

}

function expandenv(phrase, env = {}) {
  if (!phrase) {
    throw new Error("Please pass a string into expandenv");
  }

  env = merge(process.env, (env || {}));

  return phrase.replace(/\$[\w]+/g, function(match) {
    return env[match.replace("$", "")] || match;
  });
}

function merge(orig, newObj) {
  let result = new Object(orig);

  Object.keys(newObj).forEach(function(key) {
    if (newObj.hasOwnProperty(key)) {
      result[key] = newObj[key];
    }
  });

  return result;
}

run();