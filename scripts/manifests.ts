import * as path from "path";
import * as fs from "fs-extra";
import * as common from "./common";
import {sprintf} from "sprintf-js";

// create preview manifest file and set the appropriate flags in each
export function configure(build_config) {

    let copies = [
        "preview",
        "dev"
    ];

    for (let copy_type of copies) {
        // set the file names
        let manifest_file = path.join(build_config.dirs.output, copy_type, "vss-extension.json");

        // PREVIEW patching
        console.log(sprintf("Patching: %s", copy_type.toUpperCase()));

        // read in the file
        let manifest = JSON.parse(fs.readFileSync(manifest_file, "utf8"));

        // ensure that the endpoint is tagged with preview as well
        console.log(sprintf("  setting %s on endpoint", copy_type.toUpperCase()));
        manifest.contributions[0].id = sprintf("%s-%s", manifest.contributions[0].id, copy_type);
        manifest.contributions[0].description = sprintf("%s %s", manifest.contributions[0].description, copy_type);
        manifest.contributions[0].properties.name = sprintf("%s-%s", manifest.contributions[0].properties.name, copy_type);
        manifest.contributions[0].properties.displayName = sprintf("%s - %s", manifest.contributions[0].properties.displayName, copy_type.toUpperCase());

        // save the file
        fs.writeFileSync(manifest_file, JSON.stringify(manifest, null, 4));
    }

}
