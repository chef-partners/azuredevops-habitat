/**
 * Script respoinsible for tagging the resultant docker image
 *
 * @author Russell Seymour
 */

// Import tasks from vsts
import * as tl from "azure-pipelines-task-lib/task";

// Import common tasks
import * as task from "./common/TaskConfiguration";

import {sprintf} from "sprintf-js";

async function run() {

    // initialise the settings class
    let taskParameters = new task.TaskParameters();

    // get the parameters and default settings
    let required = [
        "habitatDockerRepo",
        "habitatDockerVersionTag"
    ];

    let params = await taskParameters.getTaskParameters(required);

    // Get the necessary variables
    let pkg_origin = tl.getVariable("pkg_origin");
    let pkg_name = tl.getVariable("pkg_name");
    let pkg_version = tl.getVariable("pkg_version");
    let pkg_release = tl.getVariable("pkg_release");

    // determine the source and target tags
    let source_tag = sprintf("%s/%s:%s-%s", pkg_origin, pkg_name, pkg_version, pkg_release);
    let target_tag = sprintf("%s/%s/%s", params.dockerRepo, pkg_origin, pkg_name);

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

run();