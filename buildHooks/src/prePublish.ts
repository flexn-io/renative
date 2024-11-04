import path from 'path';
import {
    RnvContext,
    RnvFileName,
    copyFileSync,
    fixPackageObject,
    fsExistsSync,
    readObjectSync,
    writeFileSync,
} from '@rnv/core';
import fs from 'fs';

const merge = require('deepmerge');

const VERSIONED_PACKAGES = [
    'app-harness',
    'rnv',
    'core',
    'build-hooks-git',
    'cli',
    'template-starter',
    'engine-core',
    'engine-rn',
    'engine-rn-tvos',
    'engine-rn-macos',
    'engine-rn-next',
    'engine-rn-web',
    'engine-lightning',
    'engine-rn-electron',
    'engine-rn-windows',
    'sdk-apple',
    'sdk-android',
    'sdk-webpack',
    'sdk-react-native',
    'sdk-kaios',
    'sdk-tizen',
    'sdk-telemetry',
    'sdk-webos',
    'sdk-utils',
    'renative',
    'config-templates',
    'integration-docker',
    'integration-starter',
    'adapter',
];

type PackageConfig = {
    pkgName?: string;
    rnvPath?: string;
    pkgPath?: string;
    pkgFile?: any;
    rnvFile?: any;
    rnvTempPath?: string;
    rnvTempFile?: any;
};

type PackageConfigs = Record<string, PackageConfig>;

const setPackageVersions = (c: RnvContext, version: string | undefined, versionedPackages: string[]) => {
    const v = {
        version: version,
    };
    const pkgFolder = path.join(c.paths.project.dir, 'packages');
    _updateJson(c.paths.project.package, v);
    versionedPackages.forEach(function (pkgName) {
        _updateJson(path.join(pkgFolder, pkgName, RnvFileName.package), v);
    });
};

const updatePkgDeps = (
    pkgConfig: PackageConfig,
    depKey: string,
    packageName: string,
    packageConfigs: PackageConfigs,
    semVer = ''
) => {
    const { pkgFile } = pkgConfig;

    if (pkgFile) {
        let hasChanges = false;
        const currVer = pkgFile?.[depKey]?.[packageName];
        if (currVer) {
            const newVer = `${semVer}${packageConfigs[packageName].pkgFile?.version}`;

            if (currVer !== newVer) {
                console.log('Found linked dependency to update:', packageName, currVer, newVer);
                hasChanges = true;
                pkgFile[depKey][packageName] = newVer;
            }
        }
        if (hasChanges) {
            const output = fixPackageObject(pkgFile);
            writeFileSync(pkgConfig.pkgPath, output, 4, true);
        }
    }
};

const updateRenativeDeps = (pkgConfig: PackageConfig, packageName: string, packageConfigs: PackageConfigs) => {
    const { rnvFile, rnvTempFile } = pkgConfig;
    const newVer = packageConfigs[packageName].pkgFile?.version;
    let hasRnvChanges = false;

    const doUpdate = (obj: any, key: string) => {
        const templateVer = obj?.[key];
        if (templateVer) {
            if (templateVer !== newVer) {
                console.log('Found linked plugin dependency to update:', packageName, templateVer, newVer);
                hasRnvChanges = true;
                obj[key] = newVer;
            }
        }
    };

    if (rnvFile) {
        doUpdate(rnvFile?.templates?.[packageName], 'version');
        doUpdate(rnvFile?.templateConfig, 'version');
        if (hasRnvChanges) {
            const output = fixPackageObject(rnvFile);
            writeFileSync(pkgConfig.rnvPath, output, 4, true);
        }
    }
    if (rnvTempFile) {
        doUpdate(rnvTempFile?.templateConfig?.package_json?.devDependencies, packageName);
        if (hasRnvChanges) {
            const output = fixPackageObject(rnvTempFile);
            writeFileSync(pkgConfig.rnvTempPath, output, 4, true);
        }
    }
};

export const prePublish = async (c: RnvContext) => {
    const v = {
        version: c.files.project.package.version,
    };
    await setPackageVersions(c, v.version, VERSIONED_PACKAGES);

    const pkgDirPath = path.join(c.paths.project.dir, 'packages');

    _updateJson(path.join(pkgDirPath, 'config-templates/renative.templates.json'), {
        engineTemplates: {
            '@rnv/engine-rn': v,
            '@rnv/engine-rn-tvos': v,
            '@rnv/engine-rn-web': v,
            '@rnv/engine-rn-next': v,
            '@rnv/engine-rn-electron': v,
            '@rnv/engine-lightning': v,
            '@rnv/engine-rn-macos': v,
            '@rnv/engine-rn-windows': v,
        },
        pluginTemplates: {
            '@rnv/renative': v,
        },
    });

    const dirs = fs.readdirSync(pkgDirPath);

    const packageNamesAll: string[] = [];
    const packageConfigs: PackageConfigs = {};

    const parsePackages = (dirPath: string) => {
        let pkgName: string | undefined;
        let _pkgPath;
        let pkgFile;
        let rnvPath;
        let rnvFile;
        let rnvTempPath;
        let rnvTempFile;

        if (fs.statSync(dirPath).isDirectory()) {
            _pkgPath = path.join(dirPath, RnvFileName.package);
            if (fsExistsSync(_pkgPath)) {
                pkgFile = readObjectSync<any>(_pkgPath);
                pkgName = pkgFile?.name;
            }
            const _rnvPath = path.join(dirPath, RnvFileName.renative);
            if (fsExistsSync(_rnvPath)) {
                rnvPath = _rnvPath;
                rnvFile = readObjectSync(rnvPath);
            }
            const _rnvTempPath = path.join(dirPath, RnvFileName.renativeTemplate);
            if (fsExistsSync(_rnvTempPath)) {
                rnvTempPath = _rnvTempPath;
                rnvTempFile = readObjectSync(rnvTempPath);
            }
        }
        if (pkgName) {
            packageConfigs[pkgName] = {
                pkgName,
                rnvPath,
                pkgPath: _pkgPath,
                pkgFile,
                rnvFile,
                rnvTempPath,
                rnvTempFile,
            };
            packageNamesAll.push(pkgName);
        }
    };

    parsePackages(c.paths.project.dir);

    dirs.forEach((dir) => {
        parsePackages(path.join(pkgDirPath, dir));
    });

    packageNamesAll.forEach((pkgName) => {
        const pkgConfig = packageConfigs[pkgName];
        packageNamesAll.forEach((v) => {
            updatePkgDeps(pkgConfig, 'dependencies', v, packageConfigs);
            updatePkgDeps(pkgConfig, 'devDependencies', v, packageConfigs);
            updatePkgDeps(pkgConfig, 'optionalDependencies', v, packageConfigs);
            updatePkgDeps(pkgConfig, 'peerDependencies', v, packageConfigs, '^');
            updateRenativeDeps(pkgConfig, v, packageConfigs);
        });
    });

    copyFileSync(path.join(c.paths.project.dir, 'README.md'), path.join(pkgDirPath, 'renative/README.md'));
    copyFileSync(path.join(c.paths.project.dir, 'README.md'), path.join(pkgDirPath, 'renative/README.md'));
    copyFileSync(path.join(c.paths.project.dir, 'README.md'), path.join(pkgDirPath, 'rnv/README.md'));

    return true;
};

const _updateJson = (pPath: string | undefined, updateObj: object) => {
    const pObj = readObjectSync(pPath);

    if (!pObj) {
        throw new Error(`_updateJson called with unresolveable package.json path '${pPath}'`);
    }

    let obj;
    if (pObj) {
        obj = merge(pObj, updateObj);
    }
    const output = fixPackageObject(obj);
    writeFileSync(pPath, output, 4, true);
};
