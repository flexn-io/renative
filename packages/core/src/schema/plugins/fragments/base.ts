import { z } from 'zod';
import { zodSupportedPlatforms } from '../../shared';

export const zodPluginBaseFragment = z
    .object({
        supportedPlatforms: zodSupportedPlatforms.optional(),
        disabled: z.boolean().default(false).describe('Marks plugin disabled'),
        props: z.record(z.string(), z.string()).describe('Custom props passed to plugin'),
        version: z.string().describe('Version of plugin. Typically package version'),
        deprecated: z
            .string()
            .describe('Marks your plugin deprecated with warning showing in the console during rnv commands'),
        source: z
            .string()
            .describe(
                'Will define custom scope for your plugin config to extend from.\n\nNOTE: custom scopes can be defined via paths.pluginTemplates.[CUSTOM_SCOPE].{}'
            ),
        disableNpm: z
            .boolean()
            .describe('Will skip including plugin in package.json and installing it via npm/yarn etc'),
        skipMerge: z
            .boolean()
            .describe(
                'Will not attempt to merge with existing plugin configuration (ie. coming form renative pluginTemplates)\n\nNOTE: if set to `true` you need to configure your plugin object fully'
            ),
        npm: z
            .record(z.string(), z.string())
            .describe('Object of npm dependencies of this plugin. These will be injected into package.json'), //=> npmDependencies
        pluginDependencies: z
            .record(z.string(), z.string().nullable())
            .nullable()
            .describe('List of other Renative plugins this plugin depends on'),
        webpackConfig: z
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
            .describe('Allows you to configure webpack bahaviour per each individual plugin'), //Should this be at root plugin???
        disablePluginTemplateOverrides: z.boolean().describe('Disables plugin overrides for selected plugin'),
        fontSources: z.array(z.string()).optional(),
    })
    .partial();
