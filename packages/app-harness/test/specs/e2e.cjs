const FlexnRunner = require('@flexn/graybox').default;

describe('Test App Harness', () => {
    before(() => {
        FlexnRunner.launchApp();
    });

    it('--> Hermes Support ', async () => {
        await FlexnRunner.waitForDisplayedById('app-harness-home-renative-image');
        if (process.env.PLATFORM === 'web') {
            await FlexnRunner.expectToHaveTextById('app-harness-home-hermes-support-text', 'hermes: no');
        } else {
            await FlexnRunner.expectToHaveTextById('app-harness-home-hermes-support-text', 'hermes: yes');
        }
    });

    it('--> Native Call', async () => {
        await FlexnRunner.clickById('app-harness-home-native-call-button');
        if (process.env.PLATFORM === 'web') {
            await FlexnRunner.expectToHaveTextById(
                'app-harness-home-logs-text-2',
                'NativeModules not supported in web'
            );
        } else if (process.env.PLATFORM === 'android') {
            await FlexnRunner.expectToHaveTextById(
                'app-harness-home-logs-text-3',
                'Event called with name: testName and location: testLocation'
            );
        } else if (process.env.PLATFORM === 'ios') {
            await FlexnRunner.expectToHaveTextById(
                'app-harness-home-logs-text-3',
                'NativeModules not supported for this platform'
            );
        }
    });

    it('--> Request permissions', async () => {
        await FlexnRunner.clickById('app-harness-home-request-permissions-button');
        if (process.env.PLATFORM === 'web') {
            await FlexnRunner.expectToHaveTextById(
                'app-harness-home-logs-text-3',
                'Permissions: requestPermissions not supported on this platform'
            );
        } else if (process.env.PLATFORM === 'ios') {
            await FlexnRunner.clickByText('Allow');
            await FlexnRunner.expectToHaveTextById('app-harness-home-logs-text-4', 'Permissions: granted');
        } else if (process.env.PLATFORM === 'android') {
            await FlexnRunner.clickByText('Allow');
            await FlexnRunner.expectToHaveTextById('app-harness-home-logs-text-4', 'Permissions: granted');
        }
    });

    it('--> Orientation support ', async () => {
        await FlexnRunner.clickById('app-harness-home-toggle-video-button');
        if (process.env.PLATFORM !== 'web') {
            await FlexnRunner.scrollById(
                'app-harness-home-landscape-video-text',
                'down',
                'app-harness-home-hermes-support-text'
            );
        }
        await FlexnRunner.expectToBeDisplayedById('app-harness-home-landscape-video-text');
        await FlexnRunner.clickById('app-harness-home-toggle-video-button');
    });

    it('--> Image Support ', async () => {
        await FlexnRunner.expectToBeDisplayedById('app-harness-home-image-support-image');
    });

    it('--> Cast Support ', async () => {
        if (process.env.PLATFORM === 'web' || process.env.PLATFORM === 'ios') {
            await FlexnRunner.expectToHaveTextById('app-harness-home-cast-support-text', 'Not supported');
        } else if (process.env.PLATFORM === 'android') {
            await FlexnRunner.clickById('app-harness-home-cast-support-button');
            await FlexnRunner.expectToBeDisplayedByText('Cast to');
            await FlexnRunner.waitForDisplayedByText('OK');
            await FlexnRunner.expectToBeDisplayedByText('OK');
        }
    });

    // IN PROGRESS
    // it('--> Splash Screen', async () => {
    //     await FlexnRunner.clickById('app-harness-home-splash-screen-button');
    //     if (process.env.PLATFORM === 'web') {
    //         await FlexnRunner.expectToHaveTextById(
    //             'app-harness-home-logs-text-3',
    //             'SplashScreen.show not supported on this platform'
    //         );
    //     } else {
    //         await FlexnRunner.expectToBeDisplayedById('');
    //     }
    // });
});
