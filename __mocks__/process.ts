const mock: any = jest.createMockFromModule('process');

mock.cwd = () => 'mocked value';

module.exports = mock;
