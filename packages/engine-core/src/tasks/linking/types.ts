export type LinkablePackage = {
    name: string;
    sourcePath: string;
    sourcePathRelative: string;
    nmPath: string;
    unlinkedPath: string;
    cacheDir: string;
    skipLinking: boolean;
    isLinked: boolean;
    isBrokenLink: boolean;
    nmPathExists: boolean;
    unlinkedPathExists: boolean;
};
export type RnvPackage = {
    packageName: string;
    folderName: string;
    skipLinking?: boolean;
};
