import path from 'path';
import {
    RnvPlugin,
    RenativeConfigPluginPlatform,
    OverridesOptions,
    getAppFolder,
    getAppTemplateFolder,
    getConfigProp,
    getFlavouredProp,
    addSystemInjects,
    logTask,
    logWarning,
    parsePlugins,
    sanitizePluginPath,
    overrideFileContents,
    includesPluginPath,
    doResolve,
    doResolvePath,
    executeAsync,
    writeCleanFile,
    RnvPlatform,
} from '@rnv/core';
import compareVersions from 'compare-versions';
import { Context } from './types';

export const parsePodFile = async (c: Context, platform: RnvPlatform) => {
    logTask('parsePodFile');

    const appFolder = getAppFolder(c);
    let pluginInject = '';

    // PLUGINS
    c.payload.pluginConfigiOS.podfileInject = '';
    parsePlugins(c, platform, (plugin, pluginPlat, key) => {
        const podName = getFlavouredProp(c, pluginPlat, 'podName');
        if (podName) {
            pluginInject += _injectPod(podName, pluginPlat, plugin, key);
        }
        const podNames = getFlavouredProp<RenativeConfigPluginPlatform['podNames']>(c, pluginPlat, 'podNames');
        if (podNames) {
            podNames.forEach((v) => {
                pluginInject += _injectPod(v, pluginPlat, plugin, key);
            });
        }
        const podDependencies = getFlavouredProp<RenativeConfigPluginPlatform['podDependencies']>(
            c,
            pluginPlat,
            'podDependencies'
        );
        if (podDependencies) {
            podDependencies.forEach((v) => {
                pluginInject += `  pod ${v}\n`;
            });
        }
        const isStatic = getFlavouredProp(c, pluginPlat, 'isStatic');
        if (isStatic === true) {
            if (!c.payload.pluginConfigiOS.staticFrameworks.includes(podName)) {
                c.payload.pluginConfigiOS.staticFrameworks.push(`'${podName}'`);
            }
        }
        const staticPods = getFlavouredProp<RenativeConfigPluginPlatform['staticPods']>(c, pluginPlat, 'staticPods');
        if (staticPods?.forEach) {
            staticPods.forEach((sPod) => {
                if (sPod.startsWith('::startsWith::')) {
                    c.payload.pluginConfigiOS.staticPodExtraConditions += ` || pod.name.start_with?('${sPod.replace(
                        '::startsWith::',
                        ''
                    )}')`;
                }
            });
        }

        const reactSubSpecs = getFlavouredProp(c, pluginPlat, 'reactSubSpecs');
        if (reactSubSpecs) {
            logWarning('reactSubSpecs prop is deprecated. You can safely remove it');
        }

        const podfile = getFlavouredProp<RenativeConfigPluginPlatform['Podfile']>(c, pluginPlat, 'Podfile');
        if (podfile) {
            const { injectLines, post_install } = podfile;
            // INJECT LINES
            if (injectLines) {
                injectLines.forEach((v) => {
                    c.payload.pluginConfigiOS.podfileInject += `${v}\n`;
                });
            }

            if (post_install) {
                post_install.forEach((v) => {
                    c.payload.pluginConfigiOS.podPostInstall += `${v}\n`;
                });
            }
            const podfileSources = podfile?.sources;
            if (podfileSources && podfileSources.length) {
                podfileSources.forEach((v) => {
                    if (!c.payload.pluginConfigiOS.podfileSources.includes(v)) {
                        c.payload.pluginConfigiOS.podfileSources += `source '${v}'\n`;
                    }
                });
            }
        }
    });

    // WARNINGS
    const ignoreWarnings = getConfigProp(c, platform, 'ignoreWarnings');
    const podWarnings = ignoreWarnings ? 'inhibit_all_warnings!' : '';

    const podfile = getConfigProp<RenativeConfigPluginPlatform['Podfile']>(c, c.platform, 'Podfile');
    if (podfile) {
        const { injectLines, post_install } = podfile;
        // INJECT LINES
        if (injectLines) {
            injectLines.forEach((v) => {
                c.payload.pluginConfigiOS.podfileInject += `${v}\n`;
            });
        }
        // POST INSTALL
        if (post_install) {
            post_install.forEach((v) => {
                c.payload.pluginConfigiOS.podPostInstall += `${v}\n`;
            });
        }
        // SOURCES
        const podfileSources = podfile?.sources;
        if (podfileSources && podfileSources.length) {
            podfileSources.forEach((v) => {
                if (!c.payload.pluginConfigiOS.podfileSources.includes(v)) {
                    c.payload.pluginConfigiOS.podfileSources += `source '${v}'\n`;
                }
            });
        }
    }

    // DEPLOYMENT TARGET
    const deploymentTarget = getConfigProp(c, platform, 'deploymentTarget', '11.0');
    c.payload.pluginConfigiOS.deploymentTarget = deploymentTarget;

    // STATIC POD INJECT VERSION
    c.payload.pluginConfigiOS.staticPodDefinition = 'Pod::BuildType.static_library';
    if (!c.runtime._skipNativeDepResolutions) {
        try {
            const podVersion = await executeAsync(c, 'pod --version');
            const isPodOld = compareVersions(podVersion, '1.9') < 0;
            if (isPodOld) {
                c.payload.pluginConfigiOS.staticPodDefinition = 'Pod::Target::BuildType.static_library';
            }
        } catch (e) {
            // Ignore
        }
    }

    const injects: OverridesOptions = [
        { pattern: '{{PLUGIN_PATHS}}', override: pluginInject },
        { pattern: '{{PLUGIN_WARNINGS}}', override: podWarnings },
        {
            pattern: '{{PLUGIN_PODFILE_INJECT}}',
            override: c.payload.pluginConfigiOS.podfileInject,
        },
        {
            pattern: '{{INJECT_POST_INSTALL}}',
            override: c.payload.pluginConfigiOS.podPostInstall,
        },
        {
            pattern: '{{PLUGIN_PODFILE_SOURCES}}',
            override: c.payload.pluginConfigiOS.podfileSources,
        },
        {
            pattern: '{{PLUGIN_DEPLOYMENT_TARGET}}',
            override: c.payload.pluginConfigiOS.deploymentTarget,
        },
        {
            pattern: '{{PLUGIN_STATIC_FRAMEWORKS}}',
            override: c.payload.pluginConfigiOS.staticFrameworks.join(','),
        },
        {
            pattern: '{{PATH_JSC_ANDROID}}',
            override: doResolve('jsc-android') || 'UNRESOLVED(jsc-android)',
        },
        {
            pattern: '{{PATH_REACT_NATIVE}}',
            override:
                doResolve(c.runtime.runtimeExtraProps?.reactNativePackageName || 'react-native') ||
                'UNRESOLVED(react-native)',
        },
        {
            pattern: '{{PLUGIN_STATIC_POD_DEFINITION}}',
            override: c.payload.pluginConfigiOS.staticPodDefinition,
        },
        {
            pattern: '{{PLUGIN_STATIC_POD_EXTRA_CONDITIONS}}',
            override: c.payload.pluginConfigiOS.staticPodExtraConditions,
        },
        {
            pattern: '{{PLUGIN_NODE_REQUIRE}}',
            override: c.payload.pluginConfigiOS.podfileNodeRequire || '',
        },
    ];

    addSystemInjects(c, injects);

    writeCleanFile(
        path.join(getAppTemplateFolder(c, platform)!, 'Podfile'),
        path.join(appFolder, 'Podfile'),
        injects,
        undefined,
        c
    );
    return true;
};

const REACT_CORE_OVERRIDES = {
    "s.dependency 'React'": "s.dependency 'React-Core'",
    's.dependency "React"': 's.dependency "React-Core"',
};

const _injectPod = (
    _podName: string,
    pluginPlat: RenativeConfigPluginPlatform | undefined,
    plugin: RnvPlugin,
    _key: string
) => {
    if (!pluginPlat) return '';

    const key = plugin.packageName || _key;
    const podName = _podName;
    let pluginInject = '';
    let podPath;
    const isNpm = plugin['no-npm'] !== true;
    if (isNpm) {
        if (includesPluginPath(pluginPlat.path)) {
            podPath = sanitizePluginPath(pluginPlat.path || '', key);
        } else {
            podPath = doResolvePath(pluginPlat.path ?? key);
        }
        pluginInject += `  pod '${podName}', :path => '${podPath}'\n`;
        const podspecPath = `${podPath}/${podName}.podspec`;
        // Xcode 12 Migration
        overrideFileContents(podspecPath, REACT_CORE_OVERRIDES, 'REACT_CORE_OVERRIDES');
    } else if (pluginPlat.git) {
        const commit = pluginPlat.commit ? `, :commit => '${pluginPlat.commit}'` : '';
        pluginInject += `  pod '${podName}', :git => '${pluginPlat.git}'${commit}\n`;
    } else if (pluginPlat.version) {
        pluginInject += `  pod '${podName}', '${pluginPlat.version}'\n`;
    } else {
        pluginInject += `  pod '${sanitizePluginPath(podName, key)}'\n`;
    }

    return pluginInject;
};
