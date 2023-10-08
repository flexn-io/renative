import { z } from 'zod';
import { PluginCommon } from './configPluginCommon';

export const PluginiOS = z.object({}).merge(PluginCommon);
