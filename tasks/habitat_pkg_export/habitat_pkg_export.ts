
// Import tasks from vsts
import * as tl from "vsts-task-lib/task";

// Import common tasks
import * as task from "./common/TaskConfiguration";

import {sprintf} from "sprintf-js";

function run(): Promise<void> {

    // initialise the settings class
    let taskParameters = new task.TaskParameters();

    // get the parameters and default settings
    let required = [
        "habitatExportFormat",
        "habitatOriginName",
        "habitatExportVersion",
        "habitatUseSudo"
    ];

    return taskParameters.getTaskParameters(required).then((params) => {

        // build up the command to run
        // this needs to be adjusted if useSudo is true
        let cmd = params.paths["habitat"];
        let args = sprintf("pkg export %s %s/%s/%s", params.exportFormat, params.originName, params.exportName, params.exportVersion);

        if (params.useSudo) {
            args = sprintf("%s %s", cmd, args);
            cmd = "sudo";
        }

        // if in debug mode output the command that is being executed
        tl.debug(sprintf("Command: %s", cmd, args));

        try {
            let exit_code = tl.tool(cmd).line(args).execSync();
        } catch (err) {
            tl.setResult(tl.TaskResult.Failed, err.message);
        }
    });
}

run().then((result) =>
    tl.setResult(tl.TaskResult.Succeeded, "")
).catch((error) =>
    tl.setResult(tl.TaskResult.Failed, error)
);