import path from 'path';
import fs from 'fs';
import chalk from 'chalk';
import {
    logTask,
    logError,
    logWarning,
    getAppFolder,
    isPlatformActive,
    logDebug,
    getAppVersion,
    getAppTitle,
    getEntryFile,
    writeCleanFile,
    getAppTemplateFolder,
    getAppId,
    getConfigProp,
    getIP,
    getBuildFilePath,
    logSuccess,
    getBuildsFolder,
    getFlavouredProp
} from '../../common';
import { copyBuildsFolder } from '../../projectTools/projectParser';
import { getMergedPlugin, parsePlugins } from '../../pluginTools';

export const parsePodFile = (c, platform) => new Promise((resolve, reject) => {
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
