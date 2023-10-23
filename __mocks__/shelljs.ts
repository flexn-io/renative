// __mocks__/rnv.ts
const shelljs: any = jest.createMockFromModule('shelljs');

shelljs.mkdir = () => {
    //NOOP
};

module.exports = shelljs;
