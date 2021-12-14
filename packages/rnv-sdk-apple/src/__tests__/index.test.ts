import runner from '../index'

console.log = jest.fn();

describe('test add function', () => {
    it('should return 15 for add(10,5)', () => {
        runner.foo();
        expect(console.log).toBeCalled();
    });
})


