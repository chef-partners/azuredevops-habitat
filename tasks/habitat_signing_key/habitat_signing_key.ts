
// Import tasks from vsts
import * as tl from "vsts-task-lib/task";

// Import common tasks
import * as task from "./common/TaskConfiguration";

import * as path from "path";

import {sprintf} from "sprintf-js";

async function run() {

    // initialise the settings class
    let taskParameters = new task.TaskParameters();

    // get the parameters and default settings
    let required = [
        "habitatOriginName",
        "habitatOriginRevision"
    ];

    let params = await taskParameters.getTaskParameters(required, "habitatOrigin");

    // Write out the origin name as well as the auth token
    tl.debug(sprintf("Writing out config file: %s", params.paths["config_file"]));
    let content = sprintf(`auth_token = "%s"
    origin = "%s"`, params.authToken, params.originName);
    tl.writeFile(params.paths["config_file"], content);

    // determine the filenames for the signing key pair
    let origin_base = sprintf("%s-%s", params.originName, params.originRevision);
    let public_key_path = path.join(params.paths["signing_keys"], sprintf("%s.pub", origin_base));
    let signing_key_path = path.join(params.paths["signing_keys"], sprintf("%s.sig.key", origin_base));

    tl.debug(sprintf("Public key path: %s", public_key_path));
    tl.debug(sprintf("Signing key path: %s", signing_key_path));

    // write out the data to the files
    tl.writeFile(public_key_path, params.originPublicKey);
    tl.writeFile(signing_key_path, params.originSigningKey);
}

run();