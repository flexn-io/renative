import { writeFileSync, readObjectSync } from '../system/fs';
import { chalk, logWarning } from '../logger';
import { RnvContext } from '../context/types';
import { NpmPackageFile } from '../configs/types';

const PACKAGE_JSON_FILEDS = [
    'name',
    'version',
    'description',
    'keywords',
    'homepage',
    'bugs',
    'license',
    'author',
    'contributors',
    'files',
    'main',
    'browser',
    'bin',
    'man',
    'directories',
    'repository',
    'scripts',
    'config',
    'dependencies',
    'devDependencies',
    'peerDependencies',
    'bundledDependencies',
    'optionalDependencies',
    'engines',
    'engineStrict',
    'os',
    'cpu',
    'private',
    'publishConfig',
];

const getSortedObject = (obj: unknown) => {
    if (obj !== null && typeof obj === 'object' && !Array.isArray(obj)) {
        const keys = (Object.keys(obj) as Array<keyof typeof obj>).sort();
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
                    logWarning(`Key ${chalk().bold.white(k)} is duplicated in your package.json`);
                }
                dupCheck[k] = true;
            });
        }
    });
};

const fixPackageJson = (c: RnvContext, pkgPath: string) =>
    new Promise<void>((resolve) => {
        const pth = pkgPath || c.paths.project.package;
        const pp = readObjectSync<NpmPackageFile>(pth);
        if (pp) {
            const output = fixPackageObject(pp);
            writeFileSync(pth, output, 4);
        }

        resolve();
    });

const fixPackageObject = (pp: Record<string, unknown>) => {
    const output: Record<string, unknown> = {};
    const usedKeys: Record<string, unknown> = {};

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
