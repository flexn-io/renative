const FlexnRunner = require('@flexn/graybox').default;

describe('Test App Harness', () => {
    before(() => {
        FlexnRunner.launchApp();
    });

    it('--> check if ReNative logo is displayed in Home Page', async () => {
        await FlexnRunner.expectToBeDisplayedById('app-harness-home-screen-renative-image');
    });
});
