
// Import tasks from vsts
import * as tl from "vsts-task-lib/task";

// Import common tasks
import * as inputs from "./common/inputs";

import {sprintf} from "sprintf-js";

async function run() {

    // get the parameters that have been set on the task
    let params = inputs.parse(process, tl);

    // attempt to perform the build
    // build up the arguments to run
    let args = sprintf("pkg build -s %s %s", params["habitatSrcPath"], params["habitatPlanContext"]);

    try {
        let exit_code = await tl.tool("/tmp/hab").line(args).exec();
    } catch (err) {
        tl.setResult(tl.TaskResult.Failed, err.message);
    }
}

run();