const FlexnRunner = require('@flexn/graybox').default;

describe('Test App Harness', () => {
    before(() => {
        FlexnRunner.launchApp();
    });

    it('--> check if element has correct text in Home Page', async () => {
        await FlexnRunner.expectToHaveTextById('app-harness-home-screen-intro-text', 'ReNative Harness');
    });
});
