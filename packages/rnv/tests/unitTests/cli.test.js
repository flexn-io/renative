import { createRnvConfig, generateBuildConfig } from '../../src/configTools/configParser';
import runTarget from '../../src/cli/target';
import runPlugin from '../../src/cli/plugin';
import runPlatform from '../../src/cli/platform';
import run from '../../src/cli/runner';

describe('Testing target functions', () => {
    it('target list should throw correct error', async () => {
        const c = createRnvConfig({ platform: 'android' }, { process: true }, { cmd: true }, 'list');
        generateBuildConfig(c);
        await expect(runTarget(c)).rejects.toThrow('Platform unsupported for automated SDK setup');
    });

    it('target launch should resolve', async () => {
        const c = createRnvConfig({ platform: 'android', target: 'emu' }, { process: true }, { cmd: true }, 'launch');
        generateBuildConfig(c);
        await expect(runTarget(c)).resolves;
        // return runTarget(c).catch(err => expect(err).toMatch('Location of your cli'));
    });
});

describe('Testing plugin functions', () => {
    it('plugin list should resolve', async () => {
        const c = createRnvConfig({ platform: 'android' }, { process: true }, { cmd: true }, 'list');
        generateBuildConfig(c);
        await expect(runPlugin(c)).resolves;
    });
});

describe('Testing platform functions', () => {
    it('platform list should resolve', async () => {
        const c = createRnvConfig({ platform: 'android' }, { process: true }, { cmd: true }, 'list');
        generateBuildConfig(c);
        c.buildConfig = { defaults: { supportedPlatforms: ['ios', 'android'] }, common: {} };
        await expect(runPlatform(c)).resolves;
    });
});
