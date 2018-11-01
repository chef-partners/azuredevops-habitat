
// Import tasks from vsts
import * as tl from "azure-pipelines-task-lib/task";

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
        "habitatPackagePath",
        "habitatPackageChannel"
    ];

    let params = await taskParameters.getTaskParameters(required, "habitatOrigin");

    // find the package file that has been referenced
    let package_files = glob.sync(params.packagePath);

    // state how many files are to be exported
    console.log("Package files path: %s", params.packagePath);
    console.log("Number of packages to be exported: %s", String(package_files.length));

    // if there are no packages to upload throw an error
    if (package_files.length === 0) {
        tl.setResult(tl.TaskResult.Failed, "No packages found for export");
    } else {

        // iterate around the package files that have been found
        for (let i = 0; i < package_files.length; i ++) {

            // ensure that the file exists
            if (tl.exist(package_files[0])) {

                console.log("Exporting package: %s", package_files[0]);

                // build up the command that needs to be run
                let cmd = params.paths["habitat"];

                // create an array for the args
                let args_parts = ["pkg export"];

                // add the depot URL
                args_parts.push(sprintf("--url %s", params.depotUrl));

                // if a channel has been specified on the task add it here
                if (params.packageChannel) {
                    console.log("Habitat Channel: %s", params.packageChannel);
                    args_parts.push(sprintf("--channel %s", params.packageChannel));
                }

                // add in the export format
                args_parts.push(params.exportFormat);

                // add in the package file to export
                args_parts.push(package_files[0]);

                // join the args_parts together to get the args
                let args = args_parts.join(" ");

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