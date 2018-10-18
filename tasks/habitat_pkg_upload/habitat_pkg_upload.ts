
// Import tasks from vsts
import * as tl from "vsts-task-lib/task";

// Import common tasks
import * as task from "./common/TaskConfiguration";

// Import the glob library so that wildcard paths can be resolved
import * as glob from "glob";

import {sprintf} from "sprintf-js";

async function run() {

    // initialise the settings class
    let taskParameters = new task.TaskParameters();

    // get the parameters and default settings
    let required = [
        "habitatPackagePath"
    ];

    let params = await taskParameters.getTaskParameters(required);

    // find the package file that has been referenced
    let package_files = glob.sync(params.packagePath);

    // state how many files are to be exported
    console.log("Package files path: %s", params.packagePath);
    console.log("Number of packages to be exported: %s", String(package_files.length));

    // if there are no packages to upload throw an error
    if (package_files.length === 0) {
        tl.setResult(tl.TaskResult.Failed, "No packages found for upload");
    } else {

        // iterate around the package files that have been found
        for (let i = 0; i < package_files.length; i ++) {

            // ensure that the file exists
            if (tl.exist(package_files[0])) {

                console.log("Uploading package: %s", package_files[0]);

                // build up the command that needs to be run
                let cmd = params.paths["habitat"];
                let args = sprintf("pkg upload %s", package_files[0]);

                // if a channel has been specified, add it to the command
                if (params.packageChannel) {
                    console.log("Package Channel: %s", params.packageChannel);
                    args = sprintf("%s --channel %s", args, params.packageChannel);
                }

                // if in debug mode output the command being executed
                tl.debug(sprintf("Command: %s %s", cmd, args));

                // execute the upload to the depot
                try {
                    let exit_code = await tl.tool(cmd).line(args).exec();
                    tl.debug(sprintf("Exit code: %s", String(exit_code)));
                } catch (err) {
                    tl.setResult(tl.TaskResult.Failed, err.message);
                }
            }
        }
    }
}

run();