import { writeFileSync, fsExistsSync } from '../system/fs';
import { logWarning } from '../logging/logger';
import { configSchema } from '../constants';
import { RnvContext } from './types';
import { generateConfigBase } from './contextBase';

class ContextCls {
    // config: RnvContext;

    constructor() {
        global.RNV_CONTEXT = generateConfigBase();
    }

    initializeConfig(c: RnvContext) {
        global.RNV_CONTEXT = c;
        return c;
    }

    getContext(): RnvContext {
        return global.RNV_CONTEXT;
    }

    // RNV CONFIG
    getConfigValueSeparate(key: string, global = false) {
        const { paths } = this.getContext();

        if (!global && !fsExistsSync(paths.project.config)) return 'N/A'; // string because there might be a setting where we will use null
        const cfg = global ? require(paths.GLOBAL_RNV_CONFIG) : require(paths.project.config);

        const value = cfg[configSchema[key].key];
        if (value === undefined) return 'N/A';

        return value;
    }

    listConfigValue(key: string) {
        let localVal = this.getConfigValueSeparate(key).toString();
        let globalVal = this.getConfigValueSeparate(key, true).toString();

        if (globalVal === 'N/A' && configSchema[key].default) {
            globalVal = configSchema[key].default;
        }
        if (localVal === 'N/A') localVal = globalVal;

        const table: Array<Record<string, any>> = [
            {
                Key: key,
                'Global Value': globalVal,
            },
        ];

        if (localVal !== 'N/A') {
            table[0]['Project Value'] = localVal;
        }

        return table;
    }

    isConfigValueValid(key: string, value: string | boolean) {
        const keySchema = configSchema[key];
        if (!keySchema) {
            logWarning(`Unknown config param ${key}`);
            return false;
        }

        if (keySchema.values && !keySchema.values.includes(value)) {
            logWarning(`Unsupported value provided for ${key}. Correct values are ${keySchema.values.join(', ')}`);
            return false;
        }

        return true;
    }

    setConfigValue(key: string, value: string | boolean) {
        const {
            program: { global },
            paths,
        } = this.getContext();

        if (this.isConfigValueValid(key, value)) {
            let isValid = value;
            const configPath = global ? paths.GLOBAL_RNV_CONFIG : paths.project.config;
            const config = require(configPath);

            if (typeof isValid === 'string') {
                if (['true', 'false'].includes(isValid)) isValid = isValid === 'true'; // convert string to bool if it matches a bool value
            }

            config[configSchema[key].key] = isValid;
            writeFileSync(configPath, config);
            return true;
        }
        return false;
    }

    get isAnalyticsEnabled() {
        return this.getContext().buildConfig?.enableAnalytics;
    }
}

const Context = new ContextCls();

export const getContext = (): RnvContext => {
    return Context.getContext();
};

export { Context };
