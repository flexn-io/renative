import { z } from 'zod';
import { PluginAndroid } from './android/configPluginAndroid';
import { PluginiOS } from './ios/configPluginiOS';
import { PluginShared } from './shared/configPluginShared';

// DEPRECATED?
const Enabled = z.boolean().default(true).describe('Marks plugin enabled or disabled'); //TODO: switch to disabled
const Props = z.record(z.string(), z.any()).describe('Custom props passed to plugin');
const Version = z.string().describe('Version of plugin. Typically package version');
const Source = z
    .boolean()
    .describe(
        'Will define custom scope for your plugin config to extend from.\n\nNOTE: custom scopes can be defined via paths.pluginTemplates.[CUSTOM_SCOPE].{}'
    );
const NoNpm = z.boolean().describe('Will skip including plugin in package.json and installing it via npm/yarn etc');
const SkipMerge = z
    .boolean()
    .describe(
        'Will not attempt to merge with existing plugin configuration (ie. coming form renative pluginTemplates)\n\nNOTE: if set to `true` you need to configure your plugin object fully'
    );
const Npm = z
    .record(z.string(), z.string())
    .describe('Object of npm dependencies of this plugin. These will be injected into package.json');
const PluginDependencies = z.array(z.string()).describe('List of other Renative plugins this plugin depends on');
const Webpack = z
    .object({
        modulePaths: z.union([z.boolean(), z.record(z.string(), z.string())]),
        moduleAliases: z.union([z.boolean(), z.record(z.string(), z.string())]),
    })
    .describe('Allows you to configure webpack bahaviour per each individual plugin');

export const PluginPartial = z.object({
    enabled: z.optional(Enabled),
    props: z.optional(Props),
    version: z.optional(Version),
    source: z.optional(Source),
    'no-npm': z.optional(NoNpm),
    skipMerge: z.optional(SkipMerge),
    npm: z.optional(Npm),
    pluginDependencies: z.optional(PluginDependencies),
    // DEPRECATED
    webpack: z.optional(Webpack), //Should this be at root plugin???
    webpackConfig: z.optional(Webpack), //Should this be at root plugin???
    // PLATFORMS
    android: z.optional(PluginAndroid),
    androidtv: z.optional(PluginAndroid),
    androidwear: z.optional(PluginAndroid),
    firetv: z.optional(PluginAndroid),
    ios: z.optional(PluginiOS),
    tvos: z.optional(PluginiOS),
    tizen: z.optional(PluginShared),
    webos: z.optional(PluginShared),
    web: z.optional(PluginShared),
    webtv: z.optional(PluginShared),
    chromecast: z.optional(PluginShared),
    kaios: z.optional(PluginShared),
    macos: z.optional(PluginShared),
    linux: z.optional(PluginShared),
    windows: z.optional(PluginShared),
    xbox: z.optional(PluginShared),
});

export const Plugin = z.union([PluginPartial, z.string()]);

export type _PluginPartialType = z.infer<typeof Plugin>;

export const Plugins = z
    .record(z.string(), Plugin)
    .describe(
        'Define all plugins available in your project. you can then use `includedPlugins` and `excludedPlugins` props to define active and inactive plugins per each app config'
    );
