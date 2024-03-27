/**
 * Copyright (c) Microsoft Corporation.
 * Licensed under the MIT License.
 * @format
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');
const xmldom_1 = require('@xmldom/xmldom');
const xpath = require('xpath');

const msbuildSelect = xpath.useNamespaces({
    msbuild: 'http://schemas.microsoft.com/developer/msbuild/2003',
});
/**
 * Search for files matching the pattern under the target folder.
 * @param folder The absolute path to target folder.
 * @param filenamePattern The pattern to search for.
 * @return  Return the array of relative file paths.
 */
function findFiles(folder, filenamePattern) {
    const files = glob.sync(path.join('**', filenamePattern), {
        cwd: folder,
        ignore: ['node_modules/**', '**/Debug/**', '**/Release/**', '**/Generated Files/**', '**/packages/**'],
    });
    return files;
}
exports.findFiles = findFiles;

/**
 * Reads in the contents of the target project file.
 * @param projectPath The target project file path.
 * @return The project file contents.
 */
function readProjectFile(projectPath) {
    const projectContents = fs.readFileSync(projectPath, 'utf8').toString();
    return new xmldom_1.DOMParser().parseFromString(projectContents, 'application/xml');
}
exports.readProjectFile = readProjectFile;
/**
 * Search for the given property in the project contents and return its value.
 * @param projectContents The XML project contents.
 * @param propertyName The property to look for.
 * @return The value of the tag if it exists.
 */
function tryFindPropertyValue(projectContents, propertyName) {
    const nodes = msbuildSelect(`//msbuild:PropertyGroup/msbuild:${propertyName}`, projectContents);
    if (nodes.length > 0) {
        // Take the last one
        return nodes[nodes.length - 1].textContent;
    }
    return null;
}
exports.tryFindPropertyValue = tryFindPropertyValue;
function findPropertyValue(projectContents, propertyName, filePath) {
    const res = tryFindPropertyValue(projectContents, propertyName);
    if (!res) {
        throw new Error(`Couldn't find property ${propertyName} from ${filePath}`);
    }
    return res;
}
exports.findPropertyValue = findPropertyValue;
