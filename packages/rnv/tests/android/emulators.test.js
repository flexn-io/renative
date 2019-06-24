import shell from 'shelljs';

describe('It deals with Android emulators correctly', () => {
    beforeAll(async (done) => {
        await shell.exec('echo no | android create avd --force -n test_android -t android-28 --abi x86');
        done();
    });

    it('Should return one emulator', async () => {
        const output = await shell.exec('rnv target list -p android');
        expect(output.stdout).toMatch('test_android');
    });
});
