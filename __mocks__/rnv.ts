// __mocks__/rnv.ts
const rnv: any = jest.createMockFromModule('rnv');

rnv.getEngineRunnerByPlatform = () => ({
    getOriginalPlatformTemplatesDir: () => 'sometemptdir',
});
rnv.executeTask = jest.fn();
rnv.shouldSkipTask = () => false;
rnv.generatePlatformChoices = () => [];
rnv.executeAsync = jest.fn();
rnv.removeDirs = jest.fn();
rnv.fsExistsSync = () => true;
rnv.fsReaddirSync = () => [];
rnv.getRealPath = () => '';
rnv.copyFolderContentsRecursiveSync = jest.fn();

module.exports = rnv;
