/**
 * Functions that provide all the settings and the inputs for the tasks
 * 
 * It is responsible for settings default values and overriding based
 * on task inputs. Also sets values based on environment variables when
 * running in DEBUG mode
 * 
 * @author Russell Seymour
 */

// Import necessary libraries
import { sprintf } from "sprintf-js";
import * as path from "path";
import * as os from "os";
import * as tl from "vsts-task-lib/task";
import * as username from "username";

export class TaskParameters {

    // Initialise method properties
    private isDev: boolean = false;
    private runningAsRoot: boolean = false;
    public paths: object = {
        "config_file": "",
        "signing_keys": "",
        "habitat": "",
        "download_path": "",
        "unpack_path": ""
    }
    public originName: string = null;
    public originRevision: string = null;
    public originPublicKey: string = null;
    public useSudo: boolean = false;
    public originSigningKey: string = null;
    public authToken: string = null;
    public planContext: string = null;
    public srcPath: string = null;
    public packagePath: string = null;
    public exportFormat: string = null;
    public exportVersion: string = null;
    public exportName: string = null;
    public artifactFolder: string = null;
    public lastBuildEnvPath: string = null;
    public dockerRepo: string = null;
    public dockerVersionTag: string = null;
    public scriptUrl: string = null;
    public taskAction: string = null;

    /**
     * Function to return a standard object with default values
     * 
     * Will determine the paths for different operating systems
     */
    private standard() {

        // based on the operating system determine the defaults for the folders
        // and downloads
        switch (os.platform()) {
            case "win32":

                break;

            default:

                // configure the default settings for non windows agents

                // determine if running as root or not, as this will affect the location
                // of where the files are written out to
                let running_user = username.sync();

                // based on the username determine the parent path
                let parent_path: string = "";
                if (running_user === "root") {
                    parent_path = "/hab";
                    this.runningAsRoot = true;
                } else {
                    parent_path = path.join(os.homedir(), ".hab");
                }

                // set the required paths
                this.paths["config_file"] = path.join(parent_path, "etc", "cli.toml");
                this.paths["signing_keys"] = path.join(parent_path, "cache", "keys");
                this.paths["habitat"] = "/tmp/hab";

                // set the default download url for habitat
                this.scriptUrl = "https://api.bintray.com/content/habitat/stable/linux/x86_64/hab-%24latest-x86_64-linux.tar.gz?bt_package=hab-x86_64-linux";

                // determine the download path
                this.paths["download_path"] = "/tmp/hab.tar.gz";
                this.paths["unpack_path"] = "/tmp";

                // ensure that the paths exist so files can be written
                if (!tl.exist(path.dirname(this.paths["config_file"]))) {
                    tl.mkdirP(path.dirname(this.paths["config_file"]));
                }

                if (!tl.exist(this.paths["signing_keys"])) {
                    tl.mkdirP(this.paths["signing_keys"]);
                }
        }
    }

    /**
     * Returns a settings object with the specified task parameters populated
     * Will also contain default values for paths etc
     * 
     * @param required 
     * @param process 
     * @param tl 
     */
    public async getTaskParameters(required: Array<string>, connectedServiceName = null) : Promise<TaskParameters> {

        // Get the standard settings
        this.standard();

        // set the mapping of parameter names to class properties
        let mapping = {
            "planContext": "habitatPlanContext",
            "srcPath": "habitatSrcPath",
            "packagePath": "habitatPackagePath",
            "packageChannel": "habitatPackageChannel",
            "exportFormat": "habitatExportFormat",
            "exportVersion": "habitatExportVersion",
            "exportName": "habitatExportName",
            "artifactFolder": "habitatArtifactFolder",
            "lastBuildEnvPath": "habitatLastBuildEnvPath",
            "dockerRepo": "habitatDockerRepo",
            "dockerVersionTag": "habitatDockerVersionTag",
            "taskAction": "taskAction"
        };

        // To assist with debugging check to see if the environment variable NODE_ENV has been
        // set and if it has been set to dev. If it has then read the relevant task parameters
        // from environment variables
        this.isDev = process.env['NODE_ENV'] && process.env['NODE_ENV'].toUpperCase() == 'DEV' ? true : false;

        // attempt to get the necessary information from the task parameters or environment
        try {

            // get the endpoint connected service if a name has been specified
            if (connectedServiceName !== null) {
                let connectedService = this.getValue(connectedServiceName, true, "input");

                // if the servce endpoint is not null, e.g. it is attached to the task get the reevant information
                if (connectedService != null) {
                    this.originName = this.getValue("originName", true, "data", connectedService);
                    this.originRevision = this.getValue("revision", true, "data", connectedService);
                    this.originPublicKey = this.getValue("publicKey", true, "data", connectedService);

                    // the use of sudo only makes sense when running as a non-root user
                    // so ignore if running as root. The default is false
                    if (!this.runningAsRoot) {
                        this.useSudo = !!+this.getValue("useSudo", false, "data", connectedService);
                    }
                    // get the sensitive information
                    this.originSigningKey = this.getValue("signingKey", true, "auth", connectedService);
                    this.authToken = this.getValue("authToken", true, "auth", connectedService);
                }
            }

            // get the values for the required parameters
            for (let property in mapping) {
                // determine if the task parameter is required
                if (required.indexOf(mapping[property]) > -1) {
                    this[property] = this.getValue(mapping[property], false,"input");
                }
            }

            // output information to the console
            console.log("Running as root: %s", this.runningAsRoot);
            console.log("Use Sudo: %s", this.useSudo);

        } catch (error) {
            throw new Error(sprintf("Task failed during initialisation. Error: %s", error.message));
        }

        return this;
    }

    private getValue(parameter: string, required: boolean, type: string = null, connectedService: string = null) {
        let value = "";

        // if running in development get the settings from the environment
        if (this.isDev) {
            value = process.env[parameter.toUpperCase()];
        } else {

            // based on the type, call the method to get the correct data
            switch (type) {
                case "input":
                    // get the value from the task
                    value = tl.getInput(parameter, required);
                    break;
                case "data": 
                    // get non-sensitive data from the endpoint
                    value = tl.getEndpointDataParameter(connectedService, parameter, required);
                    break;
                case "auth":
                    // get sensitive data from the endpoint, e.g. auth token or password
                    value = tl.getEndpointAuthorizationParameter(connectedService, parameter, required);
                    break;
                default:
                    throw new Error(sprintf("Input type has not been specified: %s\nIf you are seeing this it is a bug", parameter));
            }
        }

        return value;
    }

}