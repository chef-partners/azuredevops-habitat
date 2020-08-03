// Import tasks from vsts
import * as tl from "azure-pipelines-task-lib/task";

// Import library to get the task parameters
import * as task from "./common/TaskConfiguration";

// Import libraries to support the unpacking of the habitat archive
import * as decompress from "decompress";
import * as decompressTargz from "decompress-targz";
import * as decompressUnzip from "decompress-unzip";

import * as path from "path";
import {sprintf} from "sprintf-js";
import * as os from "os";

async function run() {

    // initialise the settings class
    let taskParameters = new task.TaskParameters();

    let params = await taskParameters.getTaskParameters([], "habitatOrigin");

    // check that hab does not already exist
    if (!tl.exist(params.paths["habitat"])) {

        console.log("Installing Habitat");

        // download, unzip and copy habitat
        try {

            // build up the command to download the file, dependning on the operating system
            let cmd = "";
            let args = "";

            if (params.isWindows) {
                cmd = "powershell";
                args = sprintf("-Command Invoke-RestMethod -Uri %s -OutFile %s", params.scriptUrl, params.paths["download_path"]);
            } else {
                cmd = "curl";
                args = sprintf("-L %s --output %s", params.scriptUrl, params.paths["download_path"]);
            }

            let curl_exit_code = await tl.tool(cmd).line(args).exec();

            // Ensure that the unpack_path exists
            if (!tl.exist(params.paths["unpack_path"])) {
                tl.mkdirP(path.dirname(params.paths["unpack_path"]));
            }

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

            // if running in Linux link hab into /tmp so as not to break existing systems
            if (os.platform() !== "win32") {
                tl.tool("ln").line("-s /usr/local/bin/hab /tmp/hab").execSync();
            }

        } catch (err) {
            tl.setResult(tl.TaskResult.Failed, err.message);
        }
    } else {
        console.log("Habitat is installed: %s", params.paths["habitat"]);
    }

}

run();