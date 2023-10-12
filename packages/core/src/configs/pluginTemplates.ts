import intersection from 'lodash.intersection';
import { chalk } from '../logger';
import { RnvContext } from '../context/types';
import type { PluginListResponse } from '../plugins/types';

export const getPluginList = (c: RnvContext, isUpdate = false) => {
    const output: PluginListResponse = {
        asString: '',
        asArray: [],
        plugins: [],
        allPlugins: {}, // this is used by taskRnvPluginAdd
    };

    let i = 1;

    Object.keys(c.files.rnv.pluginTemplates.configs).forEach((pk) => {
        const plugins = c.files.rnv.pluginTemplates.configs[pk].pluginTemplates;
        Object.keys(plugins).forEach((k) => {
            const p = plugins[k];

            let platforms = '';
            const pluginPlatforms = intersection(
                c.runtime.supportedPlatforms.map((pl) => pl.platform),
                Object.keys(p)
            );
            pluginPlatforms.forEach((v) => {
                platforms += `${v}, `;
            });
            if (platforms.length) {
                platforms = platforms.slice(0, platforms.length - 2);
            }
            const installedPlugin = c.buildConfig && c.buildConfig.plugins && c.buildConfig.plugins[k];
            const installedString = installedPlugin ? chalk().yellow('installed') : chalk().green('not installed');
            if (isUpdate && installedPlugin) {
                output.plugins.push(k);
                let versionString;
                const installedPluginVersion =
                    typeof installedPlugin !== 'string' ? installedPlugin.version : installedPlugin;
                if (installedPluginVersion !== p.version) {
                    versionString = `(${chalk().yellow(installedPluginVersion)}) => (${chalk().green(p.version)})`;
                } else {
                    versionString = `(${chalk().green(installedPluginVersion)})`;
                }
                output.asString += ` [${i}]> ${chalk().bold(k)} ${versionString}\n`;
                output.asArray.push({
                    name: `${k} ${versionString}`,
                    value: k,
                });
                output.allPlugins[k] = p; // this is used by taskRnvPluginAdd
                i++;
            } else if (!isUpdate) {
                output.plugins.push(k);
                output.asString += ` [${i}]> ${chalk().bold(k)} (${chalk().grey(
                    p['no-npm'] ? 'no-npm' : p.version
                )}) [${platforms}] - ${installedString}\n`;
                output.asArray.push({
                    name: `${k} (${chalk().grey(
                        p['no-npm'] ? 'no-npm' : p.version
                    )}) [${platforms}] - ${installedString}`,
                    value: k,
                });
                output.allPlugins[k] = p; // this is used by taskRnvPluginAdd

                i++;
            }
            output.asArray.sort((a, b) => {
                const aStr = a.name.toLowerCase();
                const bStr = b.name.toLowerCase();
                let com = 0;
                if (aStr > bStr) {
                    com = 1;
                } else if (aStr < bStr) {
                    com = -1;
                }
                return com;
            });
        });
    });

    return output;
};
