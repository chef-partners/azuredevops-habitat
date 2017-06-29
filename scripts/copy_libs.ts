
import * as common from "./common";
import * as path from "path";
import * as Q from "q";

// retrieve all the task directories
let tasks = common.get_tasks();

// determine the path to the common dir
let common_dir = path.join(__dirname, "..", "tasks", "common");

// set array of tasks that the common lib should be copied into
let tasks_with_libs = ["habitat_build", 
                       "habitat_signing_key", 
                       "habitat_pkg_upload", 
                       "habitat_pkg_export",
                       "habitat_pkg_install"]

// perform the operation to copy task files
let libraries = tasks.map(function (task_name) {

  // only copy the common directory to the tasks that require it
  if (tasks_with_libs.indexOf(task_name) > -1) {

    console.log("Copying common libs: %s", task_name)

    // determine the target path
    let target = path.join(__dirname, "..", "tasks", task_name);

    common.copyFolderRecursiveSync(common_dir, target);

  }

});

Q.all([libraries])
  .fail(function (err) {
    console.error(err)
    process.exit(1)
  })
