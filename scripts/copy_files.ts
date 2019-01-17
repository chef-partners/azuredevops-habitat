
import * as path from "path";
import * as fs from "fs-extra";
import * as Q from "q";
import * as common from "./common";

export function copy(options, build_config) {

  console.log("Copying static files");

  // determine the output dir
  let output = path.join(build_config.dirs.output, "production");
  console.log("Output Dir: " + output);

  // retrieve all the task directories
  let tasks = common.get_tasks();

  // perform the operation to copy task files
  let task_files = tasks.map(function (task_name) {

    // iterate around the files to copy
    build_config.files.task.forEach(function (filename) {

      // copy the task file into the build location
      let source = path.join(options.parent.tasksdir, task_name, filename);
      let destination = path.join(output, "tasks", task_name);

      console.log("Copying: %s", source);

      common.copyFileSync(source, destination);
    });
  });

  let extension_files = build_config.files.extension.map(function (item) {

    console.log("Copying: " + item.source);
    let targetpath = output;

    if ("target" in item) {
      targetpath = path.join(output, item.target);
    }

    // check the type of item and use the appropriate function
    // file
    if (fs.statSync(item.source).isFile()) {

      // ensure that the parent targetpath exists
      let parentPath = path.dirname(targetpath);

      if (!fs.existsSync(parentPath)) {
        fs.mkdirSync(parentPath);
      }

      common.copyFileSync(item.source, targetpath);
    }

    // directory
    if (fs.statSync(item.source).isDirectory()) {
      common.copyFolderRecursiveSync(item.source, targetpath);
    }
  });

  Q.all([task_files, extension_files])
    .fail(function (err) {
      console.error(err);
      process.exit(1);
  });
}