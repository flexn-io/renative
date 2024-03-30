import { z } from 'zod';
import { zodTemplateAndroidBaseFragment } from './templateAndroidBase';

export const zodTemplateAndroidFragment = {
    templateAndroid: z.optional(
        z.object({
            ...zodTemplateAndroidBaseFragment,
            settings_gradle: z.optional(z.object({})),
            gradle_wrapper_properties: z.optional(z.object({})),
            SplashActivity_java: z.optional(z.object({})),
            styles_xml: z.optional(z.object({})),
            colors_xml: z.optional(z.object({})),
            strings_xml: z.optional(z.object({})),
            proguard_rules_pro: z.optional(z.object({})),
        })
    ),
};
