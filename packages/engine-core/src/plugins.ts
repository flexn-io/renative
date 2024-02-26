import { PluginListResponse, RnvContext, chalk } from '@rnv/core';
import intersection from 'lodash.intersection';

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
            const plugin = plugins[k];

            let platforms = '';
            const pluginPlatforms = intersection(
                c.runtime.supportedPlatforms.map((pl) => pl.platform),
                Object.keys(plugin)
            );
            pluginPlatforms.forEach((v) => {
                platforms += `${v}, `;
            });
            if (platforms.length) {
                platforms = platforms.slice(0, platforms.length - 2);
            }
            const installedPlugin = c.buildConfig && c.buildConfig.plugins && c.buildConfig.plugins[k];
            const installedString = installedPlugin ? chalk().yellow('installed') : chalk().green('not installed');
            let versionString = plugin.version;
            if (isUpdate && installedPlugin) {
                output.plugins.push(k);

                const installedPluginVersion =
                    typeof installedPlugin !== 'string' ? installedPlugin.version : installedPlugin;
                if (installedPluginVersion !== plugin.version) {
                    versionString = `(${chalk().yellow(installedPluginVersion)}) => (${chalk().green(plugin.version)})`;
                } else {
                    versionString = `(${chalk().green(installedPluginVersion)})`;
                }
                output.asString += ` [${i}]> ${chalk().bold(k)} ${versionString}\n`;
                output.asArray.push({
                    name: `${k} ${versionString}`,
                    value: k,
                });

                i++;
            } else if (!isUpdate) {
                output.plugins.push(k);
                output.asString += ` [${i}]> ${chalk().bold(k)} (${chalk().grey(
                    plugin.disableNpm ? '(no npm)' : plugin.version
                )}) [${platforms}] - ${installedString}\n`;
                output.asArray.push({
                    name: `${k} (${chalk().grey(
                        plugin.disableNpm ? '(no npm)' : plugin.version
                    )}) [${platforms}] - ${installedString}`,
                    value: k,
                });

                i++;
            }
            output.allPlugins[k] = {
                name: `${k} ${versionString}`,
                value: k,
            }; // this is used by taskRnvPluginAdd
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
