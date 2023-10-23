// __mocks__/@rnv/sdk-apple.ts
const sdkApple: any = jest.createMockFromModule('@rnv/sdk-apple');

sdkApple.launchAppleSimulator = () => null;

module.exports = sdkApple;
