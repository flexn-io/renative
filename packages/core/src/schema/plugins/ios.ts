import { z } from 'zod';
import { PluginPlatformBase } from './platformBase';
import { TemplateXcodeBaseFragment } from '../platforms/fragments/templateXcodeBase';

const Git = z.string().describe('Alternative git url for pod instead of version');

const Commit = z.string().describe('Alternative git commit reference string');

const Version = z.string().describe('Version of pod');

export const PluginiOS = PluginPlatformBase.merge(
    z.object({
        git: z.optional(Git),
        commit: z.optional(Commit),
        version: z.optional(Version),
        podNames: z.optional(z.array(z.string())),
        podName: z.optional(z.string()),
        staticFrameworks: z.optional(z.array(z.string())),
        templateXcode: z.optional(z.object(TemplateXcodeBaseFragment)),
    })
);

export type _PluginiOSType = z.infer<typeof PluginiOS>;
