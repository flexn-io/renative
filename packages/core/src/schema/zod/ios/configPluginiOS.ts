import { z } from 'zod';
import { PluginShared } from '../shared/configPluginShared';
import { PlatformSharediOS } from './configPlatformSharediOS';

export const PluginiOS = z.object({}).merge(PluginShared).merge(PlatformSharediOS);
