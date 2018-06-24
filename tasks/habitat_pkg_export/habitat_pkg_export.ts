
// Import tasks from vsts
import * as tl from "vsts-task-lib/task";

// Import the glob library so that wildcard paths can be resolved
import * as glob from "glob";

// Import common tasks
import * as task from "./common/TaskConfiguration";

import {sprintf} from "sprintf-js";

async function run() {

    // initialise the settings class
    let taskParameters = new task.TaskParameters();

    // get the parameters and default settings
    let required = [
        "habitatExportFormat",
        "habitatPackagePath"
    ];

    let params = await taskParameters.getTaskParameters(required);

    // error if the package path cannot be located
    if (tl.exist(params.packagePath)) {

        // find the package file that has been referenced
        let package_files = glob.sync(params.packagePath);

        // state how many files are to be exported
        console.log("Number of packages to be exported: %s", String(package_files.length));

        // iterate around the package files that have been found
        for (let i = 0; i < package_files.length; i ++) {

            // ensure that the file exists
            if (tl.exist(package_files[0])) {

                // build up the command that needs to be run
                let cmd = params.paths["habitat"];
                let args = sprintf("pkg export %s %s", params.exportFormat, package_files[0]);

                // if in debug mode output the command being executed
                tl.debug(sprintf("Command: %s %s", cmd, args));

                // execute the upload to the depot
                try {
                    let exit_code = await tl.tool(cmd).line(args).exec;
                } catch (err) {
                    tl.setResult(tl.TaskResult.Failed, err.message);
                }
            }
        }
    } else {
        tl.setResult(tl.TaskResult.Failed, sprintf("Package path could not be located: %s", params.packagePath));
    }
}

run();