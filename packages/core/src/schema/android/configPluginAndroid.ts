import { z } from 'zod';
import { PluginCommon } from '../common/configPluginCommon';
import { PlatformCommonAndroid } from './configPlatformCommonAndroid';

export const PluginAndroid = z.object({}).merge(PluginCommon).merge(PlatformCommonAndroid);
