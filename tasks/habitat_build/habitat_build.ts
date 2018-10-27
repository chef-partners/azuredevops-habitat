
// Import tasks from vsts
import * as tl from "azure-pipelines-task-lib/task";

// Import common tasks
import * as task from "./common/TaskConfiguration";

import {sprintf} from "sprintf-js";

async function run() {

    // initialise the settings class
    let taskParameters = new task.TaskParameters();

    // define the parameters that this task requires
    let required = [
        "habitatSrcPath",
        "habitatPlanContext"
    ];

    let params = await taskParameters.getTaskParameters(required);

    // attempt to perform the build
    // build up the arguments to run
    let cmd = params.paths["habitat"];
    let args = sprintf("pkg build -s %s %s", params.srcPath, params.planContext);

    // Output the command being run when in debug mode
    tl.debug(sprintf("Command: %s %s", cmd, args));

    try {
        let exit_code = await tl.tool(cmd).line(args).exec();
    } catch (err) {
        tl.setResult(tl.TaskResult.Failed, err.message);
    }
}

run();
