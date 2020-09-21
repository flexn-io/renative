import { FileUtils, Doctor } from 'rnv';
import path from 'path';

const merge = require('deepmerge');

export const updateVersions = async (c) => {
    const rootPackage = FileUtils.readObjectSync(
        path.join(c.paths.project.dir, '/../../', 'package.json')
    );
    const v = {
        version: rootPackage.version
    };
    const pkgFolder = path.join(c.paths.project.dir, '/../');
    _updateJson(c, c.paths.project.package, v);
    _updateJson(c, path.join(pkgFolder, 'rnv/package.json'), v);
    _updateJson(
        c,
        path.join(
            pkgFolder,
            'renative-template-hello-world/package.json'
        ),
        v
    );
    _updateJson(
        c,
        path.join(pkgFolder, 'renative-template-blank/package.json'),
        v
    );
    _updateJson(
        c,
        path.join(
            pkgFolder,
            'renative-template-kitchen-sink/package.json'
        ),
        v
    );
    _updateJson(
        c,
        path.join(
            pkgFolder,
            'rnv-engine-rn-next/package.json'
        ),
        v
    );
    _updateJson(c, path.join(pkgFolder, 'renative/package.json'), v);
    _updateJson(
        c,
        path.join(
            pkgFolder,
            'rnv/pluginTemplates/renative.plugins.json'
        ),
        {
            pluginTemplates: {
                renative: v
            }
        }
    );

    FileUtils.copyFileSync(
        path.join(c.paths.project.dir, '/../../README.md'),
        path.join(pkgFolder, 'renative/README.md')
    );
    // FileUtils.copyFileSync(
    //     path.join(c.paths.project.dir, 'README.md'),
    //     path.join(pkgFolder, 'renative/README.md')
    // );

    return true;
};


const _updateJson = (c, pPath, updateObj) => {
    const pObj = FileUtils.readObjectSync(pPath);

    if (!pObj) {
        throw new Error(
            `_updateJson called with unresolveable package.json path '${pPath}'`
        );
    }

    let obj;
    if (pObj) {
        obj = merge(pObj, updateObj);
    }
    const output = Doctor.fixPackageObject(obj);
    FileUtils.writeFileSync(pPath, output, 4, true);
};
