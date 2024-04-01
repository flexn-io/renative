import { type PlatformKey } from './enums/platformName';

export type RnvPlatform = PlatformKey | null;
export type RenativeConfigVersion = string | { version: string };
export type RnvError = any;
export type Env = Record<string, any>;
