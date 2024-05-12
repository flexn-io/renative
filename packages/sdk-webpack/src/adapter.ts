import path from 'path';
import { Configuration } from 'webpack';
import paths from './config/paths';
import { mergeWithCustomize } from 'webpack-merge';
import { fsExistsSync, fsReaddirSync, getContext } from '@rnv/core';
import _ from 'lodash';

export const withRNVWebpack = (cnf: Configuration) => {
    //TODO: implement further overrides
    let rnvConfig: Configuration = {};
    const c = getContext();
    const { platform } = c;
    if (platform) {
        if (process.env.RNV_ENGINE_PATH) {
            const engine = require(process.env.RNV_ENGINE_PATH);
            if (engine.withRNVWebpack) {
                const excludedDirs =
                    c.buildConfig?.platforms?.[platform]?.webpackExcludedDirs ||
                    engine.default.config.webpackExcludedDirs ||
                    [];
                rnvConfig = {
                    module: {
                        rules: [],
                    },
                    resolve: {},
                };
                rnvConfig?.module?.rules &&
                    rnvConfig.module.rules.push({
                        oneOf: [
                            {
                                test: /\.(js|mjs|cjs|jsx|ts|tsx)$/,
                                include: _getIncludedModules(excludedDirs),
                            },
                        ],
                    });
            }
        }
    }

    const mergedConfig: Configuration = mergeWithCustomize({
        customizeArray(a, b, key) {
            if (key === 'module.rules') {
                return _getMergedRules(a, b);
            }
            return undefined;
        },
    })(rnvConfig, cnf);

    return mergedConfig;
};

export const getMergedConfig = (rootConfig: Configuration, appPath: string) => {
    // RNV-ADDITION

    const projectConfig: Configuration = require(path.join(appPath, 'webpack.config'));

    // const rootPlugins = rootConfig.plugins?.map((plugin) => plugin?.constructor.name) as string[];

    const mergedConfig: Configuration = mergeWithCustomize({
        customizeArray(a, b, key) {
            if (key === 'plugins') {
                return _.uniq([...a, ...b]);
            }
            if (key === 'module.rules') {
                return _getMergedRules(a, b);
            }

            return undefined;
        },
        // customizeArray: unique('plugins', rootPlugins, (plugin) => plugin.constructor && plugin.constructor.name),
    })(rootConfig, projectConfig);

    // Merge => static config, adapter config , project config
    // RNV-ADDITION
    console.log('mergedConfig', mergedConfig);
    mergedConfig.module?.rules?.map((it) => {
        console.log('mergedConfig rule', it);
        if (typeof it === 'object' && it?.oneOf && Array.isArray(it.oneOf)) {
            it.oneOf.map((p) => console.log(' mergedConfig oneOf item', p));
        }
    });
    return mergedConfig;
};

const _getIncludedModules = (excludedDirs: string[]) => {
    const srcDirs: string[] = [];
    if (fsExistsSync(paths.appSrc)) {
        const resources = fsReaddirSync(paths.appSrc);
        resources.forEach((r) => {
            if (!excludedDirs.includes(r)) {
                srcDirs.push(path.join(paths.appSrc, r));
            }
        });
    }
    return process.env.RNV_MODULE_PATHS ? [...srcDirs, ...process.env.RNV_MODULE_PATHS.split(',')] : [...srcDirs];
};

const _getMergedRules = (rnvRules: any[], cnfRules: any[]) => {
    const mergedRules: any[] = [];
    const copyCnfRules = [...cnfRules];
    rnvRules.forEach((rnvRule) => {
        const duplicateTestIndex = copyCnfRules.findIndex((cnfRule) => {
            if (_.isRegExp(rnvRule.test) && _.isRegExp(cnfRule.test)) {
                return rnvRule.test.toString() === cnfRule.test.toString();
            }
            if (_.isArray(rnvRule.test) && _.isArray(cnfRule.test)) {
                return _.isEqualWith(rnvRule.test, cnfRule.test, _regexArrayCustomizer);
            }
        });
        if (duplicateTestIndex !== -1) {
            const cnfRule = copyCnfRules[duplicateTestIndex];
            const mergedRule = _mergeRule(rnvRule, cnfRule);
            mergedRules.push(mergedRule);
            copyCnfRules.splice(duplicateTestIndex, 1);
        } else {
            if (rnvRule?.oneOf) {
                const cnfRuleOneOfIndex = copyCnfRules.findIndex((cnfRule) => cnfRule.oneOf);
                const mergedOneOf = _getMergedRules(rnvRule.oneOf, copyCnfRules[cnfRuleOneOfIndex]?.oneOf);
                mergedRules.push({ oneOf: [...mergedOneOf] });
                copyCnfRules.splice(cnfRuleOneOfIndex, 1);
            } else {
                mergedRules.push(rnvRule);
            }
        }
    });

    mergedRules.push(...copyCnfRules);
    return mergedRules;
};

const _mergeRule = (rnvRule: any, cnfRule: any) => {
    return Object.keys({ ...rnvRule, ...cnfRule }).reduce((merged: any, key: string) => {
        const rnvValue = rnvRule[key];
        const cnfValue = cnfRule[key];
        if (!rnvValue && !cnfValue) {
            return merged;
        }
        if (_.isArray(rnvValue) && _.isArray(cnfValue)) {
            if (key === 'include') {
                merged[key] = process.env.RNV_MODULE_PATHS
                    ? _.uniq([...cnfValue, ...process.env.RNV_MODULE_PATHS.split(',')])
                    : [...cnfValue];
            } else {
                merged[key] = [...cnfValue];
            }
        } else if (_.isPlainObject(rnvValue) && _.isPlainObject(cnfValue)) {
            merged[key] = _mergeRule(rnvValue, cnfValue);
        } else {
            merged[key] = cnfValue !== undefined ? cnfValue : rnvValue;
        }

        return merged;
    }, {});
};

const _regexArrayCustomizer = (arr1: any, arr2: any) => {
    if (arr1.length === arr2.length) {
        return _.every(arr1, (value, index) => {
            if (_.isRegExp(value) && _.isRegExp(arr2[index])) {
                return value.toString() === arr2[index].toString();
            }
        });
    }
};
