// __mocks__/@rnv/sdk-webpack.ts
const sdkWebpack: any = jest.createMockFromModule('@rnv/sdk-webpack');

sdkWebpack.runWebpackServer = jest.fn();
module.exports = sdkWebpack;
