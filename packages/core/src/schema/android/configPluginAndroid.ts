import { z } from 'zod';
import { PluginShared } from '../shared/configPluginShared';
import { PlatformSharedAndroid } from './configPlatformSharedAndroid';

export const PluginAndroid = z.object({}).merge(PluginShared).merge(PlatformSharedAndroid);
