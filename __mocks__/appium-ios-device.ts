// __mocks__/appium-ios-device.ts
const aid: any = {
    utilities: {
        getConnectedDevices: jest.fn(() => Promise.resolve(['1234'])),
        getDeviceInfo: jest.fn(() => Promise.resolve({ name: 'iPhone 14 Pro Max', isAvailable: true })),
    },
};

module.exports = aid;
