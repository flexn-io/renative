// __mocks__/inquirer.ts
const inquirer: any = jest.createMockFromModule('inquirer');

inquirer.prompt = () => true;

module.exports = inquirer;
