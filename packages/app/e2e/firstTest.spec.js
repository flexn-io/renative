describe('Example', () => {
    it('Should change background', async (done) => {
        await element(by.text('Try Me!')).tap();
        done();
    });
});
