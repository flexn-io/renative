import path from 'path';
import { Doctor, FileUtils } from 'rnv';

const merge = require('deepmerge');

const VERSIONED_PACKAGES = [
    'rnv',
    'renative-template-hello-world',
    'renative-template-blank',
    'renative-template-kitchen-sink',
    'rnv-engine-rn',
    'rnv-engine-rn-tvos',
    'rnv-engine-rn-macos',
    'rnv-engine-rn-next',
    'rnv-engine-rn-web',
    'rnv-engine-lightning',
    'rnv-engine-rn-electron',
    'rnv-engine-rn-windows',
    'renative',
];

export const updateVersions = async (c) => {
    const rootPackage = FileUtils.readObjectSync(
        path.join(c.paths.project.dir, '/../../', 'package.json')
    );
    const v = {
        version: rootPackage.version
    };
    const pkgFolder = path.join(c.paths.project.dir, '/../');
    _updateJson(c, c.paths.project.package, v);

    VERSIONED_PACKAGES.forEach((pkgName) => {
        _updateJson(c, path.join(pkgFolder, pkgName, 'package.json'), v);
    });

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

    _updateJson(
        c,
        path.join(
            pkgFolder,
            'rnv/coreTemplateFiles/renative.templates.json'
        ),
        {
            engineTemplates: {
                '@rnv/engine-rn': v,
                '@rnv/engine-rn-tvos': v,
                '@rnv/engine-rn-web': v,
                '@rnv/engine-rn-next': v,
                '@rnv/engine-rn-electron': v,
                '@rnv/engine-lightning': v,
                '@rnv/engine-rn-macos': v,
                '@rnv/engine-rn-windows': v
            },
        }
    );

    FileUtils.copyFileSync(
        path.join(c.paths.project.dir, '/../../README.md'),
        path.join(pkgFolder, 'renative/README.md')
    );

    FileUtils.copyFileSync(
        path.join(c.paths.project.dir, '/../../README.md'),
        path.join(pkgFolder, 'rnv/README.md')
    );

    // const packagesDir = path.join(c.paths.project.dir, '..');
    //
    // const engines = [
    //     'rnv-engine-rn',
    //     'rnv-engine-rn-web',
    //     'rnv-engine-rn-next',
    //     'rnv-engine-rn-electron',
    //     'rnv-engine-lightning'
    // ];
    // engines.forEach((engineDir) => {
    //     const ePath = path.join(packagesDir, engineDir, 'renative.engine.json');
    //     const engine = FileUtils.readObjectSync(ePath);
    //     const { id } = engine;
    //     const npm = engine?.npm?.devDependencies?.[`@rnv/${id}`];
    //     if (npm) {
    //         engine.npm.devDependencies[`@rnv/${id}`] = rootPackage.version;
    //     }
    //     const output = Doctor.fixPackageObject(engine);
    //     FileUtils.writeFileSync(ePath, output, 4, true);
    // });

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
