import { RnvFileName } from '../enums/fileName';
import { logDebug } from '../logger';
import { ConfigFileRenative } from '../schema/types';
import { writeFileSync } from '../system/fs';
import { generateBuildConfig } from './buildConfig';

export const writeRenativeConfigFile = (configPath: string | undefined, configData: string | object) => {
    logDebug(`writeRenativeConfigFile:${configPath}`);
    writeFileSync(configPath, configData);
    generateBuildConfig();
};

export const getUpdatedConfigFile = <T extends Record<string, any>>(
    configFile: T,
    namespace?: keyof ConfigFileRenative
): T => {
    const updatedConfigFile: Record<string, any> = {};

    if (!configFile?.$schema && namespace) {
        updatedConfigFile[namespace as string] = { ...configFile };
    }
    if (configFile?.$schema && !configFile.$schema.includes(RnvFileName.schema)) {
        const currentScheme = configFile.$schema;
        const misNamespace = namespace || _getNameSpace(currentScheme);
        if (misNamespace) {
            updatedConfigFile[misNamespace] = { ...configFile };
        }
    }
    return Object.keys(updatedConfigFile).length ? (updatedConfigFile as T) : configFile;
};

const _getNameSpace = (currentScheme: string) => {
    const parts = currentScheme.split('/');
    const filename = parts[parts.length - 1];
    const namespace = filename.split('.')[1];
    return namespace;
};
