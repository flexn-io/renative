import {
    RnvEngineInstallConfig,
    getFilteredEngines,
    executeAsync,
    fsExistsSync,
    getContext,
    getScopedVersion,
    isYarnInstalled,
    writeFileSync,
    readObjectSync,
    ConfigFileEngine,
    RnvFileName,
    getMergedPlugin,
    RnvPlugin,
    RnvPlatformKey,
    inquirerPrompt,
} from '@rnv/core';
import type { NewProjectData } from '../types';
import path from 'path';

const _mergeDependencies = (target: Record<string, string>, source?: Record<string, string>) => {
    if (source) {
        Object.keys(source).forEach((dep) => {
            if (!target[dep]) {
                target[dep] = source[dep];
            }
        });
    }
};

const _isPluginRequired = (plugin: RnvPlugin, supportedPlatforms: Array<RnvPlatformKey>) => {
    if (!plugin.supportedPlatforms) return true;
    return plugin.supportedPlatforms.some((platform) => supportedPlatforms.includes(platform));
};
const Question = async (data: NewProjectData) => {
    const c = getContext();

    if (!fsExistsSync(c.paths.project.config)) return true;
    const { confirmInstallEngines } = await inquirerPrompt({
        name: 'confirmInstallEngines',
        type: 'confirm',
        message: 'You do not have any engines installed. Do you want to install them now?',
    });
    if (!confirmInstallEngines) return true;

    const filteredEngines: Record<string, string> = getFilteredEngines(c);
    const enginesToInstall: Array<RnvEngineInstallConfig> = [];
    const pkg = c.files.project.package;
    const devDeps = pkg.devDependencies || {};
    const deps = pkg.dependencies || {};
    pkg.devDependencies = devDeps;
    pkg.dependencies = deps;
    const supportedPlatforms = data?.inputs?.supportedPlatforms;

    Object.keys(filteredEngines).forEach((k) => {
        const engVersion = getScopedVersion(c, k, filteredEngines[k], 'engineTemplates');
        if (engVersion) {
            enginesToInstall.push({
                key: k,
                version: engVersion,
            });
        }
    });
    if (enginesToInstall.length) {
        const cwd = c.paths.project.dir;

        for (const engine of enginesToInstall) {
            const { key, version } = engine;
            if (key && version) {
                const installCommand = `${isYarnInstalled() ? 'yarn' : 'npm'} add ${key}@${version} --dev`;
                await executeAsync(installCommand, {
                    cwd,
                });
                devDeps[key] = version;

                const nmDir = path.join(cwd, 'node_modules');
                const engineConfigPath = path.join(nmDir, key, RnvFileName.renativeEngine);
                const engineConfig = readObjectSync<ConfigFileEngine>(engineConfigPath);

                if (engineConfig && supportedPlatforms) {
                    supportedPlatforms.forEach((platform) => {
                        const npmDeps = engineConfig?.engine?.platforms?.[platform]?.npm;
                        if (npmDeps) {
                            _mergeDependencies(deps, npmDeps.dependencies);
                            _mergeDependencies(devDeps, npmDeps.devDependencies);
                        }
                    });
                    if (engineConfig?.engine?.npm) {
                        _mergeDependencies(deps, engineConfig.engine.npm.dependencies);
                        _mergeDependencies(devDeps, engineConfig.engine.npm.devDependencies);
                    }
                }
            }
        }
    }

    const { plugins } = c.buildConfig;

    if (plugins) {
        Object.keys(plugins).forEach((k) => {
            const plugin = getMergedPlugin(c, k);
            if (!plugin) return;

            const { version } = plugin;
            if (supportedPlatforms) {
                if (
                    plugin.disabled !== true &&
                    plugin.disableNpm !== true &&
                    _isPluginRequired(plugin, supportedPlatforms)
                ) {
                    if (version) {
                        if (!deps[k]) {
                            deps[k] = version;
                        }
                    }
                }
            }
        });
    }
    writeFileSync(c.paths.project.package, c.files.project.package);
};

export default Question;
