
// Import tasks from vsts
import * as tl from "vsts-task-lib/task";

// Import common tasks
import * as inputs from "./common/inputs";

import {sprintf} from "sprintf-js";

async function run() {

    // get the parameters
    let params = inputs.parse(process, tl)

    // build up the command that needs to be run
    let args = sprintf("pkg upload %s", params["habitatPackagePath"])

    // execute the upload to the depot
    try {
        let exit_code = await tl.tool("/tmp/hab").line(args).exec()
    } catch (err) {
        tl.setResult(tl.TaskResult.Failed, err.message)
    }    
}

run();