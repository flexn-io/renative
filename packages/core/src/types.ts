import type { ConfigFileBuildConfig } from './schema';
import { RnvCommonBuildSchemeSchema, RnvCommonSchemaFragment } from './schema/common';
import { RnvPlatformBuildSchemeSchema, RnvPlatformSchemaFragment } from './schema/platforms';
import type { PlatformKey } from './schema/types';

export * from './schema/configFiles/types';

export type RnvPlatform = PlatformKey | null;

export type RenativeConfigVersion = string | { version: string };

export type RnvError = any;

export type Env = Record<string, any>;

export type PlatPropKey = keyof RnvPlatformSchemaFragment; // We Request keys excluding buildScheme (not RnvPlatformSchema)
export type PlatformBuildSchemeKey = keyof RnvPlatformBuildSchemeSchema;
export type CommonBuildSchemeKey = keyof RnvCommonBuildSchemeSchema;
export type CommonPropKey = keyof RnvCommonSchemaFragment; // We Request keys excluding buildScheme (not RnvCommonSchema)
export type BuildConfigKey = keyof ConfigFileBuildConfig;
