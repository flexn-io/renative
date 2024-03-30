import { z } from 'zod';
import { zodPlatformBaseFragment } from './fragments/base';
import { zodCommonSchemaFragment } from '../common';
import { zodPlatformElectronFragment } from './fragments/electron';
import { zodPlatformWindowsFragment } from './fragments/windows';
import { zodPlatformReactNativeFragment } from './fragments/reactNative';

export const PlatformWindowsSchema = zodCommonSchemaFragment.merge(
    z.object({
        ...zodPlatformBaseFragment,
        ...zodPlatformElectronFragment,
        ...zodPlatformReactNativeFragment,
        ...zodPlatformWindowsFragment,
    })
);
