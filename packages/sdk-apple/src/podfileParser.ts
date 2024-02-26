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
    parsePlugins,
    writeCleanFile,
    RnvPlatform,
    DEFAULTS,
} from '@rnv/core';
import { Context } from './types';

export const parsePodFile = async (c: Context, platform: RnvPlatform) => {
    logTask('parsePodFile');

    const appFolder = getAppFolder(c);
    const useHermes = getConfigProp(c, c.platform, 'reactNativeEngine') === 'hermes';

    let pluginInject = '';

    // PLUGINS
    c.payload.pluginConfigiOS.podfileInject = '';
    parsePlugins(c, platform, (plugin, pluginPlat, key) => {
        const templateXcode = getFlavouredProp(c, pluginPlat, 'templateXcode');

        const podName = getFlavouredProp(c, pluginPlat, 'podName');
        if (podName && (pluginPlat.git || pluginPlat.commit || pluginPlat.buildType || pluginPlat.version)) {
            pluginInject += _injectPod(podName, pluginPlat, plugin, key);
        }

        const podNames = getFlavouredProp(c, pluginPlat, 'podNames');
        if (podNames) {
            podNames.forEach((v) => {
                pluginInject += `${v}\n`;
            });
        }

        const podfile = templateXcode?.Podfile;
        if (podfile) {
            const { injectLines, post_install, header, sources } = podfile;

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

            if (sources?.length) {
                sources.forEach((v) => {
                    if (!c.payload.pluginConfigiOS.podfileSources.includes(v)) {
                        c.payload.pluginConfigiOS.podfileSources += `source '${v}'\n`;
                    }
                });
            }

            // HEADER
            if (header?.length) {
                header.forEach((v) => {
                    c.payload.pluginConfigiOS.podfileHeader += `${v}\n`;
                });
            }
        }
    });

    // WARNINGS
    const ignoreWarnings = getConfigProp(c, platform, 'ignoreWarnings');
    const podWarnings = ignoreWarnings ? 'inhibit_all_warnings!' : '';

    const templateXcode = getConfigProp(c, c.platform, 'templateXcode');
    const podfile = templateXcode?.Podfile;
    if (podfile) {
        const { injectLines, post_install, header, sources } = podfile;
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
        if (sources?.length) {
            sources.forEach((v) => {
                if (!c.payload.pluginConfigiOS.podfileSources.includes(v)) {
                    c.payload.pluginConfigiOS.podfileSources += `source '${v}'\n`;
                }
            });
        }
        // HEADER
        if (header?.length) {
            header.forEach((v) => {
                c.payload.pluginConfigiOS.podfileHeader += `${v}\n`;
            });
        }
    }

    // DEPLOYMENT TARGET
    const deploymentTarget = getConfigProp(c, platform, 'deploymentTarget') || DEFAULTS.deploymentTarget;
    c.payload.pluginConfigiOS.deploymentTarget = deploymentTarget;

    const injects: OverridesOptions = [
        { pattern: '{{INJECT_PLUGIN_PATHS}}', override: pluginInject },
        { pattern: '{{INJECT_PLUGIN_WARNINGS}}', override: podWarnings },
        {
            pattern: '{{INJECT_PLUGIN_PODFILE_INJECT}}',
            override: c.payload.pluginConfigiOS.podfileInject,
        },
        {
            pattern: '{{INJECT_POST_INSTALL}}',
            override: c.payload.pluginConfigiOS.podPostInstall,
        },
        {
            pattern: '{{INJECT_PLUGIN_PODFILE_SOURCES}}',
            override: c.payload.pluginConfigiOS.podfileSources,
        },
        {
            pattern: '{{INJECT_PLUGIN_DEPLOYMENT_TARGET}}',
            override: c.payload.pluginConfigiOS.deploymentTarget,
        },
        {
            pattern: '{{INJECT_PLUGIN_STATIC_FRAMEWORKS}}',
            override: c.payload.pluginConfigiOS.staticFrameworks.join(','),
        },
        {
            pattern: '{{INJECT_PLUGIN_NODE_REQUIRE}}',
            override: c.payload.pluginConfigiOS.podfileNodeRequire || '',
        },
        {
            pattern: '{{INJECT_HERMES_ENABLED}}',
            override: `${useHermes}`,
        },
        {
            pattern: '{{INJECT_PODFILE_HEADER}}',
            override: c.payload.pluginConfigiOS.podfileHeader,
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

const _injectPod = (
    podName: string,
    pluginPlat: RenativeConfigPluginPlatform | undefined,
    _plugin: RnvPlugin,
    _key: string
) => {
    if (!pluginPlat) return '';

    const pluginInject = [`  pod '${podName}'`];

    if (pluginPlat.buildType) {
        pluginInject.push(`:build_type => :${pluginPlat.buildType}_framework`);
    }

    if (pluginPlat.git) {
        const commit = pluginPlat.commit ? `, :commit => '${pluginPlat.commit}'` : '';
        pluginInject.push(`:git => '${pluginPlat.git}'${commit}`);
    }

    if (pluginPlat.version) {
        pluginInject.push(`'${pluginPlat.version}'`);
    }

    return `${pluginInject.join(', ')}\n`;
};
