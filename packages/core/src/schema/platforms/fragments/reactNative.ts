import { z } from 'zod';

export const zodPlatformReactNativeFragment = {
    reactNativeEngine: z.optional(
        z
            .enum(['jsc', 'v8-android', 'v8-android-nointl', 'v8-android-jit', 'v8-android-jit-nointl', 'hermes'])
            .default('hermes')
            .describe('Allows you to define specific native render engine to be used')
    ),
};
