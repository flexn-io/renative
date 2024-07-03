import path from 'path';
import { Configuration } from 'webpack';
import paths from './config/paths';
import { mergeWithCustomize } from 'webpack-merge';
import { Env, fsExistsSync, fsReaddirSync } from '@rnv/core';
import _ from 'lodash';

const env: Env = process?.env;

export const withRNVWebpack = (cnf: Configuration) => {
    //TODO: implement further overrides
    const rnvConfig: Configuration = {
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
                    include: _getIncludedModules(env.WEBPACK_EXCLUDED_PATHS),
                },
            ],
        });

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

// Merge => static config, adapter config , project config
export const getMergedConfig = (rootConfig: Configuration, appPath: string) => {
    const projectConfig: Configuration = require(path.join(appPath, 'webpack.config'));

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
    return mergedConfig;
};

const _getIncludedPaths = (basePath: string, excludedPaths: string[]) => {
    const srcDirs: string[] = [];
    // track excluded sub-paths
    const excPathsArrs = excludedPaths.map((p) => p.split('/'));
    if (fsExistsSync(basePath)) {
        const dirNames = fsReaddirSync(basePath);
        dirNames.forEach((dirName) => {
            let hasPathExcluded = false;
            const subpaths: string[] = [];
            excPathsArrs.forEach((pArr) => {
                if (pArr[0] === dirName) {
                    if (pArr.length <= 1) {
                        hasPathExcluded = true;
                    } else {
                        subpaths.push(pArr.slice(1).join('/'));
                    }
                }
            });
            const incPath = path.join(basePath, dirName);
            if (!hasPathExcluded) {
                srcDirs.push(incPath);
            }
            if (subpaths.length) {
                // recursively populate included paths
                srcDirs.push(..._getIncludedPaths(incPath, subpaths));
            }
        });
    }
    return srcDirs;
};

const _getIncludedModules = (excludedPathsStr: string | undefined) => {
    const excludedPaths = excludedPathsStr ? excludedPathsStr.split(',') : [];
    const srcDirs = _getIncludedPaths(paths.appSrc, excludedPaths);
    return env.RNV_MODULE_PATHS ? [...srcDirs, ...env.RNV_MODULE_PATHS.split(',')] : [...srcDirs];
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
                merged[key] = env.RNV_MODULE_PATHS
                    ? _.uniq([...cnfValue, ...env.RNV_MODULE_PATHS.split(',')])
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
