import { z } from 'zod';
import { zodTemplateXcodeFragment } from '../../platforms/fragments/templateXcode';

export const zodPluginPlatformiOSFragment = zodTemplateXcodeFragment.extend({
    git: z.string().describe('Alternative git url for pod instead of version'),
    commit: z.string().describe('Alternative git commit reference string'),
    version: z.string().describe('Version of pod'),
    podNames: z.array(z.string()),
    podName: z.string(),
    staticFrameworks: z.array(z.string()),
    isStatic: z.boolean(),
    buildType: z.enum(['dynamic', 'static']).describe('Build type of the pod'),
});
