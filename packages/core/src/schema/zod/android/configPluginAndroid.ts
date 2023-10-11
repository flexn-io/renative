import { z } from 'zod';
import { PluginShared } from '../shared/configPluginShared';
import { PlatformSharedAndroid } from './configPlatformSharedAndroid';

export const PluginAndroid = PluginShared.merge(PlatformSharedAndroid).merge(
    z.object({
        projectName: z.optional(z.string()),
        skipLinking: z.optional(z.boolean()),
        skipImplementation: z.optional(z.boolean()),
        implementation: z.optional(z.string()),
        package: z.optional(z.string()),
        ResourceStrings: z.optional(
            z.object({
                children: z.optional(
                    z.array(
                        z.object({
                            tag: z.string(),
                            name: z.string(),
                            child_value: z.string(),
                        })
                    )
                ),
            })
        ),
    })
);
