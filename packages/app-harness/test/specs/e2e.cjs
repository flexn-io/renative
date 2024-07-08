const FlexnRunner = require('@flexn/graybox').default;

describe('Test App Harness', () => {
    before(() => {
        FlexnRunner.launchApp();
    });

    // done
    it('--> Hermes support ', async () => {
        await FlexnRunner.waitForDisplayedById('app-harness-home-screen-renative-image');
        if (process.env.PLATFORM === 'web') {
            await FlexnRunner.expectToHaveTextById('app-harness-home-screen-harmes-text', 'hermes: no');
        } else {
            await FlexnRunner.expectToHaveTextById('app-harness-home-screen-harmes-text', 'hermes: yes');
        }
    });

    // done
    it('--> Native call', async () => {
        await FlexnRunner.clickById('app-harness-home-screen-native-call-button');
        if (process.env.PLATFORM === 'web') {
            await FlexnRunner.expectToHaveTextById(
                'app-harness-home-screen-logs-text-2',
                'NativeModules not supported in web'
            );
        } else if (process.env.PLATFORM === 'android') {
            await FlexnRunner.expectToHaveTextById(
                'app-harness-home-screen-logs-text-3',
                'Event called with name: testName and location: testLocation'
            );
        } else if (process.env.PLATFORM === 'ios') {
            await FlexnRunner.expectToHaveTextById(
                'app-harness-home-screen-logs-text-3',
                'NativeModules not supported for this platform'
            );
        }
    });

    // done
    it('--> Request permissions', async () => {
        await FlexnRunner.clickById('app-harness-home-request-permissions-button');
        if (process.env.PLATFORM === 'web') {
            await FlexnRunner.expectToHaveTextById(
                'app-harness-home-screen-logs-text-3',
                'Permissions: requestPermissions not supported on this platform'
            );
        } else if (process.env.PLATFORM === 'ios') {
            await FlexnRunner.clickByText('Allow');
            await FlexnRunner.expectToHaveTextById('app-harness-home-screen-logs-text-4', 'Permissions: granted');
        } else if (process.env.PLATFORM === 'android') {
            await FlexnRunner.clickByText('ALLOW');
            await FlexnRunner.expectToHaveTextById('app-harness-home-screen-logs-text-4', 'Permissions: granted');
        }
    });

    // done
    it('--> Orientation support ', async () => {
        await FlexnRunner.clickById('app-harness-home-toggle-video-button');
        if (process.env.PLATFORM !== 'web') {
            await FlexnRunner.scrollById(
                'app-harness-home-landscape-video',
                'down',
                'app-harness-home-screen-harmes-text'
            );
        }
        await FlexnRunner.expectToBeDisplayedById('app-harness-home-landscape-video');
        await FlexnRunner.clickById('app-harness-home-toggle-video-button');
    });

    // done
    it('--> Image Support ', async () => {
        await FlexnRunner.expectToBeDisplayedById('app-harness-home-image-support');
    });

    // done
    it('--> Cast support ', async () => {
        if (process.env.PLATFORM === 'web' || process.env.PLATFORM === 'ios') {
            await FlexnRunner.expectToHaveTextById('app-harness-home-cast-support', 'Not supported');
        } else if (process.env.PLATFORM === 'android') {
            await FlexnRunner.clickById('app-harness-home-cast-button');
            await FlexnRunner.expectToBeDisplayedByText('Cast to');
            await FlexnRunner.waitForDisplayedByText('OK');
            await FlexnRunner.expectToBeDisplayedByText('OK');
        }
    });

    if (process.env.PLATFORM === 'web') {
        it('--> Splash Screen', async () => {
            await FlexnRunner.clickById('app-harness-home-splash-screen-button');
            await FlexnRunner.expectToHaveTextById(
                'app-harness-home-screen-logs-text-4',
                'SplashScreen.show not supported on this platform'
            );
        });
    }

    if (process.env.PLATFORM === 'web') {
        it('--> PhotoEditor', async () => {
            await FlexnRunner.clickById('app-harness-home-request-photo-editor-button');
            await FlexnRunner.expectToHaveTextById(
                'app-harness-home-screen-logs-text-5',
                'PhotoEditor not supported on this platform'
            );
        });
    }
});
