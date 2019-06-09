import chalk from 'chalk';
import { writeObjectSync } from './fileUtils';
import { PACKAGE_JSON_FILEDS } from '../constants';
import { logWarning } from '../common';

const getSortedObject = (obj) => {
    if (obj !== null && typeof obj === 'object' && !Array.isArray(obj)) {
        const keys = Object.keys(obj).sort();
        const newObj = {};
        const addedKeys = {};
        keys.forEach((v) => {
            if (!addedKeys[v]) {
                newObj[v] = obj[v];
                addedKeys[v] = true;
            } else {

            }
        });
        return newObj;
    } if (Array.isArray(obj)) {
        return obj.sort();
    }
    return obj;
};

const checkForDuplicates = (arr) => {
    const dupCheck = {};
    arr.forEach((v) => {
        if (v) {
            for (const k in v) {
                if (dupCheck[k]) {
                    logWarning(`Key ${chalk.white(k)} is duplicated in your package.json`);
                }
                dupCheck[k] = true;
            }
        }
    });
};

const fixPackageJson = c => new Promise((resolve, reject) => {
    const pp = c.files.projectPackage;
    const output = {};
    const usedKeys = {};
    PACKAGE_JSON_FILEDS.forEach((v) => {
        if (pp[v] !== null) {
            output[v] = getSortedObject(pp[v]);
            usedKeys[v] = true;
        }
    });
    for (const k in pp) {
        if (!usedKeys[k]) {
            output[k] = pp[k];
        }
    }
    checkForDuplicates([pp.dependencies, pp.devDependencies]);

    writeObjectSync(c.paths.projectPackagePath, output, 4);
    resolve();
});

export { fixPackageJson };
