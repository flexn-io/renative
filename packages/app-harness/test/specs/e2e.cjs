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
        // https://github.com/flexn-io/renative/issues/1733
        if (process.env.PLATFORM === 'androidtv') {
            await FlexnRunner.pressButtonDown(2);
        }
        await FlexnRunner.pressButtonSelect(1);
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
        } else if (process.env.PLATFORM === 'androidtv') {
            await FlexnRunner.expectToHaveTextById(
                'app-harness-home-logs-text-1',
                'NativeModules not supported for this platform'
            );
        } else if (process.env.PLATFORM === 'tvos') {
            await FlexnRunner.expectToHaveTextById(
                'app-harness-home-logs-text-2',
                'NativeModules not supported for this platform'
            );
        }
    });

    it('--> Orientation support ', async () => {
        await FlexnRunner.clickById('app-harness-home-toggle-video-button');
        await FlexnRunner.pressButtonDown(1);
        await FlexnRunner.pressButtonSelect(1);
        if (process.env.PLATFORM === 'ios' || process.env.PLATFORM === 'android') {
            await FlexnRunner.scrollById(
                'app-harness-home-landscape-video-text',
                'down',
                'app-harness-home-hermes-support-text'
            );
        }
        await FlexnRunner.expectToBeDisplayedById('app-harness-home-landscape-video-text');
        await FlexnRunner.clickById('app-harness-home-toggle-video-button');
        await FlexnRunner.pressButtonSelect(1);
    });

    it('--> Image Support ', async () => {
        await FlexnRunner.pressButtonDown(2);
        await FlexnRunner.expectToBeDisplayedById('app-harness-home-image-support-image');
    });

    it('--> Cast Support ', async () => {
        if (process.env.PLATFORM === 'android') {
            await FlexnRunner.clickById('app-harness-home-cast-support-button');
            await FlexnRunner.expectToBeDisplayedByText('Cast to');
            await FlexnRunner.waitForDisplayedByText('OK');
            await FlexnRunner.expectToBeDisplayedByText('OK');
        } else {
            await FlexnRunner.expectToHaveTextById('app-harness-home-cast-support-text', 'Not supported');
        }
    });
});
