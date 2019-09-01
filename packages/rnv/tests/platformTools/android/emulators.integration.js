import shell from 'shelljs';

describe('It deals with Android emulators correctly', () => {
    const { DOCKER } = process.env;
    // for some reason, adding an avd here does not work for docker
    if (DOCKER !== 'true') {
        beforeAll(async (done) => {
            await shell.exec('echo no | avdmanager create avd -n android_test -k "system-images;android-28;default;x86"');
            done();
        });
    }

    it('Should return one phone emulator', async () => {
        const output = await shell.exec('rnv target list -p android');
        expect(output.stdout).toMatch('android_test');
    });

    it('Should return no TV emulator', async () => {
        const output = await shell.exec('rnv target list -p androidtv');
        expect(output.stdout).toMatch('No devices found');
    });

    it('Should return no Wear emulator', async () => {
        const output = await shell.exec('rnv target list -p androidwear');
        expect(output.stdout).toMatch('No devices found');
    });
});
