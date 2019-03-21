
// Import tasks from vsts
import * as tl from "azure-pipelines-task-lib/task";

// Import common tasks
import * as task from "./common/TaskConfiguration";

import * as path from "path";

import {sprintf} from "sprintf-js";
import { debug } from "util";

async function run() {

    // initialise the settings class
    let taskParameters = new task.TaskParameters();

    // get the parameters and default settings
    let required = [
        "habitatOriginName",
        "habitatOriginRevision",
        "taskAction"
    ];

    let params = await taskParameters.getTaskParameters(required, "habitatOrigin");

    // determine the filenames for the signing key pair
    let origin_base = sprintf("%s-%s", params.originName, params.originRevision);
    let public_key_path = path.join(params.paths["signing_keys"], sprintf("%s.pub", origin_base));
    let signing_key_path = path.join(params.paths["signing_keys"], sprintf("%s.sig.key", origin_base));

    tl.debug(sprintf("Public key path: %s", public_key_path));
    tl.debug(sprintf("Signing key path: %s", signing_key_path));

    // depending on the task action, either create or remove the files
    switch (params.taskAction) {
        case "install":

            console.log("Creating signing key files and configuration");

            // Write out the origin name as well as the auth token
            tl.debug(sprintf("Writing out config file: %s", params.paths["config_file"]));
            let content = sprintf(`origin = "%s"`, params.originName);
            tl.writeFile(params.paths["config_file"], content);

            // write out the data to the files
            tl.writeFile(public_key_path, params.originPublicKey);
            tl.writeFile(signing_key_path, params.originSigningKey);

            // Set environment variables to assist the build
            // These are the HAB_ORIGIN and the HAB_CACHE_KEY_PATH
            tl.debug(sprintf("Setting environment variable for HAB_ORIGIN: %s", params.originName));
            tl.setVariable("HAB_ORIGIN", params.originName);
            tl.debug(sprintf("Setting environment variable for HAB_CACHE_KEY_PATH: %s", params.paths["signing_keys"]));
            tl.setVariable("HAB_CACHE_KEY_PATH", params.paths["signing_keys"]);

            break;

        case "remove":

            console.log("Removing signing key files and configuration");

            if (tl.exist(params.paths["config_file"])) {
                tl.rmRF(params.paths["config_file"]);
            }

            if (tl.exist(public_key_path)) {
                tl.rmRF(public_key_path);
            }

            if (tl.exist(signing_key_path)) {
                tl.rmRF(signing_key_path);
            }

            break;
    }
}

run();