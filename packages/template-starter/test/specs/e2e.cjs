const FlexnRunner = require('@flexn/graybox').default;

describe('Test Template Starter', () => {
    before(() => {
        FlexnRunner.launchApp();
    });

    it('--> check if elements are displayed in Home Page', async () => {
        await FlexnRunner.expectToBeDisplayedById('template-starter-home-screen-renative-image');
        await FlexnRunner.expectToBeDisplayedById('template-starter-home-screen-welcome-message-text');
        await FlexnRunner.expectToBeDisplayedById('template-starter-home-screen-version-number-text');
        await FlexnRunner.expectToBeDisplayedById('template-starter-home-screen-try-my-button');
    });
});
