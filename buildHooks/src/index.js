import chalk from 'chalk';
import shelljs from 'shelljs';
import path from 'path';
import fs from 'fs';
import { PlatformTools, FileUtils } from 'rnv';

const hooks = {
    hello: c => new Promise((resolve, reject) => {
        console.log(`\n${chalk.yellow('HELLO FROM BUILD HOOKS!')}\n`);
        resolve();
    }),
    convertPlugins: c => new Promise((resolve, reject) => {
        for (const k in c.files.pluginTemplatesConfig.plugins) {
            const pf = path.join(c.paths.rnvPluginTemplatesFolder, k);
            const fp = path.join(pf, 'renative-plugin.json');

            if (fs.existsSync(pf)) {
                shelljs.mkdir('-p', pf);
            }

            const plugin = Object.assign({ name: k }, c.files.pluginTemplatesConfig.plugins[k]);

            fs.writeFileSync(fp, JSON.stringify(plugin, null, 2));
        }

        resolve();
    }),
    prePublish: c => new Promise((resolve, reject) => {
        const v = {
            version: c.files.projectPackage.version,
            // codename: c.files.projectPackage.codename,
        };
        const pkgFolder = path.join(c.paths.projectRootFolder, 'packages');
        FileUtils.updateObjectSync(path.join(pkgFolder, 'rnv/package.json'), v);
        FileUtils.updateObjectSync(path.join(pkgFolder, 'renative-template-hello-world/package.json'), v);
        FileUtils.updateObjectSync(path.join(pkgFolder, 'renative-template-blank/package.json'), v);
        FileUtils.updateObjectSync(path.join(pkgFolder, 'renative/package.json'), v);
        FileUtils.copyFileSync(path.join(c.paths.projectRootFolder, 'README.md'), path.join(pkgFolder, 'renative/README.md'));
        FileUtils.updateObjectSync(c.paths.rnvPluginTemplatesConfigPath, {
            plugins: {
                renative: {
                    version: c.files.projectPackage.version
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
    'app:configure:before': hooks.hello,
};

export { pipes, hooks };
