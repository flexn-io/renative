import { NpmPackageFile } from '@rnv/core/lib/configs/types';

export type FileElectronPackage = NpmPackageFile & {
    productName?: string;
};
