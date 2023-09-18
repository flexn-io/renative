// __mocks__/axios.ts
const axios: any = jest.createMockFromModule('axios');

axios.get = () => true;

module.exports = axios;
