const FlexnRunner = require('@flexn/graybox').default;

describe('Test template', () => {
    before(() => {
        FlexnRunner.launchApp();
    });

    // TESTS ARE WORKING ON THESE PLATFORMS: web, iOS, Android
    
    it('--> check if elements exist in Home screen', async () => {
        await FlexnRunner.expectToBeExistingById('template-hello-world-home-screen-renative-icon');
        await FlexnRunner.expectToBeExistingById('template-hello-world-home-screen-welcome-message');
        await FlexnRunner.expectToBeExistingByText('Hello ReNative!');
        await FlexnRunner.expectToBeExistingById('template-hello-world-home-screen-version-number');
        await FlexnRunner.expectToBeExistingById('template-hello-world-github-button');
        await FlexnRunner.expectToBeExistingById('template-hello-world-renative-button');
        await FlexnRunner.expectToBeExistingById('template-hello-world-twitter-button');
    });

    it('--> check if "Try my!" button is clickable', async () => {
        await FlexnRunner.expectToBeExistingById('template-hello-world-try-my-button');
        await FlexnRunner.clickById('template-hello-world-try-my-button');
        await FlexnRunner.pause(2000);
        await FlexnRunner.clickById('template-hello-world-try-my-button');
    });

    it('--> check if "Now try my!" button is clickable', async () => {
        await FlexnRunner.expectToBeExistingById('template-hello-world-now-try-my-button');
        await FlexnRunner.clickById('template-hello-world-now-try-my-button');
        FlexnRunner.pressButtonDown(1);
        FlexnRunner.pressButtonSelect(1);
        await FlexnRunner.expectToBeExistingById('template-hello-world-my-page-text-container');
        await FlexnRunner.expectToBeExistingByText('This is my Page!');
        if (process.env.PLATFORM === 'web' || process.env.PLATFORM === 'macos') {
            await FlexnRunner.clickById('template-hello-world-menu-home-button');
        } if (process.env.PLATFORM === 'ios') {
            await FlexnRunner.clickById('header-back');
        } if (process.env.PLATFORM === 'android') {
            await driver.back();
        } else {
            await FlexnRunner.pressButtonLeft(1);
            await FlexnRunner.pressButtonSelect(1);
        }
    });

    it('--> check if modal page opens when "My modal" button is selected', async () => {
        if (process.env.PLATFORM === 'ios') {
            await FlexnRunner.clickById('template-hello-world-menu-drawer-icon');
            await FlexnRunner.clickById('template-hello-world-menu-my-modal-button');
        } if (process.env.PLATFORM === 'android') {
            // can't found menu icon on Android
            await FlexnRunner.pause(2000);
        } if (process.env.PLATFORM === 'web' || process.env.PLATFORM === 'macos') {
            await FlexnRunner.clickById('template-hello-world-menu-my-modal-button');
        } else {
            await FlexnRunner.pressButtonLeft(1);
            await FlexnRunner.pressButtonDown(2);
            await FlexnRunner.pressButtonSelect(1);
        }
        await FlexnRunner.expectToBeExistingById('template-hello-world-modal-screen-text-container');
        await FlexnRunner.expectToBeExistingByText('This is my Modal!');
        await FlexnRunner.clickById('template-hello-world-modal-screen-close-button');
        await FlexnRunner.expectToBeExistingById('template-hello-world-home-screen-renative-icon');
    });
});
