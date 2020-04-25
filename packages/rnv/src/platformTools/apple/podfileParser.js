import path from 'path';
import compareVersions from 'compare-versions';
import {
    getAppFolder,
    writeCleanFile,
    getAppTemplateFolder,
    getConfigProp,
    getFlavouredProp
} from '../../common';
import { logTask, logWarning } from '../../systemTools/logger';
import { parsePlugins } from '../../pluginTools';
import { doResolve, doResolvePath } from '../../resolve';
import { executeAsync } from '../../systemTools/exec';

export const parsePodFile = async (c, platform) => {
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
        const isStatic = getFlavouredProp(c, pluginPlat, 'isStatic');
        if (isStatic === true) {
            if (!c.pluginConfigiOS.staticFrameworks.includes(podName)) {
                c.pluginConfigiOS.staticFrameworks.push(`'${podName}'`);
            }
        }
        const reactSubSpecs = getFlavouredProp(c, pluginPlat, 'reactSubSpecs');
        if (reactSubSpecs) {
            logWarning(
                'reactSubSpecs prop is deprecated. yoy can safely remove it'
            );
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
    const podfileObj = getFlavouredProp(
        c,
        c.buildConfig?.platforms?.[platform],
        'Podfile'
    );
    const podfileSources = podfileObj?.sources;
    if (podfileSources && podfileSources.length) {
        podfileSources.forEach((v) => {
            c.pluginConfigiOS.podfileSources += `source '${v}'\n`;
        });
    }

    // DEPLOYMENT TARGET
    const deploymentTarget = getConfigProp(
        c,
        platform,
        'deploymentTarget',
        '10.0'
    );
    c.pluginConfigiOS.deploymentTarget = deploymentTarget;

    // STATIC POD INJECT VERSION
    c.pluginConfigiOS.staticPodDefinition = 'Pod::BuildType.static_library';
    try {
        const podVersion = await executeAsync(c, 'pod --version');
        const isPodOld = compareVersions(podVersion, '1.9') < 0;
        if (isPodOld) {
            c.pluginConfigiOS.staticPodDefinition = 'Pod::Target::BuildType.static_library';
        }
    } catch (e) {
        // Ignore
    }

    writeCleanFile(
        path.join(getAppTemplateFolder(c, platform), 'Podfile'),
        path.join(appFolder, 'Podfile'),
        [
            { pattern: '{{PLUGIN_PATHS}}', override: pluginInject },
            { pattern: '{{PLUGIN_WARNINGS}}', override: podWarnings },
            {
                pattern: '{{PLUGIN_PODFILE_INJECT}}',
                override: c.pluginConfigiOS.podfileInject
            },
            {
                pattern: '{{PLUGIN_PODFILE_SOURCES}}',
                override: c.pluginConfigiOS.podfileSources
            },
            {
                pattern: '{{PLUGIN_DEPLOYMENT_TARGET}}',
                override: c.pluginConfigiOS.deploymentTarget
            },
            {
                pattern: '{{PLUGIN_STATIC_FRAMEWORKS}}',
                override: c.pluginConfigiOS.staticFrameworks.join(',')
            },
            {
                pattern: '{{PATH_JSC_ANDROID}}',
                override: doResolve('jsc-android')
            },
            {
                pattern: '{{PATH_REACT_NATIVE}}',
                override: doResolve('react-native')
            },
            {
                pattern: '{{PLUGIN_STATIC_POD_DEFINITION}}',
                override: c.pluginConfigiOS.staticPodDefinition
            }
        ]
    );
    return true;
};

const _injectPod = (podName, pluginPlat, plugin, key) => {
    let pluginInject = '';
    const isNpm = plugin['no-npm'] !== true;
    if (isNpm) {
        const podPath = doResolvePath(pluginPlat.path ?? key);
        pluginInject += `  pod '${podName}', :path => '${podPath}'\n`;
    } else if (pluginPlat.git) {
        const commit = pluginPlat.commit
            ? `, :commit => '${pluginPlat.commit}'`
            : '';
        pluginInject += `  pod '${podName}', :git => '${
            pluginPlat.git
        }'${commit}\n`;
    } else if (pluginPlat.version) {
        pluginInject += `  pod '${podName}', '${pluginPlat.version}'\n`;
    } else {
        pluginInject += `  pod '${podName}'\n`;
    }
    return pluginInject;
};
