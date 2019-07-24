/*
Script that copies the built code into a new preview directory

Each of the tasks will then be updated so that their names and titles have PREVIEW appended to them
This is so that people that are using the extension know thay the task they are
using is a preview version and does not clash with the production version
*/

import * as path from "path";
import * as fs from "fs-extra";
import * as common from "./common";
import {sprintf} from "sprintf-js";
import * as Q from "q";
import * as uuid from "uuidv5";

export function create (options, build_config) {

  // copy the production zip for preview and dev
  let copies = {
    "preview": "bf19db30-199e-4f3d-ab1a-bc5eb01bebe2",
    "dev": "9f41c235-6ad7-4b4c-af1a-fa0dd4b9d0fb"
  };

  let prod_dir = path.join(build_config.dirs.output, "production");

  for (let copy_type in copies) {

    console.log(sprintf("Creating %s extension", copy_type));

    // determine the paths to the production and preview builds
    let copy_dir = path.join(build_config.dirs.output, copy_type);

    // Create UUID namespace
    // This is so that new namespaces can be generated for the preview
    // so that they are "unique" but are always generated the same
    let namespace = uuid("null", copies[copy_type], true);

    // recusrively copy the production code to preview
    try {
      fs.copySync(prod_dir, copy_dir, { dereference: true } );
    } catch (err) {
      console.error(err);
    }

    console.log(sprintf("Patching %s tasks", copy_type));

    // get a list of the preview tasks
    let preview_tasks = common.get_tasks(path.join(copy_dir, "tasks"));

    // for each task patch the task.json so that it has a preview appended to it
    let patching = preview_tasks.map(function (task_name) {

        // create the uuid for the task, this needs to be overwritten from the production version
        // so that it has a unique name
        let task_id = uuid(namespace, sprintf("vsts-chef-tasks.%s.%s", task_name, copy_type));

        let task_manifest_file = path.join(copy_dir, "tasks", task_name, "task.json");

        let task_manifest = JSON.parse(fs.readFileSync(task_manifest_file, "utf8"));

        console.log("  Task: %s", task_name);

        console.log("    reset task id");
        task_manifest.id = task_id;

        console.log(sprintf("    add %s suffix to id", copy_type));
        task_manifest.name = sprintf("%s-%s", task_manifest.name, copy_type);

        console.log(sprintf("    add %s suffix to title", copy_type.toUpperCase()));
        task_manifest.friendlyName = sprintf("%s - %s", task_manifest.friendlyName, copy_type.toUpperCase());

        // if the task is using the connected service, ensure that it is looking for the preview version
        if (task_manifest.inputs.length > 0 && task_manifest.inputs[0].name === "habitatOrigin") {
          console.log(sprintf("    setting %s endpoint", copy_type));
          task_manifest.inputs[0].type = sprintf("%s-%s", task_manifest.inputs[0].type, copy_type);
        }

        fs.writeFileSync(task_manifest_file, JSON.stringify(task_manifest, null, 4));
    });

    Q.all([patching])
    .fail(function (err) {
      console.error(err);
      process.exit(1);
    });
  }

}