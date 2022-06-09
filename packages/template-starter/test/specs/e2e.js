const FlexnRunner = require('@flexn/graybox').default;

describe('Test Template Starter', () => {
    before(() => {
        FlexnRunner.launchApp();
    });

    it('--> check if elements are displayed in Home Page', async () => {
        await FlexnRunner.expectToBeDisplayedById('template-starter-home-screen-renative-icon');
        await FlexnRunner.expectToBeDisplayedById('template-starter-home-screen-welcome-message');
        await FlexnRunner.expectToBeDisplayedById('template-starter-home-screen-version-number');
        await FlexnRunner.expectToBeDisplayedById('template-starter-try-my-button');
        await FlexnRunner.expectToBeDisplayedById('template-starter-now-try-my-button');
    });

    it('--> check if My Page opens when "My Page" button is selected', async () => {
        await FlexnRunner.waitForDisplayedById('template-starter-home-screen-renative-icon');
        if (process.env.PLATFORM === 'android') {
            // eslint-disable-next-line no-undef
            const drawerButton = await $('/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[2]/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[2]/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[1]/android.view.ViewGroup[2]/android.view.ViewGroup[1]/android.view.ViewGroup/android.widget.TextView');
            await drawerButton.click();
        } else if (process.env.PLATFORM === 'ios') {
            await FlexnRunner.clickById('template-starter-menu-drawer-icon');
        }
        await FlexnRunner.clickById('template-starter-menu-my-page-button');
        // should be 1 click, 2 are needed for ATV due to bug
        if (process.env.PLATFORM === 'androidtv') {
            await FlexnRunner.pressButtonRight(2);
        } else {
            await FlexnRunner.pressButtonRight(1);
        }
        await FlexnRunner.pressButtonSelect(1);
        await FlexnRunner.expectToBeDisplayedById('template-starter-my-page-text-container');
        if (process.env.PLATFORM === 'ios' || process.env.PLATFORM === 'macos') {
            await FlexnRunner.clickById('header-back');
        } else if (process.env.PLATFORM === 'android') {
            await FlexnRunner.clickById('home, back');
        } else {
            await FlexnRunner.clickById('template-starter-menu-home-button');
        }
        await FlexnRunner.pressButtonLeft(1);
        await FlexnRunner.pressButtonSelect(1);
        await FlexnRunner.expectToBeDisplayedById('template-starter-home-screen-renative-icon');
    });

    it('--> check if My Modal opens when "My Modal" button is selected', async () => {
        await FlexnRunner.waitForDisplayedById('template-starter-home-screen-renative-icon');
        if (process.env.PLATFORM === 'android') {
            // eslint-disable-next-line no-undef
            const drawerButton = await $('/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[2]/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[2]/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[1]/android.view.ViewGroup[2]/android.view.ViewGroup[1]/android.view.ViewGroup/android.widget.TextView');
            await drawerButton.click();
        } else if (process.env.PLATFORM === 'ios') {
            await FlexnRunner.clickById('template-starter-menu-drawer-icon');
        }
        await FlexnRunner.clickById('template-starter-menu-my-modal-button');
        await FlexnRunner.pressButtonRight(2);
        await FlexnRunner.pressButtonSelect(1);
        await FlexnRunner.expectToBeDisplayedById('template-starter-modal-screen-text-container');
        await FlexnRunner.clickById('template-starter-modal-screen-close-button');
        // below line should be removed, needed for TV's due to bug
        await FlexnRunner.pressButtonRight(1);
        await FlexnRunner.pressButtonSelect(1);
        await FlexnRunner.expectToBeDisplayedById('template-starter-home-screen-renative-icon');
    });

    // skipping because after clicking "Now Try Me!" TV's have no focus
    it.skip('--> check if My Page opens when "Now Try Me!" button is selected', async () => {
        await FlexnRunner.waitForDisplayedById('template-starter-home-screen-renative-icon');
        await FlexnRunner.clickById('template-starter-now-try-my-button');
        await FlexnRunner.pressButtonRight(2);
        // should be 2 clicks, 3 are needed for ATV due to bug
        if (process.env.PLATFORM === 'androidtv') {
            await FlexnRunner.pressButtonDown(3);
        } else {
            await FlexnRunner.pressButtonDown(2);
        }
        await FlexnRunner.pressButtonSelect(1);
        await FlexnRunner.expectToBeDisplayedById('template-starter-my-page-text-container');
        if (process.env.PLATFORM === 'ios' || process.env.PLATFORM === 'macos') {
            await FlexnRunner.clickById('header-back');
        } else if (process.env.PLATFORM === 'android') {
            await FlexnRunner.clickById('home, back');
        } else {
            await FlexnRunner.clickById('template-starter-menu-home-button');
        }
        await FlexnRunner.pressButtonLeft(1);
        await FlexnRunner.pressButtonSelect(1);
        await FlexnRunner.expectToBeDisplayedById('template-starter-home-screen-renative-icon');
    });
});
