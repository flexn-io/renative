import task from '../task.rnv.platform.list';

jest.mock('../../core/engineManager/index.js', () => ({
    executeTask: () => {}
}));
jest.mock('../../core/engineManager/index.js', () => ({
    logToSummary: () => {}
}));


const c = {
    runtime: {
        supportedPlatforms: [
            {
                engine: 'engine-rn',
                platform: 'ios',
                isConnected: true,
                port: '0000',
                isValid: true
            }
        ]
    }
};

describe('Test task', () => {
    it('should execute task', async () => {
        task.fn(c);
        await expect(task.fn(c)).resolves.toEqual(true);
    });
});
