import { z } from 'zod';

const IgnoreWarnings = z.boolean().describe('Injects `inhibit_all_warnings` into Podfile');

const IgnoreLogs = z.boolean().describe('Passes `-quiet` to xcodebuild command');

export const PlatformiOS = z.object({
    ignoreWarnings: z.optional(IgnoreWarnings),
    ignoreLogs: z.optional(IgnoreLogs),
});
