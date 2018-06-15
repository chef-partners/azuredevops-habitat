
// Import tasks from vsts
import * as tl from "vsts-task-lib/task";

// Import common tasks
import * as inputs from "./common/inputs";

import {sprintf} from "sprintf-js";

async function run() {

    // get the parameters
    let params = inputs.parse(process, tl);

    // based on the useSudo option, set the command and arguments
    let cmd = "/tmp/hab";
    let args = sprintf("pkg export %s %s/%s/%s", params["habitatExportFormat"], params["habitatOriginName"], params["habitatExportName"], params["habitatExportVersion"]);
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

run();