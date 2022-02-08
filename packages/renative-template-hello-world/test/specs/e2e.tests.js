const FlexnRunner = require('@flexn/graybox').default;

describe('Test template', () => {
    before(() => {
        FlexnRunner.launchApp();
    });

    // TESTS ARE WORKING ON THESE PLATFORMS: web, iOS, Android, WEB, tvOS, macOS
    it('--> check if elements exist in Home screen', async () => {
        if (process.env.PLATFORM === 'tvos' || process.env.PLATFORM === 'androidtv') {
            await FlexnRunner.getElementById('template-hello-world-home-screen-renative-icon');
            await FlexnRunner.getElementById('template-hello-world-home-screen-welcome-message');
            // await FlexnRunner.getElementByText('Hello ReNative!');
            await FlexnRunner.getElementById('template-hello-world-home-screen-version-number');
            await FlexnRunner.getElementById('template-hello-world-github-button');
            await FlexnRunner.getElementById('template-hello-world-renative-button');
            await FlexnRunner.getElementById('template-hello-world-twitter-button');
        } else {
            await FlexnRunner.expectToBeExistingById('template-hello-world-home-screen-renative-icon');
            await FlexnRunner.expectToBeExistingById('template-hello-world-home-screen-welcome-message');
            // await FlexnRunner.expectToBeExistingByText('Hello ReNative!');
            await FlexnRunner.expectToBeExistingById('template-hello-world-home-screen-version-number');
            await FlexnRunner.expectToBeExistingById('template-hello-world-github-button');
            await FlexnRunner.expectToBeExistingById('template-hello-world-renative-button');
            await FlexnRunner.expectToBeExistingById('template-hello-world-twitter-button');
        }
    });

    it('--> check if modal page opens when "My modal" button is selected', async () => {
        if (process.env.PLATFORM === 'ios') {
            await FlexnRunner.waitForDisplayedById('template-hello-world-menu-drawer-icon');
            await FlexnRunner.clickById('template-hello-world-menu-drawer-icon');
            await FlexnRunner.clickById('template-hello-world-menu-my-modal-button');
            await FlexnRunner.expectToBeExistingById('template-hello-world-modal-screen-text-container');
            await FlexnRunner.clickById('template-hello-world-modal-screen-close-button');
        } if (process.env.PLATFORM === 'android') {
            // can't found menu icon on Android
            await FlexnRunner.pause(2000);
        } if (process.env.PLATFORM === 'web' || process.env.PLATFORM === 'macos') {
            await FlexnRunner.clickById('template-hello-world-menu-my-modal-button');
            await FlexnRunner.expectToBeExistingById('template-hello-world-modal-screen-text-container');
            await FlexnRunner.clickById('template-hello-world-modal-screen-close-button');
        } else {
            await FlexnRunner.pressButtonRight(2);
            await FlexnRunner.pressButtonSelect(2);
            await FlexnRunner.getElementById('template-hello-world-modal-screen-text-container');
            await FlexnRunner.getElementByText('This is my Modal!');
            await FlexnRunner.pressButtonRight(1);
            await FlexnRunner.pressButtonSelect(2);
            await FlexnRunner.getElementById('template-hello-world-home-screen-renative-icon');
        }
    });

    it('--> check if "Try my!" button is clickable', async () => {
        if (process.env.PLATFORM === 'tvos' || process.env.PLATFORM === 'androidtv') {
            await FlexnRunner.pressButtonRight(2);
            await FlexnRunner.pressButtonDown(1);
            await FlexnRunner.pressButtonSelect(1);
            await FlexnRunner.pause(2000);
            await FlexnRunner.pressButtonSelect(1);
            await FlexnRunner.getElementById('template-hello-world-home-screen-renative-icon');
        } else {
            await FlexnRunner.expectToBeExistingById('template-hello-world-try-my-button');
            await FlexnRunner.clickById('template-hello-world-try-my-button');
            await FlexnRunner.pause(2000);
            await FlexnRunner.clickById('template-hello-world-try-my-button');
        }
    });

    it('--> check if "Now try my!" button is clickable', async () => {
        if (process.env.PLATFORM === 'macos') {
            await FlexnRunner.clickById('template-hello-world-now-try-my-button');
            await FlexnRunner.waitForDisplayedById('template-hello-world-my-page-text-container');
            await FlexnRunner.clickById('template-hello-world-menu-home-button');
            await FlexnRunner.expectToBeExistingById('template-hello-world-home-screen-renative-icon');
            await FlexnRunner.getElementById('template-hello-world-home-screen-renative-icon');
        } if (process.env.PLATFORM === 'ios' || process.env.PLATFORM === 'android' || process.env.PLATFORM === 'web') {
            await FlexnRunner.clickById('template-hello-world-now-try-my-button');
            await FlexnRunner.expectToBeExistingById('template-hello-world-my-page-text-container');
            await FlexnRunner.expectToBeExistingByText('This is my Page!');
            await FlexnRunner.pressButtonBack(1);
            await FlexnRunner.getElementById('template-hello-world-home-screen-renative-icon');
        } else {
            await FlexnRunner.pressButtonDown(1);
            await FlexnRunner.pressButtonSelect(2);
            await FlexnRunner.getElementById('template-hello-world-my-page-text-container');
            // await FlexnRunner.getElementByText('This is my Page!');
            await FlexnRunner.pressButtonBack(1);
            await FlexnRunner.getElementById('template-hello-world-home-screen-renative-icon');
        }
    });
});
