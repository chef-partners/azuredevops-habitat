/**
 * Script respoinsible for tagging the resultant docker image
 *
 * @author Russell Seymour
 */

// Import tasks from vsts
import * as tl from "azure-pipelines-task-lib/task";

// Import common tasks
import * as task from "./common/TaskConfiguration";

// Import library to read environment vars from files
import {config} from "dotenv";

import {sprintf} from "sprintf-js";

async function run() {

    // initialise the settings class
    let taskParameters = new task.TaskParameters();

    // get the parameters and default settings
    let required = [
        "habitatLastBuildEnvPath",
        "habitatDockerRepo",
        "habitatDockerVersionTag"
    ];

    let params = await taskParameters.getTaskParameters(required);

    // check that the file exists to read the environment variables from
    // this is so that the local version tag is retrieved
    if (!tl.exist(params.lastBuildEnvPath)) {
        tl.setResult(tl.TaskResult.Failed, sprintf("Unable to locate last build environment file: %s", params.lastBuildEnvPath));
    } else {

        // read in the environment variables
        config({path: params.lastBuildEnvPath});

        // determine the source and target tags
        let source_tag = sprintf("%s/%s:%s-%s", process.env.pkg_origin, process.env.pkg_name, process.env.pkg_version, process.env.pkg_release);
        let target_tag = sprintf("%s/%s/%s", params.dockerRepo, process.env.pkg_origin, process.env.pkg_name);

        // Determine if the version tag has been set, and add it to the target_tag if it has
        if (params.dockerVersionTag !== "") {
            target_tag = sprintf("%s:%s", target_tag, params.dockerVersionTag);
        }

        // build up the command to tag the exported image
        let cmd = "/usr/bin/docker";
        let args = sprintf("tag %s %s", source_tag, target_tag);

        // output the command being run when in debug mode
        tl.debug(sprintf("Command: %s %s", cmd, args));

        try {
            let exit_code = await tl.tool(cmd).line(args).exec();
        } catch (err) {
            tl.setResult(tl.TaskResult.Failed, err.message);
        }
    }
}

run();