import { logDebug } from '../logger';
import { writeFileSync } from '../system/fs';
import { generateBuildConfig } from './buildConfig';

export const writeRenativeConfigFile = (configPath: string | undefined, configData: string | object) => {
    logDebug(`writeRenativeConfigFile:${configPath}`);
    writeFileSync(configPath, configData);
    generateBuildConfig();
};
