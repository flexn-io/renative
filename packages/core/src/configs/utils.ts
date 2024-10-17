import path from 'path';
import merge from 'deepmerge';
import { inquirerPrompt } from '../api';
import { getConfigRootProp } from '../context/contextProps';
import { getContext } from '../context/provider';
import { RnvFileName } from '../enums/fileName';
import { logDebug, logInfo } from '../logger';
import { ConfigFileRenative } from '../schema/types';
import { writeFileSync } from '../system/fs';
import { generateBuildConfig } from './buildConfig';

export const writeRenativeConfigFile = (configPath: string | undefined, configData: string | object) => {
    logDebug(`writeRenativeConfigFile:${configPath}`);
    writeFileSync(configPath, configData);
    generateBuildConfig();
};

export const getUpdatedConfigFile = async <T extends Record<string, any>>(
    configFile: T,
    configPath?: string,
    namespace?: keyof ConfigFileRenative
): Promise<T> => {
    let updatedConfigFile: Record<string, any> = {};

    let isOldFile = false;
    let misNamespace = namespace;
    if (!configFile?.$schema && misNamespace) {
        isOldFile = true;
        if (configFile[misNamespace]) {
            updatedConfigFile = merge({}, configFile);
        } else {
            updatedConfigFile[misNamespace] = merge({}, configFile);
        }
    }
    if (configFile?.$schema && !configFile.$schema.includes(RnvFileName.schema)) {
        isOldFile = true;
        const currentScheme = configFile.$schema;
        misNamespace = namespace || _getNameSpace(currentScheme);
        if (misNamespace) {
            updatedConfigFile[misNamespace] = { ...configFile };
        }
    }

    if (isOldFile) {
        const { confirm } = await inquirerPrompt({
            type: 'confirm',
            name: 'confirm',
            message: `Your config file does not match the new schema structure ${configPath}. Fix it now?`,
        });
        if (confirm) {
            const relativeShemePath = generateNewSchemaPath(configPath || '');
            if (misNamespace) {
                delete updatedConfigFile[misNamespace].$schema;
            }
            updatedConfigFile.$schema = relativeShemePath;
            writeFileSync(configPath, updatedConfigFile);
            logInfo(`Config file has been updated to support the new schema structure ${configPath}`);
        }
    }
    return Object.keys(updatedConfigFile).length ? (updatedConfigFile as T) : configFile;
};

const _getNameSpace = (currentScheme: string) => {
    const parts = currentScheme.split('/');
    const filename = parts[parts.length - 1];
    const namespace = filename.split('.')[1];
    return namespace as keyof ConfigFileRenative;
};

export const generateNewSchemaPath = (configPath: string) => {
    logDebug('getNewSchemaPath', `path:${configPath}`);
    const c = getContext();
    const isMonorepo = getConfigRootProp('isMonorepo');
    const rootPath = isMonorepo ? path.join(c.paths.project.dir, '../..') : c.paths.project.dir;

    const schemaPath = path.join(rootPath, '.rnv/schema', RnvFileName.schema);
    const relativeSchemaPath = path.relative(path.dirname(configPath), schemaPath);
    return relativeSchemaPath;
};
