import shell from 'shelljs';

describe('It deals with Android emulators correctly', () => {
    beforeAll(async (done) => {
        await shell.exec('echo no | avdmanager create avd -n android_test -k "system-images;android-28;default;x86"');
        done();
    });

    it('Should return one emulator', async () => {
        const output = await shell.exec('rnv target list -p android');
        expect(output.stdout).toMatch('android_test');
    });
});
