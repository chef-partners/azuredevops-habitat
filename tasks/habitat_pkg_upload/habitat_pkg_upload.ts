
// Import tasks from vsts
import * as tl from "vsts-task-lib/task";

// Import common tasks
import * as inputs from "./common/inputs";

// Import the glob library so that wildcard paths can be resolved
import * as glob from "glob";

import * as fs from "fs-extra";

import {sprintf} from "sprintf-js";

async function run() {

    // get the parameters
    let params = inputs.parse(process, tl);

    // find the package file that has been referenced
    let package_files = glob.sync(params["habitatPackagePath"]);

    // iterate around the package files that have been found
    for (let i = 0; i < package_files.length; i ++) {

        // ensure that the file exists
        if (fs.existsSync(package_files[0])) {

            // build up the command that needs to be run
            let args = sprintf("pkg upload %s", package_files[0]);

            // execute the upload to the depot
            try {
                let exit_code = await tl.tool("/tmp/hab").line(args).exec();
            } catch (err) {
                tl.setResult(tl.TaskResult.Failed, err.message);
            }
        }
    }
}

run();