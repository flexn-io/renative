import { z } from 'zod';
import { PlatformBaseFragment } from './fragments/base';
import { CommonSchemaFragment } from '../common';
import { PlatformElectronFragment } from './fragments/electron';
import { PlatformWindowsFragment } from './fragments/windows';
import { PlatformReactNativeFragment } from './fragments/reactNative';

export const PlatformWindowsSchema = z.object({
    ...CommonSchemaFragment,
    ...PlatformBaseFragment,
    ...PlatformElectronFragment,
    ...PlatformReactNativeFragment,
    ...PlatformWindowsFragment,
});
