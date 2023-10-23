// __mocks__/child_process.ts

const child_process: any = jest.createMockFromModule('child_process');

child_process.spawn = jest.fn();

module.exports = child_process;
