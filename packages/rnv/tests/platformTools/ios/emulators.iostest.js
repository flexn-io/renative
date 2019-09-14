import shell from 'shelljs';

describe('It deals with iOS simulators correctly', () => {
    it('Should return at least one phone emulator', async () => {
        const output = await shell.exec('rnv target list -p ios');
        expect(output.stdout).toMatch('iPad');
    });
});
