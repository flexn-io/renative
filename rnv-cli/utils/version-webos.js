const fs = require('fs');
const path = require('path');
const workspacePath = './platforms/webos';
const configFilePath = workspacePath + path.sep + 'appinfo.json';

function getConfigFile() {
    let data = null

    if (fs.existsSync(configFilePath)) {
        data = fs.readFileSync(configFilePath, 'utf-8')

        return data
    }

    console.log('Project appears to have no WebOS config.', configFilePath)

    return null
}

function getParsedConfigFile() {
    const configFile = getConfigFile();
    let parsed;

    if (!configFile) {
        return null;
    }

    try {
        parsed = JSON.parse(configFile)
    } catch (e) {
        console.log('Something went wrong while trying to parse the config file', e);
        return null;
    }

    return parsed;
}

function getPackageVersion() {
    const parsedConfigFile = getParsedConfigFile();

    if (!parsedConfigFile) {
        return null;
    }

    return parsedConfigFile.version;
}

function updatePackageVersion() {
    const parsedConfigFile = getParsedConfigFile();

    if (!parsedConfigFile) {
        // No config file present, so nothing to do here
        return false
    }

    // Update the version
    parsedConfigFile.version = process.env.npm_package_version;

    // Make sure it's stringified the pretty (as it was before)
    const updatedConfigFile = JSON.stringify(parsedConfigFile, null, 4);

    fs.writeFileSync(configFilePath, updatedConfigFile, 'utf-8');

    return true
}

module.exports = {
    getConfigFile,
    getParsedConfigFile,
    getPackageVersion,
    updatePackageVersion
}