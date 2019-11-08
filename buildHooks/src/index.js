import chalk from 'chalk';
// import shelljs from 'shelljs';
import path from 'path';
import fs from 'fs';
import { PlatformTools, FileUtils, Doctor, Constants } from 'rnv';
import { PLATFORMS } from '../../packages/rnv/dist/constants';

const hooks = {
    hello: c => new Promise((resolve, reject) => {
        console.log(`\n${chalk.yellow('HELLO FROM BUILD HOOKS!')}\n`);
        resolve();
    }),
    printExtensions: c => new Promise((resolve, reject) => {
        let out = '';

        for (const k in PLATFORMS) {
            const p = PLATFORMS[k];
            if (p.sourceExts) {
                let i = 1;
                out += `\n\n-------${k}---------\n\n`;
                out += `| Extension | Type    | Priority  |
| --------- | --------- | :-------: |\n`;
                const factors = p.sourceExts.factors || [];
                const platforms = p.sourceExts.platforms || [];
                const fallbacks = p.sourceExts.fallbacks || [];
                // const merged = [...factors, ...platforms, ...fallbacks];
                factors.forEach((v) => {
      		out += `| \`${v}\` | \`form factor\` | ${i} |\n`;
                    i++;
                });
                platforms.forEach((v) => {
      		out += `| \`${v}\` | \`platform\` | ${i} |\n`;
                    i++;
                });
                fallbacks.forEach((v) => {
      		out += `| \`${v}\` | \`fallback\` | ${i} |\n`;
                    i++;
                });
            }
        }
        console.log(out);
        resolve();
    }),
    convertPlugins: c => new Promise((resolve, reject) => {
        for (const k in c.files.rnv.pluginTemplates.config.pluginTemplates) {
            const pf = path.join(c.paths.project.dir, 'docs/plugins', `${k}.md`);
            // const fp = path.join(pf, 'renative-plugin.json');

            // if (fs.existsSync(pf)) {
            //     shelljs.mkdir('-p', pf);
            // }

            const plugin = Object.assign({ name: k }, c.files.rnv.pluginTemplates.config.pluginTemplates[k]);

            console.log('PLUGIN', pf);

            // fs.writeFileSync(fp, JSON.stringify(plugin, null, 2));
        }

        resolve();
    }),
    prePublish: c => new Promise((resolve, reject) => {
        const v = {
            version: c.files.project.package.version,
        };
        const pkgFolder = path.join(c.paths.project.dir, 'packages');
        _updatePackageJson(c, c.paths.project.package, v);
        _updatePackageJson(c, path.join(pkgFolder, 'rnv/package.json'), v);
        _updatePackageJson(c, path.join(pkgFolder, 'renative-template-hello-world/package.json'), v);
        _updatePackageJson(c, path.join(pkgFolder, 'renative-template-blank/package.json'), v);
        _updatePackageJson(c, path.join(pkgFolder, 'renative-template-kitchen-sink/package.json'), v);
        _updatePackageJson(c, path.join(pkgFolder, 'renative/package.json'), v);
        FileUtils.copyFileSync(path.join(c.paths.project.dir, 'README.md'), path.join(pkgFolder, 'renative/README.md'));
        FileUtils.copyFileSync(path.join(c.paths.project.dir, 'README.md'), path.join(pkgFolder, 'renative/README.md'));
        FileUtils.updateObjectSync(c.paths.rnv.pluginTemplates.config, {
            pluginTemplates: {
                renative: {
                    version: c.files.project.package.version
                }
            }
        });

        resolve();
    }),
    awesomePlugins: c => new Promise((resolve, reject) => {
        resolve();
    }),
};

const pipes = {
    'configure:before': hooks.hello,
};

const _updatePackageJson = (c, pPath, updateObj) => {
    const pObj = FileUtils.readObjectSync(pPath);

    const merge = require('deepmerge');
    let obj;
    if (pObj) {
        obj = merge(pObj, updateObj);
    }
    const output = Doctor.fixPackageObject(obj);
    FileUtils.writeObjectSync(pPath, output, 4, true);
};

export { pipes, hooks };
