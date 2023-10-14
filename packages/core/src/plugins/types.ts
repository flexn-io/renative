import { RenativeConfigPlugin, RenativeConfigPluginPlatform } from '../schema/types';

export type PluginCallback = (plugin: RnvPlugin, pluginPlat: RenativeConfigPluginPlatform, key: string) => void;

export type PluginListResponse = {
    asString: string;
    asArray: PluginListResponseItem[];
    plugins: string[];
    allPlugins: Record<string, PluginListResponseItem>;
    json?: any;
};

export type PluginListResponseItem = {
    name: string;
    value: string;
    props?: any;
    version?: string;
};

export type RnvPluginScope = {
    npmVersion?: string;
    scope: string;
};

export type RnvPlugin = RenativeConfigPlugin & {
    packageName?: string;
    scope?: string;
    _scopes?: Array<string>;
    _id?: string;
    config?: {
        fontSources: Array<string>;
    };
};

// export type RnvPluginPlatform = 'ios' | 'android' | 'web';

export type RnvPluginWebpackKey = 'webpack' | 'webpackConfig' | 'engine-rn-next';
