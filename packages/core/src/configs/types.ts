export type NpmPackageFile = {
    version?: string;
    devDependencies?: Record<string, string>;
    dependencies?: Record<string, string>;
    peerDependencies?: Record<string, string>;
    optionalDependencies?: Record<string, string>;
    author?: string;
    license?: string;
    description?: string;
    'release-it'?: Record<string, any>;
    name: string;
};

export type NpmPackageFileKey = keyof NpmPackageFile;

export type NpmDepKey = 'dependencies' | 'devDependencies' | 'peerDependencies';
