export const RnvFolderName = {
    // non compiled static iles used by rnv modules
    templateFiles: 'templateFiles',
    // special folder for overriding source during copy of includedPaths.
    // it mimics the same structure as the root folder of template
    templateOverrides: 'templateOverrides',
    // Standard node_modules folder
    nodeModules: 'node_modules',
    // RNV generates all actual projects (xcode, android, webpack...) in this folder
    platformBuilds: 'platformBuilds',
    // RNV generates all assets (images, fonts...) in this folder from selected appConfig
    platformAssets: 'platformAssets',
    // Special RNV foled where local (excluded from git) files are stored and generated
    dotRnv: '.rnv',
    // Special folder for storing npm package snapshots before replacing with symlink
    // Allows reversing back to snapshot if needed (rnv link / rnv unlink)
    npmCache: 'npm_cache',
    // Convention folder for storing secrets per projects managed by rnv crypto
    secrets: 'secrets',
    // Special folder for storing all build hooks in your project
    buildHooks: 'buildHooks',
    // Any parent folder (used with path.join())
    UP: '..',
} as const;
