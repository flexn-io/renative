import { writeFileSync, readObjectSync } from '../system/fs';
import { PACKAGE_JSON_FILEDS } from '../constants';
import { chalk, logWarning } from '../logging/logger';
import { RnvContext } from '../context/types';

const getSortedObject = (obj: any) => {
    if (obj !== null && typeof obj === 'object' && !Array.isArray(obj)) {
        const keys = Object.keys(obj).sort();
        const newObj: Record<string, string | boolean> = {};
        const addedKeys: Record<string, string | boolean> = {};
        keys.forEach((v) => {
            if (!addedKeys[v]) {
                newObj[v] = obj[v];
                addedKeys[v] = true;
            }
        });
        return newObj;
    }
    if (Array.isArray(obj)) {
        return obj.sort();
    }
    return obj;
};

const checkForDuplicates = (arr: Array<any>) => {
    const dupCheck: Record<string, boolean> = {};
    arr.forEach((v) => {
        if (v) {
            Object.keys(v).forEach((k) => {
                if (dupCheck[k]) {
                    logWarning(`Key ${chalk().white(k)} is duplicated in your package.json`);
                }
                dupCheck[k] = true;
            });
        }
    });
};

const fixPackageJson = (c: RnvContext, pkgPath: string) =>
    new Promise<void>((resolve) => {
        const pth = pkgPath || c.paths.project.package;
        const pp = readObjectSync(pth);
        const output = fixPackageObject(pp);
        writeFileSync(pth, output, 4);
        resolve();
    });

const fixPackageObject = (pp: Record<string, string | boolean>) => {
    const output: Record<string, string | boolean> = {};
    const usedKeys: Record<string, string | boolean> = {};

    PACKAGE_JSON_FILEDS.forEach((v) => {
        if (pp[v] !== null) {
            output[v] = getSortedObject(pp[v]);
            usedKeys[v] = true;
        }
    });
    Object.keys(pp).forEach((k) => {
        if (!usedKeys[k]) {
            output[k] = pp[k];
        }
    });

    checkForDuplicates([pp.dependencies, pp.devDependencies]);

    return output;
};

export { fixPackageJson, fixPackageObject };
export default {
    fixPackageJson,
    fixPackageObject,
};
