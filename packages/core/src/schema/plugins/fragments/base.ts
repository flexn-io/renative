import { z } from 'zod';
import { SupportedPlatforms } from '../../shared';

const Disabled = z.boolean().default(false).describe('Marks plugin disabled');

const Props = z.record(z.string(), z.string()).describe('Custom props passed to plugin');
const Version = z.string().describe('Version of plugin. Typically package version');
const Source = z
    .string()
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
const PluginDependencies = z
    .record(z.string(), z.string().nullable())
    .describe('List of other Renative plugins this plugin depends on');

const Webpack = z
    .object({
        modulePaths: z.union([z.boolean(), z.array(z.string())]).optional(),
        moduleAliases: z
            .union([
                z.boolean(),
                z.record(
                    z.string(),
                    z.union([
                        z.string(),
                        z.object({
                            projectPath: z.string(),
                        }),
                    ])
                ),
            ])
            .optional(),
        nextTranspileModules: z.optional(z.array(z.string())),
    })
    .describe('Allows you to configure webpack bahaviour per each individual plugin');

const Deprecated = z
    .string()
    .describe('Marks your plugin deprecated with warning showing in the console during rnv commands');

const DisablePluginTemplateOverrides = z.boolean().describe('Disables plugin overrides for selected plugin');

export const zodPluginBaseFragment = {
    supportedPlatforms: SupportedPlatforms.optional(),
    disabled: z.optional(Disabled),
    props: z.optional(Props),
    version: z.optional(Version),
    deprecated: z.optional(Deprecated),
    source: z.optional(Source),
    disableNpm: z.optional(NoNpm),
    skipMerge: z.optional(SkipMerge),
    npm: z.optional(Npm), //=> npmDependencies
    pluginDependencies: z.optional(PluginDependencies),
    webpackConfig: z.optional(Webpack), //Should this be at root plugin???
    disablePluginTemplateOverrides: z.optional(DisablePluginTemplateOverrides),
    fontSources: z.array(z.string()).optional(),
    // 'no-npm': z.optional(NoNpm),//DEPRECATED => disableNpm
    // plugins: z.optional(PluginDependencies),  //DEPRECATED => pluginDependencies
    // webpack: z.optional(Webpack), //Should this be at root plugin??? // DEPRECATED
    // 'engine-rn-next': z.optional(Webpack), //Should this be at root plugin??? // DEPRECATED
};
