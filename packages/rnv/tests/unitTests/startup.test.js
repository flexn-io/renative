import { createRnvConfig } from '../../src/configTools/configParser';

describe('Bootstrapping the CLI', () => {
    it('It should create C correctly', async () => {
        const c = createRnvConfig({ program: true }, { process: true }, { cmd: true }, { subCmd: true });
        expect(Object.keys(c).sort()).toEqual(['cli', 'command', 'files', 'paths', 'platform', 'platformDefaults', 'process', 'program', 'runtime', 'subCommand']);
    });
});
