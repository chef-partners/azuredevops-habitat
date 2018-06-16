
// Import tasks from vsts
import * as tl from "vsts-task-lib/task";

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
        "habitatArtifactFolder",
        "habitatDockerVersionTag"
    ];

    let params = await taskParameters.getTaskParameters(required);

    if (!tl.exist(params.lastBuildEnvPath)) {
        tl.setResult(tl.TaskResult.Failed, sprintf("Unable to locate last build environment file: %s", params.lastBuildEnvPath));
    } else {

        // read in the environment variables
        config({path: params.lastBuildEnvPath});

        // based on the useSudo option, set the command and arguments
        let cmd = params.paths["habitat"];
        let args = sprintf("pkg install %s/%s", params.artifactFolder, process.env.pkg_artifact);
        if (params.useSudo) {
            args = sprintf("%s %s", cmd, args);
            cmd = "sudo";
        }

        // if in debug mode output the command being executed
        tl.debug(sprintf("Command: %s %s", cmd, args));

        try {
            let exit_code = await tl.tool(cmd).line(args).exec();
        } catch (err) {
            tl.setResult(tl.TaskResult.Failed, err.message);
        }
    }
}

run();