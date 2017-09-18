import { sprintf } from "sprintf-js";

/** Return a hashtable of the inputs */
export function parse(process, tl) {

    // initialise the hash table to return
    let inputs = {}

    try {
        // get origin information if it has been provided
        let connected_service = tl.getInput("habitatOrigin", true)
        tl.debug(sprintf("Endpoint: %s", JSON.stringify(connected_service)))

        if (connected_service != null) {

            // get the necessary inputs from the specified endpoint
            let habitat = tl.getEndpointAuthorization(connected_service)

            inputs["habitatOriginName"] = habitat.parameters.originname;
            inputs["habitatOriginRevision"] = habitat.parameters.revision;
            inputs["habitatOriginPublicKey"] = habitat.parameters.publickey;
            inputs["habitatUseSudo"] = habitat.parameters.useSudo;

            inputs["habitatOriginSigningKey"] = habitat.parameters.password;
            inputs["habitatGitHubAuthToken"] = habitat.parameters.githubauthtoken;
        }
    } catch (err) {
        console.log("Habitat Service Endpoint not set on this task")

        // if running in debug mose output the error
        tl.debug(err);
    }

    // create an array of inputs that should be checked for
    let input_fields = [
        "habitatPlanContext",
        "habitatSrcPath",
        "habitatPackagePath",
        "habitatExportFormat",
        "habitatExportVersion",
        "habitatExportName",
        "habitatArtifactFolder",
        "habitatLastBuildEnvPath",
        "habitatDockerRepo",
        "habitatDockerVersionTag"
    ]

    input_fields.forEach(function (input_field) {
      if (tl.getInput(input_field) != null) {
        inputs[input_field] = tl.getInput(input_field);
      }
    });

    // return the inputs to the calling function
    return inputs

}