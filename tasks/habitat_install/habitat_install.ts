// Import tasks from vsts
import * as tl from "azure-pipelines-task-lib/task";

// Import library to get the task parameters
import * as task from "./common/TaskConfiguration";

// Import libraries to support the unpacking of the habitat archive
import * as decompress from "decompress";
import * as decompressTargz from "decompress-targz";
import * as decompressUnzip from "decompress-unzip";

import {sprintf} from "sprintf-js";

async function run() {

    // initialise the settings class
    let taskParameters = new task.TaskParameters();

    let params = await taskParameters.getTaskParameters([]);

    // check that hab does not already exist
    if (!tl.exist(params.paths["habitat"])) {

        console.log("Installing Habitat");

        // download, unzip and copy habitat
        try {

            // build up the command to download the file
            let cmd = "curl";
            let args = sprintf("-L %s --output %s", params.scriptUrl, params.paths["download_path"]);

            let curl_exit_code = await tl.tool(cmd).line(args).exec();

            // unpack the downloaded file into the unpack path
            // the decompress has a list of plugins to unpack the archive
            // this is set to support .tar.gz and .zip
            decompress(params.paths["download_path"], params.paths["unpack_path"], {
                plugins: [
                    decompressTargz(),
                    decompressUnzip()
                ],
                strip: 1
            }).then(() => {
                console.log("Habitat installed: %s", params.paths["unpack_path"]);
            });

        } catch (err) {
            tl.setResult(tl.TaskResult.Failed, err.message);
        }
    } else {
        console.log("Habitat is installed: %s", params.paths["habitat"]);
    }

}

run();