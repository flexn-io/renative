import { getRealPath, writeFileSync } from '../system/fs';
import { chalk, logTask, logWarning } from '../logger';
import { RnvContext } from '../context/types';
import { RnvPlatform } from '../types';
import { RenativeConfigFile } from '../schema/types';
import { NpmPackageFile } from './types';

const SYNCED_DEPS = [
    'rnv',
    '@rnv/engine-rn',
    '@rnv/engine-rn-next',
    '@rnv/engine-lightning',
    '@rnv/engine-rn-web',
    '@rnv/engine-rn-electron',
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
    configFile: RenativeConfigFile | null,
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

const _fixDeps = (deps: Record<string, string>, version: string) => {
    SYNCED_DEPS.forEach((dep) => {
        const d = deps?.[dep];
        if (d) {
            const prefix = d.match(/~|>|>=|\^|<|<=/) || '';
            deps[dep] = `${prefix}${version}`;
        }
    });
};

export const updateProjectPlatforms = (c: RnvContext, platforms: Array<string>) => {
    const {
        project: { config },
    } = c.paths;
    const currentConfig = c.files.project.config;
    currentConfig.defaults = currentConfig.defaults || {};
    currentConfig.defaults.supportedPlatforms = platforms;
    writeFileSync(config, currentConfig);
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
                            if (pt1) result[platform] = pt1;
                        } else {
                            const pt2 = getRealPath(c, pt[platform], 'platformTemplatesDir', originalPath);
                            if (pt2) result[platform] = pt2;
                        }
                    } else {
                        logWarning(
                            `Platform ${chalk().red(platform)} not supported by any registered engine. SKIPPING...`
                        );
                    }
                }
            }
        });
    } else {
        logWarning(`Your renative.json is missing property: ${chalk().red('defaults.supportedPlatforms')} `);
    }

    c.paths.project.platformTemplatesDirs = result;
};
