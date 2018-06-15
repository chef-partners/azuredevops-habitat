
// Import tasks from vsts
import * as tl from "vsts-task-lib/task";

// Import common tasks
import * as inputs from "./common/inputs";

// Import library to read environment vars from files
import {config} from "dotenv";

import {sprintf} from "sprintf-js";

import * as fs from "fs-extra";

async function run() {

    // get the parameters
    let params = inputs.parse(process, tl);

    // check that the file exists to read the environment variables from
    if (!fs.existsSync(params["habitatLastBuildEnvPath"])) {
        tl.setResult(tl.TaskResult.Failed, sprintf("Unable to locate last build environment file: %s", params["habitatLastBuildEnvPath"]));
    } else {

        // read in the environment variables
        config({path: params["habitatLastBuildEnvPath"]});

        // based on the useSudo option, set the command and arguments
        let cmd = "/tmp/hab";
        let args = sprintf("pkg install %s/%s", params["habitatArtifactFolder"], process.env.pkg_artifact);
        if (params["habitatUseSudo"] === 1) {
            args = sprintf("%s %s", cmd, args);
            cmd = "sudo";
        }

        try {
            let exit_code = await tl.tool(cmd).line(args).exec();
        } catch (err) {
            tl.setResult(tl.TaskResult.Failed, err.message);
        }
    }
}

run();