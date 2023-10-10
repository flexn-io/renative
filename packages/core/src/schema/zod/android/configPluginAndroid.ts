import { PluginShared } from '../shared/configPluginShared';
import { PlatformSharedAndroid } from './configPlatformSharedAndroid';

export const PluginAndroid = PluginShared.merge(PlatformSharedAndroid);
