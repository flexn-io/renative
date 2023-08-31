import { RenativeConfigPlugin } from '../configManager/types';

export type PluginCallback = (plugin: RnvPlugin, pluginPlat: any, key: string) => void;

export type PluginListResponse = {
    asString: string;
    asArray: PluginListResponseItem[];
    plugins: PluginListResponseItem[];
    allPlugins: Record<string, PluginListResponseItem>;
};

export type PluginListResponseItem = {
    name: string;
    value: string;
    props: any;
    version: string;
};

export type RnvPluginScope = {
    npmVersion?: string;
    scope: string;
};

export type RnvPlugin = RenativeConfigPlugin & {
    scope?: string;
    _scopes?: Array<string>;
    _id?: string;
    config?: {
        fontSources: Array<string>;
    };
};

export type RnvPluginPlatform = 'ios' | 'android' | 'webpack';
