import { createRnvConfig, generateBuildConfig } from '../../src/configTools/configParser';
import runPlatform from '../../src/cli/platform';
import run from '../../src/cli/runner';
import cli from '../../src/cli';

describe('Testing target functions', () => {
    it('target list should throw correct error', async () => {
        const c = createRnvConfig({ platform: 'android' }, { process: true }, 'target', 'list');
        generateBuildConfig(c);
        await expect(cli(c)).rejects.toThrow('Platform unsupported for automated SDK setup');
    });

    it('target launch should resolve', async () => {
        const c = createRnvConfig({ platform: 'android', target: 'emu' }, { process: true }, 'target', 'launch');
        generateBuildConfig(c);
        await expect(cli(c)).resolves;
        // return runTarget(c).catch(err => expect(err).toMatch('Location of your cli'));
    });
});

describe('Testing plugin functions', () => {
    it('plugin list should resolve', async () => {
        const c = createRnvConfig({ platform: 'android' }, { process: true }, 'plugin', 'list');
        generateBuildConfig(c);
        await expect(cli(c)).resolves;
    });
});

describe('Testing platform functions', () => {
    it('platform list should resolve', async () => {
        const c = createRnvConfig({ platform: 'android' }, { process: true }, 'plugin', 'list');
        generateBuildConfig(c);
        c.buildConfig = { defaults: { supportedPlatforms: ['ios', 'android'] }, common: {} };
        await expect(cli(c)).resolves;
    });
});
