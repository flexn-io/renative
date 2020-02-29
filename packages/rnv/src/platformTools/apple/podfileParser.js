import path from 'path';
import {
    getAppFolder,
    writeCleanFile,
    getAppTemplateFolder,
    getConfigProp,
    getFlavouredProp
} from '../../common';
import {
    logTask,
    logWarning
} from '../../systemTools/logger';
import { parsePlugins } from '../../pluginTools';

export const parsePodFile = (c, platform) => new Promise((resolve) => {
    logTask(`parsePodFileSync:${platform}`);

    const appFolder = getAppFolder(c, platform);
    let pluginInject = '';

    // PLUGINS
    c.pluginConfigiOS.podfileInject = '';
    parsePlugins(c, platform, (plugin, pluginPlat, key) => {
        const podName = getFlavouredProp(c, pluginPlat, 'podName');
        if (podName) {
            pluginInject += _injectPod(podName, pluginPlat, plugin, key);
        }
        const podNames = getFlavouredProp(c, pluginPlat, 'podNames');
        if (podNames) {
            podNames.forEach((v) => {
                pluginInject += _injectPod(v, pluginPlat, plugin, key);
            });
        }

        const reactSubSpecs = getFlavouredProp(c, pluginPlat, 'reactSubSpecs');
        if (reactSubSpecs) {
            logWarning('reactSubSpecs prop is deprecated. yoy can safely remove it');
        }

        const podfile = getFlavouredProp(c, pluginPlat, 'Podfile');
        if (podfile) {
            const { injectLines } = podfile;
            // INJECT LINES
            if (injectLines) {
                injectLines.forEach((v) => {
                    c.pluginConfigiOS.podfileInject += `${v}\n`;
                });
            }
        }
    });

    // WARNINGS
    const ignoreWarnings = getConfigProp(c, platform, 'ignoreWarnings');
    const podWarnings = ignoreWarnings ? 'inhibit_all_warnings!' : '';

    // SOURCES
    c.pluginConfigiOS.podfileSources = '';
    const podfileObj = getFlavouredProp(c, c.buildConfig?.platforms?.[platform], 'Podfile');
    const podfileSources = podfileObj?.sources;
    if (podfileSources && podfileSources.length) {
        podfileSources.forEach((v) => {
            c.pluginConfigiOS.podfileSources += `source '${v}'\n`;
        });
    }

    // DEPLOYMENT TARGET
    const deploymentTarget = getConfigProp(c, platform, 'deploymentTarget', '10.0');
    c.pluginConfigiOS.deploymentTarget = deploymentTarget;

    writeCleanFile(path.join(getAppTemplateFolder(c, platform), 'Podfile'), path.join(appFolder, 'Podfile'), [
        { pattern: '{{PLUGIN_PATHS}}', override: pluginInject },
        { pattern: '{{PLUGIN_WARNINGS}}', override: podWarnings },
        { pattern: '{{PLUGIN_PODFILE_INJECT}}', override: c.pluginConfigiOS.podfileInject },
        { pattern: '{{PLUGIN_PODFILE_SOURCES}}', override: c.pluginConfigiOS.podfileSources },
        { pattern: '{{PLUGIN_DEPLOYMENT_TARGET}}', override: c.pluginConfigiOS.deploymentTarget }
    ]);
    resolve();
});

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
