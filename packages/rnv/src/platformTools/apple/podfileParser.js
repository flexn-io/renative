

export const parsePodFileSync = (c, platform) => {
    logTask(`_parsePodFile:${platform}`);

    const appFolder = getAppFolder(c, platform);
    let pluginSubspecs = '';
    let pluginInject = '';

    // PLUGINS
    c.pluginConfigiOS.podfileInject = '';
    parsePlugins(c, platform, (plugin, pluginPlat, key) => {
        if (pluginPlat.podName) {
            pluginInject += _injectPod(pluginPlat.podName, pluginPlat, plugin, key);
        }
        if (pluginPlat.podNames) {
            pluginPlat.podNames.forEach((v) => {
                pluginInject += _injectPod(v, pluginPlat, plugin, key);
            });
        }

        if (pluginPlat.reactSubSpecs) {
            pluginPlat.reactSubSpecs.forEach((v) => {
                if (!pluginSubspecs.includes(`'${v}'`)) {
                    pluginSubspecs += `  '${v}',\n`;
                }
            });
        }

        if (pluginPlat.Podfile) {
            const injectLines = pluginPlat.Podfile.injectLines;
            if (injectLines) {
                injectLines.forEach((v) => {
                    c.pluginConfigiOS.podfileInject += `${v}\n`;
                });
            }
        }
    });

    // SUBSPECS
    const reactCore = c.files.pluginConfig ? c.files.pluginConfig.reactCore : c.files.pluginTemplatesConfig.reactCore;
    if (reactCore) {
        if (reactCore.ios.reactSubSpecs) {
            reactCore.ios.reactSubSpecs.forEach((v) => {
                if (!pluginSubspecs.includes(`'${v}'`)) {
                    pluginSubspecs += `  '${v}',\n`;
                }
            });
        }
    }

    // WARNINGS
    const ignoreWarnings = getConfigProp(c, platform, 'ignoreWarnings');
    const podWarnings = ignoreWarnings ? 'inhibit_all_warnings!' : '';

    writeCleanFile(path.join(getAppTemplateFolder(c, platform), 'Podfile'), path.join(appFolder, 'Podfile'), [
        { pattern: '{{PLUGIN_PATHS}}', override: pluginInject },
        { pattern: '{{PLUGIN_SUBSPECS}}', override: pluginSubspecs },
        { pattern: '{{PLUGIN_WARNINGS}}', override: podWarnings },
        { pattern: '{{PLUGIN_PODFILE_INJECT}}', override: c.pluginConfigiOS.podfileInject },
    ]);
};

const _injectPod = (podName, pluginPlat, plugin, key) => {
    let pluginInject = '';
    const isNpm = plugin['no-npm'] !== true;
    if (isNpm) {
        const podPath = pluginPlat.path ? `../../${pluginPlat.path}` : `../../node_modules/${key}`;
        pluginInject += `  pod '${podName}', :path => '${podPath}'\n`;
    } else if (pluginPlat.git) {
        const commit = pluginPlat.commit ? `, :commit => '${pluginPlat.commit}'` : '';
        pluginInject += `  pod '${podName}', :git => '${pluginPlat.git}'${commit}\n`;
    } else if (pluginPlat.version) {
        pluginInject += `  pod '${podName}', '${pluginPlat.version}'\n`;
    } else {
        pluginInject += `  pod '${podName}'\n`;
    }
    return pluginInject;
};
