
// Import tasks from vsts
import * as tl from "vsts-task-lib/task";

// Import common tasks
import * as inputs from "./common/inputs";

// Import library to read environment vars from files
import {config} from "dotenv";

import {sprintf} from "sprintf-js";

import * as fs from "fs-extra"

async function run() {

    // Get the parameters from the inputs
    let params = inputs.parse(process, tl)

    // check that the file exists to read the environment variables from
    // this is so that the local version tag is retrieved
    if (!fs.existsSync(params["habitatLastBuildEnvPath"])) {
        tl.setResult(tl.TaskResult.Failed, sprintf("Unable to locate last build environment file: %s", params["habitatLastBuildEnvPath"]));
    } else {

        // read in the environment variables
        config({path: params["habitatLastBuildEnvPath"]})

        // determine the source and target tags
        let source_tag = sprintf("%s/%s:%s-%s", process.env.pkg_origin, process.env.pkg_name, process.env.pkg_version, process.env.pkg_release)
        let target_tag = sprintf("%s/%s/%s", params["habitatDockerRepo"], process.env.pkg_origin, process.env.pkg_name)

        // Determine if the version tag has been set, and add it to the target_tag if it has
        if (params["habitatDockerVersionTag"] != "") {
            target_tag = sprintf("%s:%s", target_tag, params["habitatDockerVersionTag"])
        }

        // build up the command to tag the exported image
        let cmd = "/usr/bin/docker";
        let args = sprintf("tag %s %s", source_tag, target_tag)

        try {
            let exit_code = await tl.tool(cmd).line(args).exec()
        } catch (err) {
            tl.setResult(tl.TaskResult.Failed, err.message)
        }
    }

} 

run();