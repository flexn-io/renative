// this file is only for internal test functionality testing
const FlexnRunner = require('@flexn/graybox').default;

describe('Test template', () => {
    before(() => {
        FlexnRunner.launchApp();
    });
    it('pause for 10s', async () => {
        await FlexnRunner.pause(10000);
    });
});
