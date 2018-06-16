
// Import tasks from vsts
import * as tl from "vsts-task-lib/task";

// Import common tasks
import * as task from "./common/TaskConfiguration";

// Import the glob library so that wildcard paths can be resolved
import * as glob from "glob";

import {sprintf} from "sprintf-js";

function run(): Promise<void> {

    // initialise the settings class
    let taskParameters = new task.TaskParameters();

    // get the parameters and default settings
    let required = [
        "habitatPackagePath"
    ];

    return taskParameters.getTaskParameters(required).then((params) => {
        // find the package file that has been referenced
        let package_files = glob.sync(params.packagePath);

        // iterate around the package files that have been found
        for (let i = 0; i < package_files.length; i ++) {

            // ensure that the file exists
            if (tl.exist(package_files[0])) {

                // build up the command that needs to be run
                let cmd = params.paths["habitat"];
                let args = sprintf("pkg upload %s", package_files[0]);

                // if in debug mode output the command being executed
                tl.debug(sprintf("Command: %s %s", cmd, args));

                // execute the upload to the depot
                try {
                    let exit_code = tl.tool(cmd).line(args).execSync();
                } catch (err) {
                    tl.setResult(tl.TaskResult.Failed, err.message);
                }
            }
        }
    });
}

run().then((result) =>
    tl.setResult(tl.TaskResult.Succeeded, "")
).catch((error) =>
    tl.setResult(tl.TaskResult.Failed, error)
);