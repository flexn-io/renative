import { z } from 'zod';
import { PluginCommon } from '../common/configPluginCommon';
import { PlatformCommoniOS } from './configPlatformCommoniOS';

export const PluginiOS = z.object({}).merge(PluginCommon).merge(PlatformCommoniOS);
