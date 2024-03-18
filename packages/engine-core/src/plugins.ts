import {
    PluginListResponse,
    chalk,
    checkForPluginDependencies,
    getContext,
    installPackageDependencies,
    logDefault,
    overrideTemplatePlugins,
} from '@rnv/core';
import { configureFonts } from '@rnv/sdk-utils';
import intersection from 'lodash/intersection';

// export const configurePlugins = async () => {
//     await installPackageDependenciesAndPlugins();
// }

export const installPackageDependenciesAndPlugins = async () => {
    logDefault('installPackageDependenciesAndPlugins');

    await installPackageDependencies();
    await overrideTemplatePlugins();
    await configureFonts();
    await checkForPluginDependencies(async () => {
        await installPackageDependenciesAndPlugins();
    });
};

export const getPluginList = (isUpdate = false) => {
    const c = getContext();

    const output: PluginListResponse = {
        asString: '',
        asArray: [],
        plugins: [],
        allPlugins: {}, // this is used by taskPluginAdd
    };

    let i = 1;

    Object.keys(c.files.scopedPluginTemplates).forEach((pk) => {
        const plugins = c.files.scopedPluginTemplates[pk];
        if (!plugins) return;
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
            }; // this is used by taskPluginAdd
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
