import { z } from 'zod';
import { TemplateAndroidBaseFragment } from './templateAndroidBase';

export const TemplateAndroidFragment = {
    templateAndroid: z.optional(
        z.object({
            ...TemplateAndroidBaseFragment,
            settings_gradle: z.optional(z.object({})),
            gradle_wrapper_properties: z.optional(z.object({})),
            MainActivity_java: z.optional(
                z.object({
                    onCreate: z
                        .string({})
                        .optional()
                        .default('super.onCreate(savedInstanceState)')
                        .describe('Overrides super.onCreate method handler of MainActivity.java'),
                })
            ),
            MainApplication_java: z.optional(
                z
                    .object({
                        // onCreate: z
                        //     .string({})
                        //     .optional()
                        //     .default('super.onCreate(savedInstanceState)')
                        //     .describe('Overrides super.onCreate method handler of MainActivity.java'),
                    })
                    .describe('Allows you to configure behaviour of MainActivity')
            ),
            SplashActivity_java: z.optional(z.object({})),
            styles_xml: z.optional(z.object({})),
            colors_xml: z.optional(z.object({})),
            strings_xml: z.optional(z.object({})),
            proguard_rules_pro: z.optional(z.object({})),
        })
    ),
};
