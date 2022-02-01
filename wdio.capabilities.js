const capabilities = {
    ios: [
        {
            platformName: 'iOS',
            deviceName: 'iPhone 11',
            platformVersion: '13.5',
            automationName: 'XCUITest',
            ...(process.env.SCHEME === 'prod' && { bundleId: 'my.bundleId' }),
            ...(process.env.SCHEME === 'alpha' && { bundleId: 'my.bundleId.alpha' }),
        },
    ],
    tvos: [
        {
            platformName: 'tvOS',
            deviceName: 'Apple TV',
            platformVersion: '14.4',
            automationName: 'XCUITest',
            ...(process.env.SCHEME === 'prod' && { bundleId: 'my.bundleId' }),
            ...(process.env.SCHEME === 'alpha' && { bundleId: 'my.bundleId.alpha' }),
        },
    ],
    android: [
        {
            platformName: 'Android',
            avd: 'Pixel_4_API_29',
            platformVersion: '10',
            automationName: 'UiAutomator2',
            ...(process.env.SCHEME === 'prod' && {
                appPackage: 'my.appPackage',
                appActivity: 'my.appActivity',
            }),
            ...(process.env.SCHEME === 'alpha' && {
                appPackage: 'my.appPackage.alpha',
                appActivity: 'my.appActivity.alpha',
            }),
        },
    ],
    androidtv: [
        {
            platformName: 'Android',
            avd: 'Android_TV_1080p_API_29',
            platformVersion: '10',
            automationName: 'UiAutomator2',
            ...(process.env.SCHEME === 'prod' && {
                appPackage: 'my.appPackage',
                appActivity: 'my.appActivity',
            }),
            ...(process.env.SCHEME === 'alpha' && {
                appPackage: 'my.appPackage.alpha',
                appActivity: 'my.appActivity.alpha',
            }),
        },
    ],
    macos: [
        {
            platformName: 'Mac',
            automationName: 'Mac2',
            ...(process.env.SCHEME === 'prod' && { bundleId: 'my.bundleId' }),
            ...(process.env.SCHEME === 'alpha' && { bundleId: 'my.bundleId.alpha' }),
        },
    ],
    web: [
        {
            browserName: 'chrome',
        },
        {
            browserName: 'firefox',
        },
        {
            browserName: 'MicrosoftEdge',
        },
        {
            browserName: 'safari',
        },
    ],
};

module.exports = { capabilities };