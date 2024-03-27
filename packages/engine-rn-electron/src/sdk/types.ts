import { NpmPackageFile } from '@rnv/core';

export type FileElectronPackage = NpmPackageFile & {
    productName?: string;
};
