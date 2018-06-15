// Import tasks from vsts
import * as tl from "vsts-task-lib/task";

// Import tasks for the filesystem
import * as fs from "fs-extra";

// Import libraries to support the unpacking of the habitat archive
import * as decompress from "decompress";
import * as decompressTargz from "decompress-targz";

import * as os from "os";

import {sprintf} from "sprintf-js";

function installHabitat() {

    // determine the platform
    switch (os.platform()) {
        case "linux":

            let url = "https://api.bintray.com/content/habitat/stable/linux/x86_64/hab-%24latest-x86_64-linux.tar.gz?bt_package=hab-x86_64-linux";

            // check that hab does not already exist
            if (!fs.existsSync("/tmp/hab")) {

                console.log("Installing Habitat");

                // download, unzip and copy habitat
                try {

                    let curl_exit_code = tl.tool("curl").line(sprintf("-L %s --output /tmp/hab.tar.gz", url)).execSync();

                    // unpack the downloaded file into /usr/local/bin
                    decompress("/tmp/hab.tar.gz", "/tmp", {
                        plugins: [
                            decompressTargz()
                        ],
                        strip: 1
                    }).then(() => {
                        console.log("Habitat installed: /tmp/hab");
                    });

                } catch (err) {
                    tl.setResult(tl.TaskResult.Failed, err.message);
                }
            } else {
                console.log("Habitat is installed");
            }

            break;

    }

}

async function run() {

    // ensure that habitat is installed and available
    // this will be platform dependent
    installHabitat();
}

run();