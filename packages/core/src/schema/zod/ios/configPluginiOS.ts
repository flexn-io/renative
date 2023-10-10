import { z } from 'zod';
import { PluginShared } from '../shared/configPluginShared';
import { PlatformSharediOS } from './configPlatformSharediOS';

const Git = z.string().describe('Alternative git url for pod instead of version');

const Commit = z.string().describe('Alternative git commit reference string');

const Version = z.string().describe('Version of pod');

export const PluginiOS = PluginShared.merge(PlatformSharediOS).merge(
    z.object({
        git: z.optional(Git),
        commit: z.optional(Commit),
        version: z.optional(Version),
    })
);
