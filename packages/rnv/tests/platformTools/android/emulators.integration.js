import shell from 'shelljs';

describe('It deals with Android emulators correctly', () => {
    const { DOCKER } = process.env;
    // for some reason, adding an avd here does not work for docker
    if (DOCKER !== 'true') {
        console.log('NOT DOCKER ENV. will create avd ');

        beforeAll(async (done) => {
            //RUN rnv command to trigget SDK installations
            const output = await shell.exec('rnv target list -p android --ci --mono');
            try {
              console.log('TRY: avdmanager create');
              await shell.exec(
                  'echo no | /home/travis/Android/tools/bin/avdmanager create avd -n android_test -k "system-images;android-28;google_apis_playstore;x86"'
              );

            } catch (e) {
              console.log('ERROR: avdmanager not supported. trying android');
              await shell.exec(
                  'echo no | /home/travis/Android/tools/android create avd -n android_test -t android-28 --abi x86'
              );
            }


            done();
        });
    } else {
      console.log('DOCKER ENV. skipping create avd ');
    }

    it('Should return one phone emulator', async () => {
        const output = await shell.exec('rnv target list -p android --ci --mono');
        expect(output.stdout).toMatch('android_test');
    });

    it('Should return no TV emulator', async () => {
        const output = await shell.exec('rnv target list -p androidtv --ci --mono');
        expect(output.stdout).toMatch('No devices found');
    });

    it('Should return no Wear emulator', async () => {
        const output = await shell.exec('rnv target list -p androidwear --ci --mono');
        expect(output.stdout).toMatch(' No devices found');
    });
});
