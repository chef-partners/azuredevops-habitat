
// Import tasks from vsts
import * as tl from "vsts-task-lib/task";

// Import common tasks
import * as inputs from "./common/inputs";

import * as path from "path"

import * as fs from "fs-extra"

import * as os from "os"

import {sprintf} from "sprintf-js";

async function run() {

    // get the parameters that have been set on the task
    let params = inputs.parse(process, tl)

    // Create the toml file for the default origin
    // determine the path for the toml file
    let toml_path = path.join(os.homedir(), ".hab", "etc", "cli.toml")

    // ensure that the parent path exists
    fs.ensureDirSync(path.dirname(toml_path))

    // Write out the default origin name as well as the GitHub auth token for publishing to the depot
    let content = sprintf(`auth_token = "%s"
origin = "%s"`, params["habitatGitHubAuthToken"], params["habitatOriginName"])
    fs.writeFileSync(toml_path, content)

    // determine the file names of the origin to write out
    let hab_cache_path = path.join(os.homedir(), ".hab/cache/keys")
    let origin_base = sprintf("%s-%s", params["habitatOriginName"], params["habitatOriginRevision"])
    let public_key_path = path.join(hab_cache_path, sprintf("%s.pub", origin_base))
    let signing_key_path = path.join(hab_cache_path, sprintf("%s.sig.key", origin_base))

    // write out the files with the relevant data
    console.log("Writing origin details: %s", params["habitatOriginName"])

    console.log("Public key: %s", public_key_path)
    console.log("Signing Key: %s", signing_key_path)
    fs.writeFileSync(public_key_path, params["habitatOriginPublicKey"])
    fs.writeFileSync(signing_key_path, params["habitatOriginSigningKey"])

}

run()