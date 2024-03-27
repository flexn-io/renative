import merge from 'deepmerge';
import { getContext } from '../context/provider';
import { logDefault } from '../logger';
import { getEngineRunnerByPlatform } from '.';
import { NpmDepKey, NpmPackageFile } from '../configs/types';
import { DependencyMutation } from '../projects/types';
import { createDependencyMutation } from '../projects/mutations';

export const resolveEngineDependencies = async () => {
    logDefault('resolveEngineDependencies');
    const c = getContext();
    const { platform } = c;
    const engine = getEngineRunnerByPlatform(platform);
    const npmDepsBase = engine?.config?.npm || {};
    const npmDepsExt = platform ? engine?.config?.platforms?.[platform]?.npm || {} : {};

    const npmDeps = merge<Pick<NpmPackageFile, NpmDepKey>>(npmDepsBase, npmDepsExt);

    if (npmDeps) {
        const mutations: Array<DependencyMutation> = [];

        Object.keys(npmDeps).forEach((t) => {
            const depType = t as NpmDepKey;
            const deps = npmDeps[depType];
            if (deps) {
                Object.keys(deps).forEach((k) => {
                    const ver = c.files.project.package?.[depType]?.[k];
                    if (!ver) {
                        mutations.push(
                            createDependencyMutation({
                                name: k,
                                updated: {
                                    version: deps[k],
                                },
                                type: depType,
                                msg: 'Missing dependency',
                                source: 'engine.npm (renative.engine.json)',
                                targetPath: c.paths.project.package,
                            })
                        );
                    } else if (ver !== deps[k]) {
                        mutations.push(
                            createDependencyMutation({
                                name: k,
                                original: {
                                    version: ver,
                                },
                                updated: {
                                    version: deps[k],
                                },
                                type: depType,
                                msg: 'Outdated dependency',
                                source: 'engine.npm (renative.engine.json)',
                                targetPath: c.paths.project.package,
                            })
                        );
                    }
                });
            }
        });

        console.log('DDKDLKDLD', npmDeps, mutations);

        if (mutations.length) {
            c._requiresNpmInstall = true;
        }
    }

    // add other deps that are not npm
};

// if (installed.some((i) => i === true)) {
//     const { isMonorepo } = c.buildConfig;
//     if (isMonorepo) {
//         logInfo(
//             `Found extra npm dependencies required by ${chalk().bold(
//                 engine.config.id
//             )} engine. project marked as monorepo. SKIPPING`
//         );
//     } else {
//         // do npm i only if something new is added
//         logInfo(
//             `Found extra npm dependencies required by ${chalk().bold(engine.config.id)} engine. ADDING...DONE`
//         );
//         if (handleExtraDepsCallback) {
//             await handleExtraDepsCallback();
//         }
//     }
// }
