import { z } from 'zod';
import { PluginCommon } from './configPluginCommon';

export const PluginAndroid = z.object({}).merge(PluginCommon);
