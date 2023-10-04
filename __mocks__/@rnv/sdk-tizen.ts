const sdkMock: any = jest.createMockFromModule('@rnv/sdk-tizen');

sdkMock.runTizen = jest.fn();
module.exports = sdkMock;
