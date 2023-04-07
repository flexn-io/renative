import path from 'path';
import { Common, FileUtils, Resolver, PluginManager, ProjectManager } from 'rnv';
// import { logWarning } from 'rnv/dist/core/systemManager/logger';

const {
    fsExistsSync,
    copyFileSync,
    fsWriteFileSync,
    fsReadFileSync,
    copyFolderContentsRecursiveSync,
    // cleanEmptyFoldersRecursively,
    fsMkdirSync
} = FileUtils;
const {
    getAppFolder,
    getConfigProp,
} = Common;
const { doResolvePath } = Resolver;

const {
    parseFonts
} = ProjectManager;

const {
    parsePlugins,
    // sanitizePluginPath, includesPluginPath
} = PluginManager;

export const ejectGradleProject = async (c: any) => {
    const isMonorepo = getConfigProp(c, c.platform, 'isMonorepo');
    const monoRoot = getConfigProp(c, c.platform, 'monoRoot');

    const rootMonoProjectPath = isMonorepo ? path.join(c.paths.project.dir, monoRoot || '../..') : c.paths.project.dir;
    const rootProjectPath = c.paths.project.dir;

    const appFolder = getAppFolder(c);
    // const appFolderName = getAppFolderName(c, c.platform);


    console.log('EJECTOR', rootMonoProjectPath, rootProjectPath, appFolder);
    
};
