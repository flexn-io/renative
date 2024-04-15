import path from 'path';
import {
    RnvPlugin,
    OverridesOptions,
    getAppFolder,
    getConfigProp,
    getFlavouredProp,
    logDefault,
    parsePlugins,
    writeCleanFile,
    DEFAULTS,
    getContext,
    type ConfigPluginPlatformSchema,
} from '@rnv/core';
import { addSystemInjects, getAppTemplateFolder } from '@rnv/sdk-utils';

export const parsePodFile = async () => {
    logDefault('parsePodFile');
    const c = getContext();
    const appFolder = getAppFolder();
    const useHermes = getConfigProp('reactNativeEngine') === 'hermes';
    let pluginInject = '';

    // PLUGINS
    c.payload.pluginConfigiOS.podfileInject = '';
    parsePlugins((plugin, pluginPlat, key) => {
        const templateXcode = getFlavouredProp(pluginPlat, 'templateXcode');

        const podName = getFlavouredProp(pluginPlat, 'podName');
        if (podName && (pluginPlat.git || pluginPlat.commit || pluginPlat.buildType || pluginPlat.version)) {
            pluginInject += _injectPod(podName, pluginPlat, plugin, key);
        }

        const podNames = getFlavouredProp(pluginPlat, 'podNames');
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
    const ignoreWarnings = getConfigProp('ignoreWarnings');
    const podWarnings = ignoreWarnings ? 'inhibit_all_warnings!' : '';

    const templateXcode = getConfigProp('templateXcode');
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
    const deploymentTarget = getConfigProp('deploymentTarget') || DEFAULTS.deploymentTarget;
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

    addSystemInjects(injects);

    writeCleanFile(
        path.join(getAppTemplateFolder()!, 'Podfile'),
        path.join(appFolder, 'Podfile'),
        injects,
        undefined,
        c
    );
    return true;
};

const _injectPod = (
    podName: string,
    pluginPlat: ConfigPluginPlatformSchema | undefined,
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
