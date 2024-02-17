import { getRealPath, writeFileSync } from '../system/fs';
import { chalk, logTask, logWarning } from '../logger';
import { RnvContext } from '../context/types';
import { RnvPlatform } from '../types';
import { PlatformKey } from '../schema/types';
import { NpmPackageFile } from './types';
import { ConfigFileProject } from '../schema/configFiles/types';

const SYNCED_DEPS = [
    'rnv',
    '@rnv/engine-rn',
    '@rnv/engine-rn-next',
    '@rnv/engine-lightning',
    '@rnv/engine-rn-web',
    '@rnv/engine-rn-electron',
    '@rnv/engine-rn-tauri',
    '@rnv/engine-rn-macos',
    '@rnv/engine-rn-windows',
    '@rnv/engine-rn-tvos',
    '@rnv/renative',
    '@rnv/template-starter',
];

const SYNCED_TEMPLATES = ['@rnv/template-starter'];

export const upgradeProjectDependencies = (c: RnvContext, version: string) => {
    logTask('upgradeProjectDependencies');

    // const templates = c.files.project.config?.templates;
    // TODO: Make this dynamically injected
    // SYNC DEPS
    const result = upgradeDependencies(
        c.files.project.package,
        c.paths.project.package,
        c.files.project.config,
        c.paths.project.config,
        version
    );
    c._requiresNpmInstall = true;
    return result;
};

export const upgradeDependencies = (
    packageFile: NpmPackageFile,
    packagesPath: string | undefined,
    configFile: ConfigFileProject | undefined,
    configPath: string | null,
    version: string
) => {
    // logTask('upgradeDependencies');

    const result = [];

    _fixDeps(packageFile?.devDependencies, version);
    _fixDeps(packageFile?.dependencies, version);
    _fixDeps(packageFile?.peerDependencies, version);
    SYNCED_TEMPLATES.forEach((templ) => {
        if (configFile?.templates?.[templ]?.version) {
            configFile.templates[templ].version = version;
        }
    });

    if (packageFile) {
        writeFileSync(packagesPath, packageFile);
        result.push(packagesPath);
    }
    if (configFile && configPath) {
        writeFileSync(configPath, configFile);
        result.push(configPath);
    }
    return result;
};

const _fixDeps = (deps: Record<string, string> | undefined, version: string) => {
    if (!deps) return;
    SYNCED_DEPS.forEach((dep) => {
        const d = deps?.[dep];
        if (d) {
            const prefix = d.match(/~|>|>=|\^|<|<=/) || '';
            deps[dep] = `${prefix}${version}`;
        }
    });
};

export const updateProjectPlatforms = (c: RnvContext, platforms: Array<PlatformKey>) => {
    const {
        project: { config },
    } = c.paths;
    const currentConfig = c.files.project.config;
    if (currentConfig) {
        currentConfig.defaults = currentConfig.defaults || {};
        currentConfig.defaults.supportedPlatforms = platforms;
        writeFileSync(config, currentConfig);
    } else {
        logWarning('Config not loaded yet. skipping updateProjectPlatforms');
    }
};

export const generatePlatformTemplatePaths = (c: RnvContext) => {
    logTask('generatePlatformTemplatePaths');
    if (!c.buildConfig.paths) {
        logWarning(`You're missing paths object in your ${chalk().red(c.paths.project.config)}`);
        c.buildConfig.paths = {
            appConfigsDirs: [],
            platformTemplatesDirs: {},
        };
    }

    const pt = c.buildConfig.paths?.platformTemplatesDirs || {};
    const result: Record<string, string> = {};

    if (c.buildConfig.defaults) {
        c.buildConfig.defaults?.supportedPlatforms?.forEach((platform: RnvPlatform) => {
            if (platform) {
                const engine = c.runtime.enginesByPlatform[platform];
                if (engine) {
                    const originalPath = engine.originalTemplatePlatformsDir;

                    if (originalPath) {
                        if (!pt[platform]) {
                            const pt1 = getRealPath(c, originalPath, 'platformTemplatesDir', originalPath);
                            if (pt1) {
                                result[platform] = pt1;
                            } else {
                                logWarning(`Cannot resolve originalTemplatePlatformsDir: ${originalPath}. SKIPPING...`);
                            }
                        } else {
                            const pt2 = getRealPath(c, pt[platform], 'platformTemplatesDir', originalPath);
                            if (pt2) {
                                result[platform] = pt2;
                            } else {
                                logWarning(
                                    `Cannot resolve platformTemplatesDirs[${platform}] with original path: ${originalPath}. SKIPPING...`
                                );
                            }
                        }
                    } else {
                        logWarning(
                            `Platform ${chalk().red(platform)} not supported by any registered engine. SKIPPING...`
                        );
                    }
                } else if (platform === c.platform && c.runtime.currentEngine) {
                    //NOTE: only log warning if there is already registered engine but cannot be found by platform
                    logWarning(
                        `Could not find active engine for platform: ${chalk().red(
                            platform
                        )}. Available engine platforms: ${Object.keys(c.runtime.enginesByPlatform)}`
                    );
                }
            }
        });
    } else {
        logWarning(`Your renative.json is missing property: ${chalk().red('defaults.supportedPlatforms')} `);
    }

    c.paths.project.platformTemplatesDirs = result;
};
