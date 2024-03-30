import { z } from 'zod';
import { zodTemplateXcodeBaseFragment } from '../../platforms/fragments/templateXcodeBase';

const Git = z.string().describe('Alternative git url for pod instead of version');

const Commit = z.string().describe('Alternative git commit reference string');

const Version = z.string().describe('Version of pod');

const BuildType = z.enum(['dynamic', 'static']).describe('Build type of the pod');

export const zodPluginPlatformiOSFragment = {
    git: z.optional(Git),
    commit: z.optional(Commit),
    version: z.optional(Version),
    podNames: z.optional(z.array(z.string())),
    podName: z.optional(z.string()),
    staticFrameworks: z.optional(z.array(z.string())),
    templateXcode: z.optional(z.object(zodTemplateXcodeBaseFragment)),
    isStatic: z.boolean().optional(),
    buildType: z.optional(BuildType),
};
